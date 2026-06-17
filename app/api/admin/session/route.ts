import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  const authenticated = Boolean(token && verifySessionToken(token))
  return NextResponse.json({ authenticated })
}
