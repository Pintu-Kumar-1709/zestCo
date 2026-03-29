import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/mailer";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId } = await req.json();
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    order.deliveryOtp = otp;
    await order.save();

    await sendEmail(
      order.user.email,
      "Your Delivery OTP",
      `<p>Your OTP for order ${order._id} is: <strong>${otp}</strong></p>`,
    );
    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error sending OTP: ${error}` },
      { status: 500 },
    );
  }
}
