import connectDB from "@/lib/db";
import emitHandler from "@/lib/emitHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { otp, orderId } = await req.json();
    if (!otp || !orderId) {
      return NextResponse.json(
        { message: "orderId or otp not found" },
        { status: 400 },
      );
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }

    if (order.deliveryOtp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }
    order.status = "delivered";
    order.deliveryOtpVerification = true;
    order.deliveredAt = new Date();
    await order.save();

    await emitHandler("order-status-update", {
      orderId: order._id,
      status: order.status,
    });

    await DeliveryAssignment.updateOne(
      { order: orderId },
      { $set: { assignedTo: null, status: "completed" } },
    );

    return NextResponse.json(
      { message: "Delivery successfully completed" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error verifying OTP: ${error}` },
      { status: 500 },
    );
  }
}
