import { auth } from "@/auth";
import uploadCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are not an Admin" },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const groceryId = formData.get("groceryId") as string;
    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string;
    const price = formData.get("price") as string;
    const file = formData.get("image") as Blob | null;

    let imageUrl;
    if (file) {
      imageUrl = await uploadCloudinary(file);
    }

    const grocery = await Grocery.findByIdAndUpdate(groceryId,{
      name,
      category,
      unit,
      price,
      image: imageUrl,
    });
    return NextResponse.json(grocery, { status: 200 });
  } catch (error) {
    NextResponse.json(
      { message: `edit grocery error ${error}` },
      { status: 500 },
    );
  }
}
