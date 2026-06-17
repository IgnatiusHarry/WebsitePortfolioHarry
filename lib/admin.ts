import crypto from "crypto"
import fs from "fs"
import path from "path"

export const ADMIN_COOKIE_NAME = "portfolio-admin-session"
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7
export const ROOT_DIR = process.cwd()

// Restrict the admin editor to public website content only.
// Source code stays in Git/VPS; the admin panel can only edit public assets/data.
const EDITABLE_PREFIXES = ["public/data/", "public/"]
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
])

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

export function getPasswordHash() {
  return requireEnv("ADMIN_PASSWORD_HASH").trim().toLowerCase()
}

export function getSessionSecret() {
  return requireEnv("ADMIN_SESSION_SECRET")
}

export function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex")
}

function hmacHex(secret: string, payload: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex")
}

function base64UrlEncode(input: string) {
  return Buffer.from(input, "utf8").toString("base64url")
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8")
}

export function timingSafeEqualHex(a: string, b: string) {
  const left = Buffer.from(a, "hex")
  const right = Buffer.from(b, "hex")
  return left.length === right.length && crypto.timingSafeEqual(left, right)
}

export function verifyAdminPassword(password: string) {
  const expected = getPasswordHash()
  const actual = sha256Hex(password.trim())
  return timingSafeEqualHex(actual, expected)
}

export type AdminSessionPayload = {
  exp: number
  issuedAt: number
}

export function createSessionToken() {
  const payload: AdminSessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    issuedAt: Math.floor(Date.now() / 1000),
  }
  const encoded = base64UrlEncode(JSON.stringify(payload))
  const sig = hmacHex(getSessionSecret(), encoded)
  return `${encoded}.${sig}`
}

export function verifySessionToken(token: string) {
  const [encoded, sig] = token.split(".")
  if (!encoded || !sig) return false

  const expectedSig = hmacHex(getSessionSecret(), encoded)
  if (!timingSafeEqualHex(sig, expectedSig)) return false

  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as AdminSessionPayload
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function normalizeRepoPath(input: string) {
  const normalized = input.replace(/\\/g, "/").replace(/^\/+/, "")
  if (!normalized) throw new Error("Empty file path")

  if (!EDITABLE_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    throw new Error("File path is not editable")
  }

  const resolved = path.resolve(ROOT_DIR, normalized)
  const rootWithSep = `${ROOT_DIR}${path.sep}`
  if (resolved !== ROOT_DIR && !resolved.startsWith(rootWithSep)) {
    throw new Error("Invalid file path")
  }

  const ext = path.extname(resolved).toLowerCase()
  if (!TEXT_EXTENSIONS.has(ext)) {
    throw new Error(`Unsupported file type: ${ext || "(none)"}`)
  }

  return resolved
}

export function readEditableFile(input: string) {
  const resolved = normalizeRepoPath(input)
  return fs.readFileSync(resolved, "utf8")
}

export function writeEditableFile(input: string, content: string) {
  const resolved = normalizeRepoPath(input)
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, content, "utf8")
  return resolved
}

export function listEditableFiles() {
  const candidates = new Set<string>()

  const scan = (dir: string) => {
    const resolved = path.resolve(ROOT_DIR, dir)
    if (!fs.existsSync(resolved)) return

    const stack = [resolved]
    while (stack.length > 0) {
      const current = stack.pop()!
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        if (entry.name.startsWith(".")) continue
        if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "out") continue
        const full = path.join(current, entry.name)
        if (entry.isDirectory()) {
          stack.push(full)
          continue
        }
        const rel = path.relative(ROOT_DIR, full).replace(/\\/g, "/")
        try {
          normalizeRepoPath(rel)
          candidates.add(rel)
        } catch {
          // Ignore non-editable files
        }
      }
    }
  }

  for (const dir of EDITABLE_PREFIXES) {
    scan(dir)
  }

  return Array.from(candidates).sort((a, b) => a.localeCompare(b))
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
