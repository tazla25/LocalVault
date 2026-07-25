import { NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { priceId, email } = await req.json();

    const plan = Object.values(PLANS).find((p) => p.priceId === priceId);
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid price ID" },
        { status: 400 }
      );
    }

    const isLifetime = plan.billing === "lifetime";

    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? "payment" : "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      customer_email: email,
      metadata: {
        planId: plan.id,
        planName: plan.name,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
