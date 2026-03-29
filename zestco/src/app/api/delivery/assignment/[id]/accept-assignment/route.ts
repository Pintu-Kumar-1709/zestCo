
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import emitHandler from "@/lib/emitHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET( req: NextRequest,context: { params: Promise<{ id: string; }> ; })
 {
  try {
    await connectDB();

    
    const { id } = await context.params; 
    

    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const assignment = await DeliveryAssignment.findById(id);

    if (!assignment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 400 }
      );
    }

    if (assignment.status !== "broadcasted") {
      return NextResponse.json(
        { message: "Assignment expired" },
        { status: 400 }
      );
    }

    
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["completed"] }, 
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "Already assigned to another order" },
        { status: 400 }
      );
    }

    
    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    
    const order = await Order.findById(assignment.order);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 400 }
      );
    }

    order.assignedDeliveryBoy = deliveryBoyId;
    order.status = "out of delivery";
    await order.save();

    await order.populate("assignedDeliveryBoy");

    await emitHandler("order-assigned", {
      orderId: order._id,
      assignedDeliveryBoy: order.assignedDeliveryBoy
    });

    
    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        broadcastedTo: deliveryBoyId,
        status: "broadcasted",
      },
      {
        $pull: { broadcastedTo: deliveryBoyId },
      }
    );

    return NextResponse.json(
      { message: "Order accepted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error details:", error); 
    return NextResponse.json(
      { message: `Accept assignment error: ${error}` },
      { status: 500 }
    );
  }
}