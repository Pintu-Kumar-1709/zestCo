import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET( req: NextRequest,context: { params: Promise<{ orderId: string; }> ; }) {
  try {
    await connectDB();

    const { orderId } = await context.params;

    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: "Invalid Order ID" },
        { status: 400 }
      );
    }

    const order = await Order.findById(
      new mongoose.Types.ObjectId(orderId)
    )
      .populate("assignedDeliveryBoy")
      .populate("user");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found in DB" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.log("Get order error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}