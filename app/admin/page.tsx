"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CheckCircle2, FolderPen, Languages, LogOut, Plus, RefreshCcw, Save, Trash2 } from "lucide-react"

type Lang = "en" | "zh"
type EditorTab = "content" | "projects"

type TextList = string[]

type HeroDraft = {
  greeting: string
  nameFirst: string
  nameLast: string
  description: string
  ctaTalk: string
  ctaDownload: string
  typingPhrases: TextList
}

type AboutDraft = {
  summary: string
  paragraphs: TextList
}

type TabsDraft = {
  skills: string
  experience: string
  education: string
  certifications: string
  language: string
}

type SkillsCategoryDraft = {
  title: string
  items: TextList
}

type SkillsDraft = {
  icons: TextList
  categories: SkillsCategoryDraft[]
}

type ExperienceDraft = {
  title: string
  company: string
  period: string
  location: string
  type: string
  description: TextList
  tags: TextList
}

type EducationDraft = {
  title: string
  institution: string
  period: string
  location: string
  type: string
  description: TextList
  tags: TextList
}

type CertificationDraft = {
  title: string
  provider: string
  date: string
  link: string
}

type ContactDraft = {
  email: string
  emailHref: string
  linkedin: string
  github: string
  instagram: string
  formAction: string
}

type FooterDraft = {
  quote: string
  caption: string
}

type SiteLanguageDraft = {
  hero: HeroDraft
  about: AboutDraft
  tabs: TabsDraft
  skills: SkillsDraft
  experience: ExperienceDraft[]
  education: EducationDraft[]
  certifications: CertificationDraft[]
  languages: TextList
  contact: ContactDraft
  footer: FooterDraft
}

type LinkDraft = {
  text: string
  url: string
}

type ProjectDraft = {
  title: string
  description: string
  icon: string
  gradient: string
  image: string
  highlights: TextList
  methods: TextList
  tools: TextList
  data: TextList
  links: LinkDraft[]
}

type SiteOverridesDraft = Record<Lang, SiteLanguageDraft>
type ProjectsOverridesDraft = Record<Lang, ProjectDraft[]>

type FileResponse = {
  error?: string
  ok?: boolean
  content?: string
}

type SessionResponse = {
  authenticated?: boolean
}

const LOGIN_KEY = "portfolio-admin-unlocked"
const SITE_CONTENT_PATH = "public/data/site-content-overrides.json"
const PROJECTS_PATH = "public/data/projects-overrides.json"

const blankHero = (): HeroDraft => ({
  greeting: "",
  nameFirst: "",
  nameLast: "",
  description: "",
  ctaTalk: "",
  ctaDownload: "",
  typingPhrases: [""],
})

const blankAbout = (): AboutDraft => ({
  summary: "",
  paragraphs: [""],
})

const blankTabs = (): TabsDraft => ({
  skills: "",
  experience: "",
  education: "",
  certifications: "",
  language: "",
})

const blankSkillsCategory = (): SkillsCategoryDraft => ({
  title: "",
  items: [""],
})

const blankSkills = (): SkillsDraft => ({
  icons: [""],
  categories: [blankSkillsCategory()],
})

const blankExperience = (): ExperienceDraft => ({
  title: "",
  company: "",
  period: "",
  location: "",
  type: "",
  description: [""],
  tags: [""],
})

const blankEducation = (): EducationDraft => ({
  title: "",
  institution: "",
  period: "",
  location: "",
  type: "",
  description: [""],
  tags: [""],
})

const blankCertification = (): CertificationDraft => ({
  title: "",
  provider: "",
  date: "",
  link: "",
})

const blankContact = (): ContactDraft => ({
  email: "",
  emailHref: "",
  linkedin: "",
  github: "",
  instagram: "",
  formAction: "",
})

const blankFooter = (): FooterDraft => ({
  quote: "",
  caption: "",
})

const blankSiteLanguage = (): SiteLanguageDraft => ({
  hero: blankHero(),
  about: blankAbout(),
  tabs: blankTabs(),
  skills: blankSkills(),
  experience: [blankExperience()],
  education: [blankEducation()],
  certifications: [blankCertification()],
  languages: [""],
  contact: blankContact(),
  footer: blankFooter(),
})

const blankProject = (): ProjectDraft => ({
  title: "",
  description: "",
  icon: "",
  gradient: "",
  image: "",
  highlights: [""],
  methods: [""],
  tools: [""],
  data: [""],
  links: [{ text: "", url: "" }],
})

const blankSiteDraft = (): SiteOverridesDraft => ({
  en: blankSiteLanguage(),
  zh: blankSiteLanguage(),
})

const blankProjectsDraft = (): ProjectsOverridesDraft => ({
  en: [blankProject()],
  zh: [blankProject()],
})

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function textListFrom(value: unknown): TextList {
  if (!Array.isArray(value)) return [""]
  const next = value.map((item) => String(item ?? ""))
  return next.length > 0 ? next : [""]
}

function trimText(value: unknown) {
  return String(value ?? "").trim()
}

function normalizeHero(raw: unknown): HeroDraft {
  if (!isObject(raw)) return blankHero()
  return {
    greeting: trimText(raw.greeting),
    nameFirst: trimText(raw.nameFirst),
    nameLast: trimText(raw.nameLast),
    description: trimText(raw.description),
    ctaTalk: trimText(raw.ctaTalk),
    ctaDownload: trimText(raw.ctaDownload),
    typingPhrases: textListFrom(raw.typingPhrases),
  }
}

function normalizeAbout(raw: unknown): AboutDraft {
  if (!isObject(raw)) return blankAbout()
  return {
    summary: trimText(raw.summary),
    paragraphs: textListFrom(raw.paragraphs),
  }
}

function normalizeTabs(raw: unknown): TabsDraft {
  if (!isObject(raw)) return blankTabs()
  return {
    skills: trimText(raw.skills),
    experience: trimText(raw.experience),
    education: trimText(raw.education),
    certifications: trimText(raw.certifications),
    language: trimText(raw.language),
  }
}

function normalizeSkills(raw: unknown): SkillsDraft {
  if (!isObject(raw)) return blankSkills()
  const categoriesRaw = Array.isArray((raw as Record<string, unknown>).categories)
    ? ((raw as Record<string, unknown>).categories as unknown[])
    : []
  const categories = categoriesRaw.length > 0
    ? categoriesRaw.map((category: unknown) => {
        if (!isObject(category)) return blankSkillsCategory()
        return {
          title: trimText(category.title),
          items: textListFrom(category.items),
        }
      })
    : [blankSkillsCategory()]
  return {
    icons: textListFrom(raw.icons),
    categories: categories.length > 0 ? categories : [blankSkillsCategory()],
  }
}

function normalizeExperience(raw: unknown): ExperienceDraft[] {
  if (!Array.isArray(raw) || raw.length === 0) return [blankExperience()]
  return raw.map((item) => {
    if (!isObject(item)) return blankExperience()
    return {
      title: trimText(item.title),
      company: trimText(item.company),
      period: trimText(item.period),
      location: trimText(item.location),
      type: trimText(item.type),
      description: textListFrom(item.description),
      tags: textListFrom(item.tags),
    }
  })
}

function normalizeEducation(raw: unknown): EducationDraft[] {
  if (!Array.isArray(raw) || raw.length === 0) return [blankEducation()]
  return raw.map((item) => {
    if (!isObject(item)) return blankEducation()
    return {
      title: trimText(item.title),
      institution: trimText(item.institution),
      period: trimText(item.period),
      location: trimText(item.location),
      type: trimText(item.type),
      description: textListFrom(item.description),
      tags: textListFrom(item.tags),
    }
  })
}

function normalizeCertifications(raw: unknown): CertificationDraft[] {
  if (!Array.isArray(raw) || raw.length === 0) return [blankCertification()]
  return raw.map((item) => {
    if (!isObject(item)) return blankCertification()
    return {
      title: trimText(item.title),
      provider: trimText(item.provider),
      date: trimText(item.date),
      link: trimText(item.link),
    }
  })
}

function normalizeContact(raw: unknown): ContactDraft {
  if (!isObject(raw)) return blankContact()
  return {
    email: trimText(raw.email),
    emailHref: trimText(raw.emailHref),
    linkedin: trimText(raw.linkedin),
    github: trimText(raw.github),
    instagram: trimText(raw.instagram),
    formAction: trimText(raw.formAction),
  }
}

function normalizeFooter(raw: unknown): FooterDraft {
  if (!isObject(raw)) return blankFooter()
  return {
    quote: trimText(raw.quote),
    caption: trimText(raw.caption),
  }
}

function normalizeProject(raw: unknown): ProjectDraft {
  if (!isObject(raw)) return blankProject()
  const links = Array.isArray(raw.links)
    ? raw.links.map((link) => ({
        text: isObject(link) ? trimText(link.text) : "",
        url: isObject(link) ? trimText(link.url) : "",
      }))
    : [{ text: "", url: "" }]
  return {
    title: trimText(raw.title),
    description: trimText(raw.description),
    icon: trimText(raw.icon),
    gradient: trimText(raw.gradient),
    image: trimText(raw.image),
    highlights: textListFrom(raw.highlights),
    methods: textListFrom(raw.methods),
    tools: textListFrom(raw.tools),
    data: textListFrom(raw.data),
    links: links.length > 0 ? links : [{ text: "", url: "" }],
  }
}

function normalizeSiteDraft(raw: unknown): SiteOverridesDraft {
  return {
    en: normalizeSiteLanguage(isObject(raw) ? raw.en : undefined),
    zh: normalizeSiteLanguage(isObject(raw) ? raw.zh : undefined),
  }
}

function normalizeSiteLanguage(raw: unknown): SiteLanguageDraft {
  if (!isObject(raw)) return blankSiteLanguage()
  return {
    hero: normalizeHero(raw.hero),
    about: normalizeAbout(raw.about),
    tabs: normalizeTabs(raw.tabs),
    skills: normalizeSkills(raw.skills),
    experience: normalizeExperience(raw.experience),
    education: normalizeEducation(raw.education),
    certifications: normalizeCertifications(raw.certifications),
    languages: textListFrom(raw.languages),
    contact: normalizeContact(raw.contact),
    footer: normalizeFooter(raw.footer),
  }
}

function normalizeProjectsDraft(raw: unknown): ProjectsOverridesDraft {
  const en = isObject(raw) && Array.isArray(raw.en) ? raw.en.map(normalizeProject) : [blankProject()]
  const zh = isObject(raw) && Array.isArray(raw.zh) ? raw.zh.map(normalizeProject) : [blankProject()]
  return {
    en: en.length > 0 ? en : [blankProject()],
    zh: zh.length > 0 ? zh : [blankProject()],
  }
}

function cleanList(list: TextList) {
  return list.map((item) => item.trim()).filter(Boolean)
}

function compactObject<T extends Record<string, unknown>>(value: T) {
  const next: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(value)) {
    if (Array.isArray(item)) {
      if (item.length > 0) next[key] = item
      continue
    }
    if (typeof item === "string") {
      if (item.trim()) next[key] = item.trim()
      continue
    }
    if (item && typeof item === "object") {
      next[key] = item
    }
  }
  return Object.keys(next).length > 0 ? next : null
}

function serializeHero(value: HeroDraft) {
  return compactObject({
    greeting: value.greeting,
    nameFirst: value.nameFirst,
    nameLast: value.nameLast,
    description: value.description,
    ctaTalk: value.ctaTalk,
    ctaDownload: value.ctaDownload,
    typingPhrases: cleanList(value.typingPhrases),
  })
}

function serializeAbout(value: AboutDraft) {
  return compactObject({
    summary: value.summary,
    paragraphs: cleanList(value.paragraphs),
  })
}

function serializeTabs(value: TabsDraft) {
  return compactObject({
    skills: value.skills,
    experience: value.experience,
    education: value.education,
    certifications: value.certifications,
    language: value.language,
  })
}

function serializeSkills(value: SkillsDraft) {
  const categories = value.categories
    .map((category) => {
      const next = compactObject({
        title: category.title,
        items: cleanList(category.items),
      })
      return next as Record<string, unknown> | null
    })
    .filter(Boolean)
  return compactObject({
    icons: cleanList(value.icons),
    categories,
  })
}

function serializeExperience(items: ExperienceDraft[]) {
  const next = items
    .map((item) => {
      const value = compactObject({
        title: item.title,
        company: item.company,
        period: item.period,
        location: item.location,
        type: item.type,
        description: cleanList(item.description),
        tags: cleanList(item.tags),
      })
      return value
    })
    .filter(Boolean)
  return next.length > 0 ? next : null
}

function serializeEducation(items: EducationDraft[]) {
  const next = items
    .map((item) => {
      const value = compactObject({
        title: item.title,
        institution: item.institution,
        period: item.period,
        location: item.location,
        type: item.type,
        description: cleanList(item.description),
        tags: cleanList(item.tags),
      })
      return value
    })
    .filter(Boolean)
  return next.length > 0 ? next : null
}

function serializeCertifications(items: CertificationDraft[]) {
  const next = items
    .map((item) => {
      const value = compactObject({
        title: item.title,
        provider: item.provider,
        date: item.date,
        link: item.link,
      })
      return value
    })
    .filter(Boolean)
  return next.length > 0 ? next : null
}

function serializeContact(value: ContactDraft) {
  return compactObject({
    email: value.email,
    emailHref: value.emailHref,
    linkedin: value.linkedin,
    github: value.github,
    instagram: value.instagram,
    formAction: value.formAction,
  })
}

function serializeFooter(value: FooterDraft) {
  return compactObject({
    quote: value.quote,
    caption: value.caption,
  })
}

function serializeProject(project: ProjectDraft) {
  const links = project.links
    .map((link) => compactObject({ text: link.text, url: link.url }))
    .filter(Boolean)
  return compactObject({
    title: project.title,
    description: project.description,
    icon: project.icon,
    gradient: project.gradient,
    image: project.image,
    highlights: cleanList(project.highlights),
    methods: cleanList(project.methods),
    tools: cleanList(project.tools),
    data: cleanList(project.data),
    links,
  })
}

function serializeSiteDraft(draft: SiteOverridesDraft) {
  return {
    en: {
      hero: serializeHero(draft.en.hero),
      about: serializeAbout(draft.en.about),
      tabs: serializeTabs(draft.en.tabs),
      skills: serializeSkills(draft.en.skills),
      experience: serializeExperience(draft.en.experience),
      education: serializeEducation(draft.en.education),
      certifications: serializeCertifications(draft.en.certifications),
      languages: cleanList(draft.en.languages),
      contact: serializeContact(draft.en.contact),
      footer: serializeFooter(draft.en.footer),
    },
    zh: {
      hero: serializeHero(draft.zh.hero),
      about: serializeAbout(draft.zh.about),
      tabs: serializeTabs(draft.zh.tabs),
      skills: serializeSkills(draft.zh.skills),
      experience: serializeExperience(draft.zh.experience),
      education: serializeEducation(draft.zh.education),
      certifications: serializeCertifications(draft.zh.certifications),
      languages: cleanList(draft.zh.languages),
      contact: serializeContact(draft.zh.contact),
      footer: serializeFooter(draft.zh.footer),
    },
  }
}

function serializeProjectsDraft(draft: ProjectsOverridesDraft) {
  const en = draft.en.map(serializeProject).filter(Boolean)
  const zh = draft.zh.map(serializeProject).filter(Boolean)
  const next: Record<string, unknown> = {}
  if (en.length > 0) next.en = en
  if (zh.length > 0) next.zh = zh
  return next
}

async function fetchJson(path: string) {
  const response = await fetch(`/api/admin/file?path=${encodeURIComponent(path)}`, { cache: "no-store" })
  if (!response.ok) {
    throw new Error(`Gagal memuat ${path}`)
  }
  return (await response.json()) as FileResponse & Record<string, unknown>
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  rows = 1,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <label className="space-y-2 block">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      {rows > 1 ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
        />
      )}
    </label>
  )
}

function ListField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <label className="space-y-2 block">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <textarea
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
      />
      <p className="text-xs text-slate-500">Satu item per baris. Baris kosong akan diabaikan saat save.</p>
    </label>
  )
}

function CardShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle ? <p className="text-sm text-slate-400 mt-1">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2 flex-wrap">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}

function ArrayEditor<T>({
  items,
  onChange,
  createItem,
  renderItem,
  addLabel,
}: {
  items: T[]
  onChange: (items: T[]) => void
  createItem: () => T
  renderItem: (item: T, index: number, update: (next: T) => void, remove: () => void) => React.ReactNode
  addLabel: string
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item, index) => {
          const update = (next: T) => onChange(items.map((current, currentIndex) => (currentIndex === index ? next : current)))
          const remove = () => onChange(items.filter((_, currentIndex) => currentIndex !== index))
          return (
            <div key={index} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-300">Item #{index + 1}</p>
                <button
                  type="button"
                  onClick={remove}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs text-rose-300 hover:border-rose-400 hover:text-rose-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
              {renderItem(item, index, update, remove)}
            </div>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, createItem()])}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-sky-500 hover:text-white"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  )
}

function SectionTabs({
  value,
  onChange,
}: {
  value: EditorTab
  onChange: (value: EditorTab) => void
}) {
  const tabs: { id: EditorTab; label: string }[] = [
    { id: "content", label: "Site content" },
    { id: "projects", label: "Projects" },
  ]

  return (
    <div className="inline-flex rounded-full border border-slate-700 bg-slate-900 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            value === tab.id ? "bg-sky-500 text-white" : "text-slate-300 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("Locked")
  const [savingContent, setSavingContent] = useState(false)
  const [savingProjects, setSavingProjects] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<EditorTab>("content")
  const [language, setLanguage] = useState<Lang>("en")
  const [siteDraft, setSiteDraft] = useState<SiteOverridesDraft>(blankSiteDraft)
  const [projectsDraft, setProjectsDraft] = useState<ProjectsOverridesDraft>(blankProjectsDraft)

  const currentSite = siteDraft[language]
  const currentProjects = projectsDraft[language]

  const siteSummary = useMemo(() => {
    const count = [currentSite.experience.length, currentSite.education.length, currentSite.certifications.length].reduce(
      (acc, item) => acc + item,
      0,
    )
    return `${count} collection items loaded`
  }, [currentSite])

  const loadData = async () => {
    setLoading(true)
    setStatus("Loading editor data...")
    try {
      const [siteResponse, projectsResponse] = await Promise.all([
        fetchJson(SITE_CONTENT_PATH).catch(() => ({ })),
        fetchJson(PROJECTS_PATH).catch(() => ({ })),
      ])
      setSiteDraft(normalizeSiteDraft(siteResponse))
      setProjectsDraft(normalizeProjectsDraft(projectsResponse))
      setStatus("Loaded editor data")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" })
        const data = (await response.json()) as SessionResponse
        const unlocked = Boolean(data.authenticated || window.sessionStorage.getItem(LOGIN_KEY) === "1")
        setIsAuthed(unlocked)
        setStatus(unlocked ? "Unlocked" : "Locked")
        if (unlocked) {
          await loadData()
        }
      } catch {
        setStatus("Locked")
      } finally {
        setChecking(false)
      }
    }

    void run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async () => {
    setStatus("Checking password...")
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = (await response.json()) as FileResponse
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Password salah")
      }
      window.sessionStorage.setItem(LOGIN_KEY, "1")
      setIsAuthed(true)
      setStatus("Unlocked")
      await loadData()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error))
    }
  }

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    window.sessionStorage.removeItem(LOGIN_KEY)
    setIsAuthed(false)
    setStatus("Locked")
    setSiteDraft(blankSiteDraft())
    setProjectsDraft(blankProjectsDraft())
  }

  const saveContent = async () => {
    setSavingContent(true)
    setStatus(`Saving ${SITE_CONTENT_PATH}...`)
    try {
      const response = await fetch("/api/admin/file", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: SITE_CONTENT_PATH, content: JSON.stringify(serializeSiteDraft(siteDraft), null, 2) + "\n" }),
      })
      const data = (await response.json()) as FileResponse
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Gagal menyimpan site content")
      }
      setStatus(`Saved ${SITE_CONTENT_PATH}`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error))
    } finally {
      setSavingContent(false)
    }
  }

  const saveProjects = async () => {
    setSavingProjects(true)
    setStatus(`Saving ${PROJECTS_PATH}...`)
    try {
      const response = await fetch("/api/admin/file", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: PROJECTS_PATH, content: JSON.stringify(serializeProjectsDraft(projectsDraft), null, 2) + "\n" }),
      })
      const data = (await response.json()) as FileResponse
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Gagal menyimpan projects")
      }
      setStatus(`Saved ${PROJECTS_PATH}`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error))
    } finally {
      setSavingProjects(false)
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6">Checking access...</div>
      </main>
    )
  }

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
        <div className="mx-auto max-w-xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-sky-400">Portfolio Admin</p>
              <h1 className="text-3xl font-bold mt-2">Protected editor</h1>
            </div>
            <Link href="/" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-sky-500 hover:text-white">
              Back home
            </Link>
          </div>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <p className="text-sm text-slate-400">
              Login memakai password server-side. Setelah masuk, kamu bisa edit konten website lewat form, tanpa buka JSON mentah.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
            <button
              type="button"
              onClick={login}
              className="rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
            >
              Unlock
            </button>
          </section>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">Status</p>
            <p className="mt-1">{status}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-400">Portfolio Admin</p>
            <h1 className="text-3xl font-bold mt-2">Form-based website editor</h1>
            <p className="text-slate-400 mt-2 max-w-4xl">
              Edit homepage sections dari VPS, tanpa raw JSON. Save akan menulis ke {SITE_CONTENT_PATH} dan {PROJECTS_PATH}.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => void loadData()}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-sky-500 hover:text-white inline-flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-rose-500/40 px-4 py-2 text-sm text-rose-300 hover:border-rose-400 hover:text-rose-200 inline-flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <Link href="/" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-sky-500 hover:text-white">
              Back home
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <SectionTabs value={activeTab} onChange={setActiveTab} />
            <div className="inline-flex rounded-full border border-slate-700 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${language === "en" ? "bg-sky-500 text-white" : "text-slate-300 hover:text-white"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("zh")}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${language === "zh" ? "bg-sky-500 text-white" : "text-slate-300 hover:text-white"}`}
              >
                ZH
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              {status}
            </span>
            {loading ? (
              <span className="text-sm text-slate-400">Loading...</span>
            ) : (
              <span className="text-sm text-slate-400">{siteSummary}</span>
            )}
          </div>
        </div>

        {activeTab === "content" ? (
          <div className="grid gap-6 xl:grid-cols-2">
            <CardShell
              title={`Hero · ${language.toUpperCase()}`}
              subtitle="Headline, intro, CTA dan typing phrases"
              actions={
                <button type="button" onClick={saveContent} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400">
                  <Save className="h-4 w-4" />
                  {savingContent ? "Saving..." : "Save content"}
                </button>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Greeting" value={currentSite.hero.greeting} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], hero: { ...current[language].hero, greeting: value } } }))} />
                <Field label="First name" value={currentSite.hero.nameFirst} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], hero: { ...current[language].hero, nameFirst: value } } }))} />
                <Field label="Last name" value={currentSite.hero.nameLast} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], hero: { ...current[language].hero, nameLast: value } } }))} />
                <Field label="CTA talk" value={currentSite.hero.ctaTalk} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], hero: { ...current[language].hero, ctaTalk: value } } }))} />
                <Field label="CTA download" value={currentSite.hero.ctaDownload} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], hero: { ...current[language].hero, ctaDownload: value } } }))} />
              </div>
              <Field
                label="Description"
                value={currentSite.hero.description}
                onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], hero: { ...current[language].hero, description: value } } }))}
                rows={4}
              />
              <ListField
                label="Typing phrases"
                value={currentSite.hero.typingPhrases}
                onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], hero: { ...current[language].hero, typingPhrases: value } } }))}
                rows={5}
              />
            </CardShell>

            <CardShell title={`About · ${language.toUpperCase()}`} subtitle="Summary dan paragraph about" actions={null}>
              <Field
                label="Summary"
                value={currentSite.about.summary}
                onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], about: { ...current[language].about, summary: value } } }))}
                rows={4}
              />
              <ListField
                label="Paragraphs"
                value={currentSite.about.paragraphs}
                onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], about: { ...current[language].about, paragraphs: value } } }))}
                rows={6}
              />
            </CardShell>

            <CardShell title={`Tabs labels · ${language.toUpperCase()}`} subtitle="Label tab section di navbar dan kartu tabs" actions={null}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Skills label" value={currentSite.tabs.skills} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], tabs: { ...current[language].tabs, skills: value } } }))} />
                <Field label="Experience label" value={currentSite.tabs.experience} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], tabs: { ...current[language].tabs, experience: value } } }))} />
                <Field label="Education label" value={currentSite.tabs.education} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], tabs: { ...current[language].tabs, education: value } } }))} />
                <Field label="Certifications label" value={currentSite.tabs.certifications} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], tabs: { ...current[language].tabs, certifications: value } } }))} />
                <Field label="Language label" value={currentSite.tabs.language} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], tabs: { ...current[language].tabs, language: value } } }))} />
              </div>
            </CardShell>

            <CardShell title={`Skills · ${language.toUpperCase()}`} subtitle="Icons list dan kategori skill" actions={null}>
              <ListField
                label="Icons"
                value={currentSite.skills.icons}
                onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], skills: { ...current[language].skills, icons: value } } }))}
                rows={5}
              />
              <ArrayEditor
                items={currentSite.skills.categories}
                onChange={(items) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], skills: { ...current[language].skills, categories: items } } }))}
                createItem={blankSkillsCategory}
                addLabel="Add skill category"
                renderItem={(item, index, update) => (
                  <div className="space-y-4">
                    <Field
                      label="Category title"
                      value={item.title}
                      onChange={(value) => update({ ...item, title: value })}
                    />
                    <ListField
                      label="Category items"
                      value={item.items}
                      onChange={(value) => update({ ...item, items: value })}
                      rows={4}
                    />
                  </div>
                )}
              />
            </CardShell>

            <CardShell title={`Experience · ${language.toUpperCase()}`} subtitle="Repeatable experience cards" actions={null}>
              <ArrayEditor
                items={currentSite.experience}
                onChange={(items) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], experience: items } }))}
                createItem={blankExperience}
                addLabel="Add experience"
                renderItem={(item, index, update) => (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={item.title} onChange={(value) => update({ ...item, title: value })} />
                    <Field label="Company" value={item.company} onChange={(value) => update({ ...item, company: value })} />
                    <Field label="Period" value={item.period} onChange={(value) => update({ ...item, period: value })} />
                    <Field label="Location" value={item.location} onChange={(value) => update({ ...item, location: value })} />
                    <Field label="Type" value={item.type} onChange={(value) => update({ ...item, type: value })} />
                    <div className="md:col-span-2 space-y-4">
                      <ListField label="Description" value={item.description} onChange={(value) => update({ ...item, description: value })} rows={5} />
                      <ListField label="Tags" value={item.tags} onChange={(value) => update({ ...item, tags: value })} rows={3} />
                    </div>
                  </div>
                )}
              />
            </CardShell>

            <CardShell title={`Education · ${language.toUpperCase()}`} subtitle="Repeatable education cards" actions={null}>
              <ArrayEditor
                items={currentSite.education}
                onChange={(items) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], education: items } }))}
                createItem={blankEducation}
                addLabel="Add education"
                renderItem={(item, index, update) => (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={item.title} onChange={(value) => update({ ...item, title: value })} />
                    <Field label="Institution" value={item.institution} onChange={(value) => update({ ...item, institution: value })} />
                    <Field label="Period" value={item.period} onChange={(value) => update({ ...item, period: value })} />
                    <Field label="Location" value={item.location} onChange={(value) => update({ ...item, location: value })} />
                    <Field label="Type" value={item.type} onChange={(value) => update({ ...item, type: value })} />
                    <div className="md:col-span-2 space-y-4">
                      <ListField label="Description" value={item.description} onChange={(value) => update({ ...item, description: value })} rows={5} />
                      <ListField label="Tags" value={item.tags} onChange={(value) => update({ ...item, tags: value })} rows={3} />
                    </div>
                  </div>
                )}
              />
            </CardShell>

            <CardShell title={`Certifications · ${language.toUpperCase()}`} subtitle="Repeatable certification cards" actions={null}>
              <ArrayEditor
                items={currentSite.certifications}
                onChange={(items) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], certifications: items } }))}
                createItem={blankCertification}
                addLabel="Add certification"
                renderItem={(item, index, update) => (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={item.title} onChange={(value) => update({ ...item, title: value })} />
                    <Field label="Provider" value={item.provider} onChange={(value) => update({ ...item, provider: value })} />
                    <Field label="Date" value={item.date} onChange={(value) => update({ ...item, date: value })} />
                    <Field label="Link" value={item.link} onChange={(value) => update({ ...item, link: value })} />
                  </div>
                )}
              />
            </CardShell>

            <CardShell title={`Languages · ${language.toUpperCase()}`} subtitle="Language chips shown in the section" actions={null}>
              <ListField
                label="Languages"
                value={currentSite.languages}
                onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], languages: value } }))}
                rows={5}
              />
            </CardShell>

            <CardShell title={`Contact · ${language.toUpperCase()}`} subtitle="Contact links and form action" actions={null}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Email" value={currentSite.contact.email} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], contact: { ...current[language].contact, email: value } } }))} />
                <Field label="Email href" value={currentSite.contact.emailHref} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], contact: { ...current[language].contact, emailHref: value } } }))} />
                <Field label="LinkedIn" value={currentSite.contact.linkedin} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], contact: { ...current[language].contact, linkedin: value } } }))} />
                <Field label="GitHub" value={currentSite.contact.github} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], contact: { ...current[language].contact, github: value } } }))} />
                <Field label="Instagram" value={currentSite.contact.instagram} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], contact: { ...current[language].contact, instagram: value } } }))} />
                <Field label="Form action" value={currentSite.contact.formAction} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], contact: { ...current[language].contact, formAction: value } } }))} />
              </div>
            </CardShell>

            <CardShell title={`Footer · ${language.toUpperCase()}`} subtitle="Footer quote dan caption" actions={null}>
              <Field label="Quote" value={currentSite.footer.quote} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], footer: { ...current[language].footer, quote: value } } }))} rows={3} />
              <Field label="Caption" value={currentSite.footer.caption} onChange={(value) => setSiteDraft((current) => ({ ...current, [language]: { ...current[language], footer: { ...current[language].footer, caption: value } } }))} rows={3} />
            </CardShell>
          </div>
        ) : (
          <div className="space-y-6">
            <CardShell
              title={`Projects · ${language.toUpperCase()}`}
              subtitle="Editable project cards for the homepage gallery"
              actions={
                <button type="button" onClick={saveProjects} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400">
                  <FolderPen className="h-4 w-4" />
                  {savingProjects ? "Saving..." : "Save projects"}
                </button>
              }
            >
              <ArrayEditor
                items={currentProjects}
                onChange={(items) => setProjectsDraft((current) => ({ ...current, [language]: items }))}
                createItem={blankProject}
                addLabel="Add project"
                renderItem={(item, index, update) => (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title" value={item.title} onChange={(value) => update({ ...item, title: value })} />
                      <Field label="Icon / emoji" value={item.icon} onChange={(value) => update({ ...item, icon: value })} />
                      <Field label="Gradient" value={item.gradient} onChange={(value) => update({ ...item, gradient: value })} />
                      <Field label="Image path or URL" value={item.image} onChange={(value) => update({ ...item, image: value })} />
                    </div>
                    <Field label="Description" value={item.description} onChange={(value) => update({ ...item, description: value })} rows={4} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <ListField label="Highlights" value={item.highlights} onChange={(value) => update({ ...item, highlights: value })} rows={4} />
                      <ListField label="Methods" value={item.methods} onChange={(value) => update({ ...item, methods: value })} rows={4} />
                      <ListField label="Tools" value={item.tools} onChange={(value) => update({ ...item, tools: value })} rows={4} />
                      <ListField label="Data" value={item.data} onChange={(value) => update({ ...item, data: value })} rows={4} />
                    </div>
                    <ArrayEditor
                      items={item.links}
                      onChange={(links) => update({ ...item, links })}
                      createItem={() => ({ text: "", url: "" })}
                      addLabel="Add link"
                      renderItem={(link, linkIndex, updateLink) => (
                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="Link text" value={link.text} onChange={(value) => updateLink({ ...link, text: value })} />
                          <Field label="Link url" value={link.url} onChange={(value) => updateLink({ ...link, url: value })} />
                        </div>
                      )}
                    />
                  </div>
                )}
              />
            </CardShell>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Tip</p>
              <p className="mt-1">Kalau kamu kosongkan semua field di sebuah section, save akan menulis null/empty override supaya homepage kembali pakai fallback default.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-sm text-slate-400">{status}</p>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={saveContent}
              disabled={savingContent}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-sky-500 hover:text-white disabled:opacity-60 inline-flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save content
            </button>
            <button
              type="button"
              onClick={saveProjects}
              disabled={savingProjects}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-sky-500 hover:text-white disabled:opacity-60 inline-flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save projects
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
