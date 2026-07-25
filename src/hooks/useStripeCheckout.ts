"use client";

import { useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "pk_test_mock");

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToCheckout = useCallback(
    async (priceId: string, email?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, email }),
        });

        if (!response.ok) {
          throw new Error("Failed to create checkout session");
        }

        const { sessionId } = await response.json();
        const stripe = await stripePromise;

        if (!stripe) {
          throw new Error("Stripe failed to load");
        }

        const { error: stripeError } = await (stripe as any).redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Checkout failed";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { redirectToCheckout, isLoading, error };
}
