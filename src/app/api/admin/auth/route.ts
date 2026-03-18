import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function signToken(password: string): string {
  const secret = password + (process.env.ADMIN_TOKEN_SALT ?? "longtress-salt");
  return crypto
    .createHmac("sha256", secret)
    .update("admin-session")
    .digest("hex");
}

export function verifyAdminToken(token: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password === "YOUR_ADMIN_PASSWORD") return false;

  const expected = signToken(password);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { password } = body;
  if (!password || typeof password !== "string") {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 400 },
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = signToken(password);
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_auth");
  return res;
}
