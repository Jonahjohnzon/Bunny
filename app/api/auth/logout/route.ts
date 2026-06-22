// app/api/auth/logout/route.ts
"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  return NextResponse.json({ success: true, message: "Logged out." });
}