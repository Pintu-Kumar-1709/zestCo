

import connectDB from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { message, role } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const prompt = `You are a grocery delivery assistant. Role: ${role}. Last message: ${message}. Generate 3 short Hinglish WhatsApp style reply suggestions (max 8 words each). Return only comma-separated suggestions.`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    const aiText = response.data.candidates[0].content.parts[0].text;
    const suggestionsArray = aiText.split(",").map((s: string) => s.trim());

    return NextResponse.json(suggestionsArray, { status: 200 });

  } catch (error: any) {
    console.error("Gemini Error Details:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}