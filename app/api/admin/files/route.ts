import fs from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, formatFileSize, listEditableFiles, readEditableFile, verifySessionToken, writeEditableFile } from "@/lib/admin"

export const runtime = "nodejs"

function requireAuth(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  return Boolean(token && verifySessionToken(token))
}

export async function GET(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const files = listEditableFiles().map((filePath) => {
    const resolved = path.resolve(process.cwd(), filePath)
    const stats = fs.statSync(resolved)
    return {
      path: filePath,
      size: formatFileSize(stats.size),
      updatedAt: stats.mtime.toISOString(),
    }
  })

  return NextResponse.json({ files })
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const files = listEditableFiles().map((filePath) => ({
    path: filePath,
    content: readEditableFile(filePath),
  }))

  return NextResponse.json({ files })
}

export async function PUT(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = (await request.json()) as { path?: string; content?: string }
    const selectedPath = body.path ?? ""
    const content = body.content ?? ""
    const resolved = writeEditableFile(selectedPath, content)
    const stats = fs.statSync(resolved)

    return NextResponse.json({
      ok: true,
      path: path.relative(process.cwd(), resolved).replace(/\\/g, "/"),
      size: formatFileSize(stats.size),
      updatedAt: stats.mtime.toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to save file" },
      { status: 400 }
    )
  }
}
