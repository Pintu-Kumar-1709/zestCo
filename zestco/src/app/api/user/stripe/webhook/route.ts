import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  let event;

  try {
   
    event = stripe.webhooks.constructEvent(
      rawBody, 
      sig!, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.log(`❌ Signature verification error: ${error}`);
    return NextResponse.json({ error: error }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    await connectDB();
    
    if (session?.metadata?.orderId) {
      await Order.findByIdAndUpdate(session.metadata.orderId, {
        isPaid: true
      });
      console.log(`✅ Order ${session.metadata.orderId} marked as PAID`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}