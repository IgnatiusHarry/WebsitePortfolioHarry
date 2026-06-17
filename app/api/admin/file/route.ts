import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, normalizeRepoPath, readEditableFile, verifySessionToken, writeEditableFile } from "@/lib/admin"

export const runtime = "nodejs"

function requireAuth(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  return Boolean(token && verifySessionToken(token))
}

function maybeRunPostSaveHook() {
  const command = process.env.ADMIN_POST_SAVE_COMMAND?.trim()
  if (!command) return null

  const output = execSync(command, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: Number(process.env.ADMIN_POST_SAVE_TIMEOUT_MS ?? 600000),
    env: process.env,
  })

  return output
}

export async function GET(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const filePath = request.nextUrl.searchParams.get("path") ?? ""
  try {
    const content = readEditableFile(filePath)
    const resolved = normalizeRepoPath(filePath)
    const stats = fs.statSync(resolved)
    return NextResponse.json({
      path: filePath,
      content,
      size: stats.size,
      updatedAt: stats.mtime.toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read file" },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = (await request.json()) as { path?: string; content?: string }
    const filePath = body.path ?? ""
    const content = body.content ?? ""

    const resolved = writeEditableFile(filePath, content)
    const postSaveOutput = maybeRunPostSaveHook()

    return NextResponse.json({
      ok: true,
      path: path.relative(process.cwd(), resolved).replace(/\\/g, "/"),
      postSaveOutput: postSaveOutput ?? null,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to save file" },
      { status: 400 }
    )
  }
}
