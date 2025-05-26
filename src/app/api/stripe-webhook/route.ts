// app/api/webhook/route.ts (Next.js 13+ App Router)
// OR pages/api/webhook.ts (Next.js Pages Router)

import { refillCredit } from "@/actions/credit-action";
import { env } from "@/lib/env";
import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Your webhook secret
const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

// This config is needed to properly parse the raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to get the raw request body
async function getRawBody(req: NextRequest): Promise<Buffer> {
  const arr = [];
  for await (const chunk of req.body as any) {
    arr.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(arr);
}

// For Next.js App Router (Next.js 13+)
export async function POST(req: NextRequest) {
  try {
    // Get the raw request body for signature verification
    const rawBody = await getRawBody(req);
    // Get the signature header
    const signature = req.headers.get("stripe-signature") || "";
    let event: Stripe.Event;
    try {
      // Verify and construct the event
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }
    // Handle the event based on its type
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        // Handle the completed checkout session
        console.log("Checkout session completed:", checkoutSession.id);
        // Add your custom logic here, like:
        // - Fulfilling orders
        // - Emailing customers
        // - Adding credits to a user account

        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", paymentIntent.id);
        // Handle failed payment
        // - Update order status
        // - Notify customer
        break;
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
        // Handle successful payment
        // - Update order status
        // - Provision purchased products/services
        console.log("paymentMetadata", paymentIntent.metadata);
        await refillCredit(
          Number(paymentIntent.metadata.coin),
          paymentIntent.metadata.productId,
          paymentIntent.metadata.user_id
        );
        console.log("User credits updated successfully");

        break;
      }
      // You can add more event types as needed
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    // Acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
