"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

const OWNER = "IgnatiusHarry"
const REPO = "WebsitePortfolioHarry"
const DATA_PATH = "public/data/projects-overrides.json"

function toBase64Utf8(value: string) {
  return window.btoa(unescape(encodeURIComponent(value)))
}

export default function AdminPage() {
  const [token, setToken] = useState("")
  const [jsonText, setJsonText] = useState("{}")
  const [sha, setSha] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("Idle")
  const [isSaving, setIsSaving] = useState(false)

  const parsed = useMemo(() => {
    try {
      return { ok: true, value: JSON.parse(jsonText) as unknown }
    } catch (error) {
      return { ok: false, error: error as Error }
    }
  }, [jsonText])

  useEffect(() => {
    const cachedToken = window.sessionStorage.getItem("portfolio-admin-token")
    if (cachedToken) setToken(cachedToken)

    fetch("/data/projects-overrides.json", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load current data (${response.status})`)
        }
        const text = await response.text()
        setJsonText(text.trim() || "{}")
        setStatus("Loaded current overrides from the deployed site")
      })
      .catch((error) => {
        setStatus(`Using local draft: ${error instanceof Error ? error.message : String(error)}`)
      })
  }, [])

  useEffect(() => {
    window.sessionStorage.setItem("portfolio-admin-token", token)
  }, [token])

  const reloadCurrent = async () => {
    setStatus("Reloading current overrides...")
    try {
      const response = await fetch("/data/projects-overrides.json", { cache: "no-store" })
      if (!response.ok) throw new Error(`Load failed (${response.status})`)
      const text = await response.text()
      setJsonText(text.trim() || "{}")
      setStatus("Current overrides loaded")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error))
    }
  }

  const saveToGitHub = async () => {
    if (!parsed.ok) {
      setStatus(`JSON invalid: ${parsed.error.message}`)
      return
    }
    if (!token.trim()) {
      setStatus("GitHub token is required")
      return
    }

    setIsSaving(true)
    setStatus("Preparing save...")

    try {
      const repoApi = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DATA_PATH}`
      const headers = {
        Authorization: `Bearer ${token.trim()}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "Hermes-Portfolio-Admin",
      }

      // Fetch latest sha if the file already exists
      let currentSha: string | undefined = sha ?? undefined
      if (!currentSha) {
        const metaResponse = await fetch(repoApi, { headers })
        if (metaResponse.ok) {
          const meta = (await metaResponse.json()) as { sha?: string }
          currentSha = meta.sha
          setSha(currentSha ?? null)
        }
      }

      const body: Record<string, unknown> = {
        message: "Update portfolio overrides via admin panel",
        content: toBase64Utf8(jsonText),
        branch: "main",
      }
      if (currentSha) body.sha = currentSha

      const response = await fetch(repoApi, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload?.message || `Save failed (${response.status})`)
      }

      setSha((payload as { content?: { sha?: string } }).content?.sha ?? currentSha ?? null)
      setStatus("Saved to GitHub. GitHub Pages should refresh shortly.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-400">Portfolio Admin</p>
            <h1 className="text-3xl font-bold mt-2">Edit project overrides</h1>
            <p className="text-slate-400 mt-2 max-w-3xl">
              Update the project section without touching the main page source. The public site reads
              <code className="mx-1 rounded bg-slate-800 px-1.5 py-0.5">/data/projects-overrides.json</code>
              and the project cards auto-detect GitHub repo links for live metadata.
            </p>
          </div>
          <Link href="/" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-sky-500 hover:text-white transition-colors">
            Back home
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300">GitHub PAT</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_..."
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-2 text-sm text-slate-400">
              <p><span className="text-slate-200">Repo:</span> {OWNER}/{REPO}</p>
              <p><span className="text-slate-200">Path:</span> {DATA_PATH}</p>
              <p><span className="text-slate-200">Current sha:</span> {sha ?? "(not loaded yet)"}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={reloadCurrent}
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 hover:border-sky-500 hover:text-white transition-colors"
              >
                Reload current JSON
              </button>
              <button
                type="button"
                onClick={saveToGitHub}
                disabled={isSaving}
                className="rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
              >
                {isSaving ? "Saving..." : "Save to GitHub"}
              </button>
            </div>

            <div className="rounded-xl bg-slate-950/80 p-4 text-sm leading-relaxed text-slate-300 space-y-2">
              <p className="font-semibold text-white">Schema hint</p>
              <pre className="overflow-auto text-xs text-slate-400">{`{
  "en": [
    {
      "title": "Project name",
      "description": "...",
      "icon": "💼",
      "gradient": "from-sky-500/20 to-violet-500/20",
      "links": [{ "text": "View Github", "url": "https://github.com/..." }]
    }
  ],
  "zh": [ ... ]
}`}</pre>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-semibold">Raw JSON editor</h2>
                <p className="text-sm text-slate-400">You can paste the full override JSON here. Valid JSON is required.</p>
              </div>
              <div className={`text-sm ${parsed.ok ? "text-emerald-400" : "text-rose-400"}`}>
                {parsed.ok ? "JSON looks valid" : `Invalid JSON: ${parsed.error.message}`}
              </div>
            </div>

            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
              className="min-h-[560px] w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-sky-500"
            />
          </section>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
          <p className="font-semibold text-white">Status</p>
          <p className="mt-1">{status}</p>
        </div>
      </div>
    </main>
  )
}
