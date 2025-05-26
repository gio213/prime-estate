"use client";
import React, { useState, ReactNode } from "react";
import { Check } from "lucide-react";

// Shadcn/ui components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PricingPlan, pricingPlans } from "@/constants/constats";
import Link from "next/link";

interface PricingCardProps {
  plan: PricingPlan;
  onPurchase: (plan: PricingPlan) => void;
  loading: string | null;
  selectedId: string | null;
}

/**
 * Formats a number as currency
 */
const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Component for an individual pricing card
 */
const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  onPurchase,
  loading,
  selectedId,
}) => {
  const isSelected = selectedId === plan.id;

  return (
    <Card
      className={`flex flex-col h-full transition-all duration-200 ${
        plan.popular ? "border-primary shadow-md" : ""
      }`}
    >
      {plan.popular && (
        <Badge className="absolute -top-2 right-6 bg-primary hover:bg-primary">
          Most Popular
        </Badge>
      )}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {plan.icon}
            <CardTitle className="text-lg ml-2">{plan.packageName}</CardTitle>
          </div>
          {plan.savingsPercentage > 0 && (
            <Badge
              variant="outline"
              className="text-green-600 border-green-200 bg-green-50"
            >
              Save {plan.savingsPercentage}%
            </Badge>
          )}
        </div>
        <div className="flex items-baseline mt-4">
          <span className="text-3xl font-bold">
            {formatCurrency(plan.price, plan.currency)}
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">
            one-time
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          <li className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-green-500" />
            <span>
              {plan.credits} credit{plan.credits > 1 ? "s" : ""}
            </span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-green-500" />
            <span>
              {formatCurrency(plan.pricePerCredit, plan.currency)} per credit
            </span>
          </li>
          {plan.savings > 0 && (
            <li className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              <span>Save {formatCurrency(plan.savings, plan.currency)}</span>
            </li>
          )}
          <li className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-green-500" />
            <span>No recurring charges</span>
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-green-500" />
            <span>Credits never expire</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className={`w-full ${
            plan.popular ? "bg-primary hover:bg-primary/90" : ""
          }`}
          // variant={plan.popular ? "default" : "outline"}
          // disabled={loading === plan.id}
        >
          {/* {loading === plan.id ? "Processing..." : `Buy Now`} */}
          <Link
            href={`/my-profile/manage-credits/buy-credit/${plan.productId}`}
            className="w-full h-full flex items-center justify-center"
          >
            {loading === plan.id ? "Processing..." : `Buy Now`}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

/**
 * FAQ item type definition
 */
interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Main Pricing component
 */
const Pricing: React.FC = () => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  // FAQ data
  const faqItems: FAQItem[] = [
    {
      question: "What can I do with credits?",
      answer:
        "Credits can be used to access premium features, generate content, or process data in our platform.",
    },
    {
      question: "Do credits expire?",
      answer:
        "No, your purchased credits never expire. Use them whenever you need them.",
    },
    {
      question: "Can I buy more credits later?",
      answer:
        "Yes, you can purchase additional credits at any time to top up your account.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Unused credits may be eligible for refunds within 30 days of purchase. Please contact support for details.",
    },
  ];

  /**
   * Handles the purchase of a pricing plan
   */
  const handlePurchase = (plan: PricingPlan): void => {
    setProcessingId(plan.id);

    // Simulate purchase processing
    // In a real implementation, you would integrate with your payment processor here
    setTimeout(() => {
      setProcessingId(null);
      // You could redirect to checkout or show a success message here
      alert(
        `Processing purchase for ${plan.packageName}: ${
          plan.credits
        } credits for ${formatCurrency(plan.price, plan.currency)}`
      );
    }, 1500);
  };

  return (
    <div className="py-12 px-4 md:px-6 lg:px-8 mx-auto max-w-7xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Purchase Credits
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Buy credits in a single payment. The more credits you purchase at
          once, the more you save.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onPurchase={handlePurchase}
            loading={processingId}
            selectedId={processingId}
          />
        ))}
      </div>

      <div className="mt-16 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index}>
                <h4 className="font-medium mb-2">{item.question}</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center p-6 bg-primary/5 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">
          Need a custom credit package?
        </h3>
        <p className="mb-4 text-gray-500 dark:text-gray-400">
          For larger credit purchases or special requirements, our team can
          create a custom package.
        </p>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </div>
  );
};

export default Pricing;
