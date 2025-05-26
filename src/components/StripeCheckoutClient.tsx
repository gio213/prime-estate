"use client";
// Types for pricing plans and checkout
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PricingPlan, pricingPlans } from "@/constants/constats";
import { Button } from "./ui/button";
import { env } from "@/lib/env";

// Props for the checkout form component
interface CheckoutFormProps {
  selectedPlan: PricingPlan;
  userId: string;
  userEmail?: string;
  userName?: string;
  onPaymentSuccess?: (paymentIntent: any) => void;
  onPaymentError?: (error: string) => void;
}

// Props for the parent component
interface StripeCheckoutProps {
  productId: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  onPaymentSuccess?: (paymentIntent: any) => void;
  onPaymentError?: (error: string) => void;
}

// Load your Stripe publishable key
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component with TypeScript
const CheckoutForm: React.FC<CheckoutFormProps> = ({
  selectedPlan,
  userEmail,
  userId: string,
  userName,
  userId,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [email, setEmail] = useState<string>(userEmail || "");
  const [name, setName] = useState<string>(userName || "");

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Create a payment intent on the server when the component loads
    if (selectedPlan) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedPlan.productId,
          amount: selectedPlan.price,
          coinAmount: selectedPlan.credits,
          user_id: userId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((err) => {
          setError("Failed to initialize payment. Please try again.");
          if (onPaymentError) onPaymentError("Failed to initialize payment");
        });
    }
  }, [selectedPlan, onPaymentError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setProcessing(true);

    // Get the card element
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setProcessing(false);
      return;
    }

    // Confirm the payment
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: name,
          email: email,
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
      if (onPaymentError)
        onPaymentError(payload.error.message || "Payment failed");
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      if (onPaymentSuccess) onPaymentSuccess(payload.paymentIntent);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={!!userName}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={!!userEmail}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Card Information
        </label>
        <div className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <Button
        type="submit"
        disabled={processing || !stripe || !clientSecret || succeeded}
        className="w-full px-4 py-2 text-white font-medium bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
      >
        {processing
          ? "Processing..."
          : `Pay ${
              selectedPlan
                ? `${selectedPlan.currency} ${selectedPlan.price}`
                : ""
            }`}
      </Button>

      {succeeded && (
        <div className="text-green-600 font-medium">Payment succeeded!</div>
      )}
    </form>
  );
};

// Parent component that wraps the form with Stripe Elements
const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  productId,
  userEmail,
  userId,
  userName,
  onPaymentSuccess,
  onPaymentError,
}) => {
  // Find the selected plan based on productId
  const selectedPlan = pricingPlans.find(
    (plan) => plan.productId === productId
  );

  if (!selectedPlan) {
    return <div className="text-red-600 font-medium">Plan not found</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Complete Your Purchase
      </h2>
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-blue-600">{selectedPlan.icon}</div>
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedPlan.packageName}
          </h3>
          {selectedPlan.popular && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full ml-auto">
              Popular
            </span>
          )}
        </div>

        <p className="text-gray-700 font-medium">
          {selectedPlan.credits} Credits for {selectedPlan.currency}{" "}
          {selectedPlan.price}
        </p>

        {selectedPlan.savingsPercentage > 0 && (
          <p className="text-green-600 font-medium mt-1">
            You save {selectedPlan.savingsPercentage}%
          </p>
        )}
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          userId={userId}
          selectedPlan={selectedPlan}
          userEmail={userEmail}
          userName={userName}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
      </Elements>
    </div>
  );
};

export default StripeCheckout;
