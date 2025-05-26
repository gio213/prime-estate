// app/api/create-payment-intent/route.ts

import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, amount, coinAmount, user_id } = body;

    if (!productId || !amount) {
      return NextResponse.json(
        { error: "Product ID and amount are required" },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "eur", // Change this to your preferred currency

      // You can store metadata to associate the payment with your product
      metadata: {
        productId: productId,
        coin: coinAmount,
        user_id: user_id,
      },
      // Optionally set automatic_payment_methods to true for modern payment UIs
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error("Error creating payment intent:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
