import connectDB from "@/lib/db";
import Message from "@/models/message.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {roomId} = await req.json();
    const room = await Order.findById(roomId)
    if(!room){
      return NextResponse.json({message:"Room not found"}, {status:400})
    }
    const messages = await Message.find({ roomId}).sort({createdAt:1})
    return NextResponse.json(messages, {status:200})
  } catch (error) {
    return NextResponse.json({message:`get messages error: ${error}`}, {status:500})
  }
}