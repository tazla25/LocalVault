import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock"
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Payment successful for session:", session.id);
  }

  return NextResponse.json({ received: true });
}
