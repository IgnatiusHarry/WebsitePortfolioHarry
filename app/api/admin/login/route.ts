import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, createSessionToken, verifyAdminPassword } from "@/lib/admin"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: string }
    const password = body.password ?? ""

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ ok: false, error: "Password salah" }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: createSessionToken(),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Login gagal" },
      { status: 500 }
    )
  }
}
