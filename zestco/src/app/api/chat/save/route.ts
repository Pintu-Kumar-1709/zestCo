import connectDB from "@/lib/db";
import Message from "@/models/message.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { text, senderId, roomId, time} = await req.json();
    const room  = await Order.findById(roomId)
    if(!room){
      return NextResponse.json({message:"Room not found"}, {status:400})
    }

    const message = await Message.create({
      text,
      senderId,
      roomId,
      time
    })
    return NextResponse.json(message, {status:201})
  } catch (error) {
     return NextResponse.json({message:`save message error: ${error}`}, {status:500})
  }
}