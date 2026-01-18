"use client"

import { useState, useEffect, useRef } from "react"
import {
  Calendar,
  MapPin,
  ExternalLink,
  ChevronDown,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Download,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Settings,
} from "lucide-react"
import Image from "next/image"

type TabType = "skills" | "experience" | "education" | "certifications"

// Skills data organized by category
const skillsData = {
  icons: [
    "Python",
    "R",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Power BI",
    "Excel",
    "Google Cloud",
    "Docker",
    "Git",
    "GitHub",
    "Figma",
    "Premiere Pro",
    "Photoshop",
    "Illustrator",
  ],
  categories: [
    {
      title: "Programming Languages",
      items: ["Python", "SQL", "R", "MATLAB", "TypeScript"],
    },
    {
      title: "Data Manipulation & Analysis",
      items: ["NumPy", "Pandas", "Polars", "SciPy", "Statsmodels", "Regex", "Excel", "Google Sheets"],
    },
    {
      title: "Machine Learning & AI",
      items: ["Scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "LightGBM", "Hugging Face"],
    },
    {
      title: "Data Visualization",
      items: ["Matplotlib", "Seaborn", "Plotly", "Power BI", "Tableau", "Looker Studio"],
    },
    {
      title: "Databases & Cloud",
      items: ["PostgreSQL", "MySQL", "MongoDB", "BigQuery", "Google Cloud", "AWS"],
    },
    {
      title: "Tools & DevOps",
      items: ["Git", "GitHub", "Docker", "Airflow", "dbt", "Jupyter"],
    },
  ],
}

const experienceData = [
  {
    title: "Data Analyst",
    company: "信傳企業有限公司 (Kaohsiung, Taiwan)",
    period: "Sept 2025 - Present",
    location: "Kaohsiung, Taiwan",
    type: "On-site",
    description: [
      "Optimized ETL/ELT data lake pipelines (PostgreSQL) and integrated data from MySQL, Appsflyer, Meta Ads, TikTok Ads for accurate analytics and dashboards.",
      "Analyzed user journeys (install → register → add to cart → purchase) across OS and languages to improve marketing and product strategies.",
      "Built automations in Ragic (CRM/ERP platform) using JavaScript and optimized Google Apps Script workflows to reduce NPL monitoring time by 70%.",
      "Created Python automation that accelerated monthly reporting and reduced manual errors by streamlining data processing.",
    ],
    tags: ["Python", "PostgreSQL", "MySQL", "ETL/ELT", "JavaScript", "Data Analytics"],
  },
  {
    title: "Teaching Assistant - Introduction to AI",
    company: "National Chengchi University",
    period: "Feb 2025 - June 2025",
    location: "Taipei, Taiwan",
    type: "On-site",
    description: [
      "Mentored 40+ students in applying Python, data analytics, and machine learning (DNN, CNN, RNN), and Transformer models to real-world business problems.",
      "Led AI projects involving NLP (LLM), MongoDB, API integration, and RAG pipelines for system automation and decision-making.",
      "Guided hands-on implementation of advanced AI techniques for predictive analytics and intelligent systems.",
    ],
    tags: ["Python", "Machine Learning", "NLP", "LLM", "RAG", "MongoDB"],
  },
  {
    title: "Market Analyst Intern",
    company: "The Economist Group: Clearstate",
    period: "Nov 2024 - March 2025",
    location: "Singapore (Remote)",
    type: "Remote",
    description: [
      "Analyzed global healthcare and IVD/med-tech trends, conducting APAC-wide market sizing and financial modeling for Roche and major competitors.",
      "Led 10+ interviews with KOLs, laboratories, and multinational IVD companies to gather expert perspectives on histopathology markets across APAC.",
      "Cleaned, mapped, and analyzed 500,000+ import records using Python and automation in Excel for market intelligence.",
    ],
    tags: ["Python", "Excel", "Market Analysis", "Data Cleaning", "Financial Modeling"],
  },
  {
    title: "Teaching Assistant - Statistics",
    company: "National Chengchi University",
    period: "Sep 2024 - Jan 2025",
    location: "Taipei, Taiwan",
    type: "On-site",
    description: [
      "Guided 50+ students in statistical analysis using R, assisting with grading, coursework, and practical data-driven problem-solving.",
      "Supported quantitative research methodology and statistical inference applications across diverse datasets.",
    ],
    tags: ["R", "Statistics", "Data Analysis"],
  },
  {
    title: "Brand Marketing Strategy",
    company: "Ruangguru",
    period: "Feb 2022 - May 2022",
    location: "Jakarta, Indonesia",
    type: "On-site",
    description: [
      "Managed marketing campaigns across all channels: social media, digital ads, banners, community, CRM, web/blog, SEO & SEM, and influencers.",
      "Created 90+ marketing brief campaigns and 20+ content concept briefs for SkillAcademy's Google Display and YouTube ads with CTRs of 0.39%-1.01% and 0.20%-0.54%.",
      "Ranked #1 among 14 groups in Final Project LEAP Batch 3 competitive case competition.",
    ],
    tags: ["Marketing Strategy", "Digital Marketing", "Campaign Management", "Content Strategy"],
  },
  {
    title: "Business Project Consultant",
    company: "Asuransi Astra",
    period: "Aug 2021 - Dec 2021",
    location: "Jakarta, Indonesia",
    type: "On-site",
    description: [
      "Increased employer branding effectiveness by 20% by identifying optimal marketing channels using design thinking approach.",
      "Translated business needs into actionable insights and ensured 100% on-time project completion.",
      "Refined processes and system requirements through cross-functional collaboration and structured project management.",
    ],
    tags: ["Business Consulting", "Employer Branding", "Project Management", "Strategic Planning"],
  },
]

const educationData = [
  {
    title: "Master's in Computational Social Science",
    institution: "National Chengchi University",
    period: "2022 - 2024",
    location: "Taipei, Taiwan",
    type: "On-site",
    description: [
      "Specialized in applying computational methods to social science research.",
      "Thesis: 'The Study of the Relationship Between Trump's Social Media Posts and Bitcoin Returns During the 2024 U.S. Presidential Election with A Large Language Model Analysis'",
    ],
    tags: ["Machine Learning", "NLP", "Econometrics", "Research Methods"],
  },
  {
    title: "Bachelor of Science in Physics",
    institution: "Bandung Institute of Technology",
    period: "2018 - 2022",
    location: "Bandung, Indonesia",
    type: "On-site",
    description: [
      "Relevant coursework: Data Processing and Analysis, Statistical Physics, Simulation and Modeling of Physical Systems, Computational Physics.",
      "Organizations: Physics Student Association (HIMAFI) ITB, Society of Renewable Energy, ITB Student Press.",
    ],
    tags: ["Physics", "Data Processing", "Statistical Physics", "Computational Physics"],
  },
]

const certificationsData = [
  {
    title: "Google Data Analytics Professional Certificate",
    provider: "Google (Coursera)",
    date: "2024",
    link: "#",
  },
  {
    title: "Machine Learning Specialization",
    provider: "Stanford University (Coursera)",
    date: "2024",
    link: "#",
  },
  {
    title: "SQL for Data Science",
    provider: "UC Davis (Coursera)",
    date: "2023",
    link: "#",
  },
  {
    title: "Python for Data Science and AI",
    provider: "IBM (Coursera)",
    date: "2023",
    link: "#",
  },
  {
    title: "Data Visualization with Tableau",
    provider: "UC Davis (Coursera)",
    date: "2023",
    link: "#",
  },
]

const projectsData = [
  {
    title: "Trump's Social Media & Bitcoin Analysis",
    description:
      "LLM-powered analysis studying the causal relationship between Trump's social media posts and Bitcoin returns during the 2024 U.S. Presidential Election.",
    icon: "📊",
    gradient: "from-sky-500/20 to-violet-500/20",
    link: "https://nccur.lib.nccu.edu.tw/handle/140.119/158548",
    linkText: "View Paper",
  },
  {
    title: "StopScams.in",
    description:
      "AI-powered platform that detects scam messages and supports users through digital fraud with smart tools and real-time help.",
    icon: "🛡️",
    gradient: "from-emerald-500/20 to-sky-500/20",
    link: "https://stopscams.in",
    linkText: "Live View",
  },
]

// Animated letter component with jello effect
function JelloLetter({ char, delay }: { char: string; delay: number }) {
  return (
    <span
      className="inline-block jello-letter cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  )
}

// Animated text component
function AnimatedText({ text, className, baseDelay = 0 }: { text: string; className?: string; baseDelay?: number }) {
  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <JelloLetter key={index} char={char} delay={baseDelay + index * 50} />
      ))}
    </span>
  )
}

function SkillIcon({ name, isDark }: { name: string; isDark: boolean }) {
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase()
  }

  const getColor = (name: string) => {
    if (isDark) {
      const colors = [
        "bg-blue-500/20 text-blue-400 border-blue-500/30",
        "bg-green-500/20 text-green-400 border-green-500/30",
        "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        "bg-red-500/20 text-red-400 border-red-500/30",
        "bg-purple-500/20 text-purple-400 border-purple-500/30",
        "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
        "bg-orange-500/20 text-orange-400 border-orange-500/30",
        "bg-pink-500/20 text-pink-400 border-pink-500/30",
      ]
      const index = name.charCodeAt(0) % colors.length
      return colors[index]
    }
    const colors = [
      "bg-blue-100 text-blue-600 border-blue-200",
      "bg-green-100 text-green-600 border-green-200",
      "bg-yellow-100 text-yellow-600 border-yellow-200",
      "bg-red-100 text-red-600 border-red-200",
      "bg-purple-100 text-purple-600 border-purple-200",
      "bg-cyan-100 text-cyan-600 border-cyan-200",
      "bg-orange-100 text-orange-600 border-orange-200",
      "bg-pink-100 text-pink-600 border-pink-200",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold border ${getColor(name)} transition-all duration-300 hover:scale-110`}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}

function TimelineCard({
  title,
  subtitle,
  period,
  location,
  type,
  description,
  tags,
  isLast,
  isDark,
}: {
  title: string
  subtitle: string
  period: string
  location: string
  type: string
  description: string[]
  tags: string[]
  isLast: boolean
  isDark: boolean
}) {
  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${isDark ? "bg-sky-400 border-sky-400/50" : "bg-sky-500 border-sky-500/50"} border-2 z-10 shrink-0`} />
        {!isLast && <div className={`w-0.5 ${isDark ? "bg-slate-700" : "bg-slate-300"} flex-1 mt-2`} />}
      </div>

      <div className="flex-1 pb-8">
        <div className={`${isDark ? "bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"} border rounded-2xl p-6 transition-all duration-300`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"} mb-1`}>{title}</h3>
              <p className={`${isDark ? "text-sky-400" : "text-sky-600"} font-medium`}>{subtitle}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-100"} flex items-center justify-center`}>
              <span className="text-lg">🎓</span>
            </div>
          </div>

          <div className={`flex flex-wrap gap-4 text-sm ${isDark ? "text-slate-400" : "text-slate-500"} mb-4`}>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {period}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {location} | {type}
            </span>
          </div>

          <ul className="space-y-2 mb-4">
            {description.map((item, index) => (
              <li key={index} className={`flex gap-2 ${isDark ? "text-slate-300" : "text-slate-600"} text-sm leading-relaxed`}>
                <span className={`${isDark ? "text-sky-400" : "text-sky-500"} mt-1.5`}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 text-xs rounded-full ${isDark ? "bg-slate-700/50 text-slate-300 border-slate-600/50" : "bg-slate-100 text-slate-600 border-slate-200"} border`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CertificationCard({
  title,
  provider,
  date,
  link,
  isDark,
}: {
  title: string
  provider: string
  date: string
  link: string
  isDark: boolean
}) {
  return (
    <div className={`${isDark ? "bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"} border rounded-2xl p-5 transition-all duration-300 group`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${isDark ? "bg-amber-500/20" : "bg-amber-100"} flex items-center justify-center shrink-0`}>
          <span className="text-2xl">🏆</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-lg font-semibold ${isDark ? "text-white group-hover:text-sky-400" : "text-slate-900 group-hover:text-sky-600"} transition-colors`}>{title}</h3>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-1.5 rounded-lg ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"} transition-colors shrink-0`}
            >
              <ExternalLink className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
            </a>
          </div>
          <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-sm mt-1`}>{provider}</p>
          <div className={`flex items-center gap-1.5 ${isDark ? "text-slate-500" : "text-slate-400"} text-sm mt-2`}>
            <Calendar className="w-3.5 h-3.5" />
            {date}
          </div>
        </div>
      </div>
    </div>
  )
}

// Floating equation component
function FloatingEquation({ equation, delay, duration }: { equation: string; delay: number; duration: number }) {
  const [position] = useState({
    left: Math.random() * 100,
    top: Math.random() * 100,
  })

  return (
    <div
      className="absolute text-sm font-mono opacity-20 pointer-events-none select-none"
      style={{
        left: `${position.left}%`,
        top: `${position.top}%`,
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {equation}
    </div>
  )
}

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<TabType>("skills")
  const [isDark, setIsDark] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Mathematical equations for background
  const equations = [
    "∫f(x)dx",
    "∂f/∂x",
    "∑xi/n",
    "σ² = E[(X-μ)²]",
    "P(A|B) = P(B|A)P(A)/P(B)",
    "f(x) = 1/√(2πσ²)e^(-(x-μ)²/2σ²)",
    "∇f(x)",
    "lim[n→∞]",
    "E[X] = ∑xiP(xi)",
    "y = mx + b",
    "R² = 1 - SSres/SStot",
    "∂L/∂w = 0",
    "J(θ) = 1/2m ∑(hθ(x)-y)²",
    "softmax(xi) = e^xi/∑e^xj",
    "tanh(x) = (e^x - e^-x)/(e^x + e^-x)",
    "log(p/(1-p)) = β₀ + β₁x",
    "MSE = 1/n ∑(yi - ŷi)²",
    "Cov(X,Y) = E[(X-μx)(Y-μy)]",
    "ρ = Cov(X,Y)/(σxσy)",
    "χ² = ∑(Oi-Ei)²/Ei",
  ]

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio("/audio/background-music.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "certifications", label: "Certifications" },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-slate-950 text-white" : "bg-gradient-to-b from-sky-100 via-slate-50 to-white text-slate-900"}`}>
      {/* Background gradient */}
      {isDark ? (
        <>
          <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
          <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-sky-900/20 to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="fixed inset-0 bg-gradient-to-b from-sky-100/50 via-white to-white pointer-events-none" />
      )}

      {/* Floating Mathematical Equations */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none ${isDark ? "text-sky-400/30" : "text-sky-600/20"}`}>
        {equations.map((eq, index) => (
          <FloatingEquation
            key={index}
            equation={eq}
            delay={index * 2}
            duration={20 + Math.random() * 10}
          />
        ))}
      </div>

      {/* Settings Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {showSettings && (
          <div className={`flex flex-col gap-2 p-3 rounded-2xl ${isDark ? "bg-slate-800/90 border-slate-700" : "bg-white/90 border-slate-200 shadow-lg"} border backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-300`}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-12 h-12 rounded-xl ${isDark ? "bg-slate-700 hover:bg-slate-600 text-amber-400" : "bg-slate-100 hover:bg-slate-200 text-slate-700"} flex items-center justify-center transition-all`}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Music Toggle */}
            <button
              onClick={toggleMusic}
              className={`w-12 h-12 rounded-xl ${isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"} ${isPlaying ? (isDark ? "text-sky-400" : "text-sky-600") : (isDark ? "text-slate-400" : "text-slate-500")} flex items-center justify-center transition-all`}
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        )}

        {/* Main Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-14 h-14 rounded-full ${isDark ? "bg-sky-500 hover:bg-sky-400 text-white" : "bg-sky-500 hover:bg-sky-400 text-white"} flex items-center justify-center shadow-lg transition-all ${showSettings ? "rotate-45" : ""}`}
          aria-label="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        {/* Radial gradient glow effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] ${isDark ? "bg-gradient-radial from-sky-900/30 via-slate-900/50 to-transparent" : "bg-gradient-radial from-sky-200/50 via-transparent to-transparent"} rounded-full blur-3xl`} />
          <div className={`absolute bottom-0 left-0 right-0 h-32 ${isDark ? "bg-gradient-to-t from-slate-950 to-transparent" : "bg-gradient-to-t from-white to-transparent"}`} />
        </div>

        <div className="max-w-4xl mx-auto w-full text-center relative">
          <div className="space-y-6">
            {/* Hello greeting */}
            <p className={`font-mono ${isDark ? "text-sky-400" : "text-sky-600"} text-lg tracking-wide`}>
              <AnimatedText text="Hello(); I'm" />
            </p>

            {/* Name with animated letters */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
              <AnimatedText 
                text="Ignatius " 
                className={isDark ? "text-white" : "text-slate-900"} 
                baseDelay={200} 
              />
              <AnimatedText 
                text="Harry" 
                className={isDark ? "text-sky-400" : "text-sky-600"} 
                baseDelay={700} 
              />
            </h1>

            {/* Tagline */}
            <h2 className={`text-xl md:text-2xl ${isDark ? "text-slate-400" : "text-slate-600"} font-medium`}>
              I analyze data & build models
            </h2>

            {/* Description */}
            <div className={`max-w-xl mx-auto space-y-2 ${isDark ? "text-slate-500" : "text-slate-500"} leading-relaxed text-sm md:text-base`}>
              <p>
                Data Analyst & Data Engineer with experience across Taiwan, Singapore, and Indonesia.
              </p>
              <p>
                Experienced in ETL/ELT pipelines, SQL databases, Python analytics, machine learning, NLP, financial and
                econometric modeling for business and research use cases.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <a
                href="mailto:ignatiusharry14@gmail.com"
                className="relative px-8 py-3 rounded-full font-medium text-white overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500 bg-[length:200%_100%] animate-gradient-x" />
                <span className="relative">{"Let's Talk!"}</span>
              </a>

              <a
                href="/cv/Ignatius_Harry_CV.pdf"
                download
                className={`px-8 py-3 rounded-full font-medium ${isDark ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-slate-900 text-white hover:bg-slate-800"} transition-colors flex items-center gap-2`}
              >
                <Download className="w-4 h-4" />
                Download CV!
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 pt-4">
              <a
                href="https://github.com/IgnatiusHarry"
                target="_blank"
                rel="noopener noreferrer"
                className={`${isDark ? "text-slate-500 hover:text-sky-400" : "text-slate-400 hover:text-sky-600"} transition-colors`}
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/ignatiusharry/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${isDark ? "text-slate-500 hover:text-sky-400" : "text-slate-400 hover:text-sky-600"} transition-colors`}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/ignatius_harry/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${isDark ? "text-slate-500 hover:text-sky-400" : "text-slate-400 hover:text-sky-600"} transition-colors`}
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="mailto:ignatiusharry14@gmail.com"
                className={`${isDark ? "text-slate-500 hover:text-sky-400" : "text-slate-400 hover:text-sky-600"} transition-colors`}
                aria-label="Email"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>

            {/* Scroll down indicator */}
            <div className="flex flex-col items-center gap-3 pt-12">
              <p className={`${isDark ? "text-slate-500" : "text-slate-400"} text-sm`}>Scroll to explore</p>
              <button
                onClick={() => document.getElementById("introduction")?.scrollIntoView({ behavior: "smooth" })}
                className={`w-12 h-12 rounded-full ${isDark ? "bg-sky-500/20 border-sky-500/30 text-sky-400 hover:bg-sky-500/30" : "bg-sky-100 border-sky-200 text-sky-600 hover:bg-sky-200"} border flex items-center justify-center transition-colors animate-bounce`}
                aria-label="Scroll down"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Introduction with Photo */}
      <section id="introduction" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <h2 className={`font-mono text-3xl md:text-4xl ${isDark ? "text-white" : "text-slate-900"}`}>
                {"</"}<span className={isDark ? "text-sky-400" : "text-sky-600"}>Introduction</span>{">"}
                <span className={`inline-block w-32 h-0.5 ${isDark ? "bg-slate-700" : "bg-slate-300"} ml-4 align-middle`} />
              </h2>

              <div className={`space-y-4 ${isDark ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                <p>
                  {"Hi! My name is Harry. I'm a Data Analyst & Computational Social Science Researcher with experience across Taiwan, Singapore, and Indonesia."}
                </p>
                <p>
                  Specialized in sentiment analysis, machine learning, NLP, and econometrics to transform complex data into actionable insights.
                </p>
                <p>
                  My research focuses on business & econometrics applications, including market analysis, consumer behavior, and policy evaluation. I excel at using data to tell compelling stories that drive strategic decisions.
                </p>
              </div>

              {/* Scroll down indicator */}
              <button
                className={`w-12 h-12 rounded-full ${isDark ? "bg-sky-500/20 border-sky-500/30 text-sky-400 hover:bg-sky-500/30" : "bg-sky-100 border-sky-200 text-sky-600 hover:bg-sky-200"} border flex items-center justify-center transition-colors`}
                aria-label="Scroll down"
                onClick={() => document.getElementById("about-tabs")?.scrollIntoView({ behavior: "smooth" })}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Right side - Photo */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                {/* Photo frame with glow */}
                <div className={`absolute -inset-1 ${isDark ? "bg-gradient-to-br from-sky-500/20 to-transparent" : "bg-gradient-to-br from-sky-300/30 to-transparent"} rounded-2xl blur-sm`} />
                <div className={`relative w-72 h-96 md:w-80 md:h-[420px] rounded-2xl overflow-hidden border ${isDark ? "border-slate-700/50" : "border-slate-200"}`}>
                  <Image
                    src="/images/profile-photo.jpg"
                    alt="Ignatius Harry - Data Analyst"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Social links below photo */}
              <div className="flex gap-3">
                <a
                  href="https://github.com/IgnatiusHarry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-xl ${isDark ? "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-sky-500/50" : "bg-white border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-300 shadow-sm"} border flex items-center justify-center transition-all`}
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/ignatiusharry/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-xl ${isDark ? "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-sky-500/50" : "bg-white border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-300 shadow-sm"} border flex items-center justify-center transition-all`}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/ignatius_harry/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-xl ${isDark ? "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-sky-500/50" : "bg-white border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-300 shadow-sm"} border flex items-center justify-center transition-all`}
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="mailto:ignatiusharry14@gmail.com"
                  className={`w-12 h-12 rounded-xl ${isDark ? "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-sky-500/50" : "bg-white border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-300 shadow-sm"} border flex items-center justify-center transition-all`}
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Tabs Section */}
      <section id="about-tabs" className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className={isDark ? "text-sky-400" : "text-sky-600"}>About</span>{" "}
              <span className={isDark ? "text-white" : "text-slate-900"}>Me</span>
            </h2>
            <p className={`text-lg ${isDark ? "text-slate-400" : "text-slate-600"} max-w-2xl mx-auto leading-relaxed text-balance`}>
              Driven by extreme curiosity with the help of LLM to answer my questions about certain things, I am able to
              learn new concepts quickly and apply them to my work and projects.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-10">
            <div className={`inline-flex ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} rounded-full p-1.5 border`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? isDark
                        ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                        : "bg-sky-500 text-white"
                      : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div className="animate-in fade-in duration-500">
                {/* Skills Icons Grid */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                  {skillsData.icons.map((skill, index) => (
                    <SkillIcon key={index} name={skill} isDark={isDark} />
                  ))}
                </div>

                {/* Skills Categories */}
                <div className="grid md:grid-cols-2 gap-8">
                  {skillsData.categories.map((category, index) => (
                    <div key={index}>
                      <h3 className={`${isDark ? "text-sky-400" : "text-sky-600"} font-semibold mb-4`}>{category.title}</h3>
                      <ul className="space-y-2">
                        {category.items.map((item, i) => (
                          <li key={i} className={`flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-sky-400/50" : "bg-sky-500/50"}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div className="animate-in fade-in duration-500">
                {experienceData.map((exp, index) => (
                  <TimelineCard
                    key={index}
                    title={exp.title}
                    subtitle={exp.company}
                    period={exp.period}
                    location={exp.location}
                    type={exp.type}
                    description={exp.description}
                    tags={exp.tags}
                    isLast={index === experienceData.length - 1}
                    isDark={isDark}
                  />
                ))}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div className="animate-in fade-in duration-500">
                {educationData.map((edu, index) => (
                  <TimelineCard
                    key={index}
                    title={edu.title}
                    subtitle={edu.institution}
                    period={edu.period}
                    location={edu.location}
                    type={edu.type}
                    description={edu.description}
                    tags={edu.tags}
                    isLast={index === educationData.length - 1}
                    isDark={isDark}
                  />
                ))}
              </div>
            )}

            {/* Certifications Tab */}
            {activeTab === "certifications" && (
              <div className="animate-in fade-in duration-500 space-y-4">
                {certificationsData.map((cert, index) => (
                  <CertificationCard
                    key={index}
                    title={cert.title}
                    provider={cert.provider}
                    date={cert.date}
                    link={cert.link}
                    isDark={isDark}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Scroll indicator */}
          <div className="text-center mt-8">
            <p className={`${isDark ? "text-slate-500" : "text-slate-400"} text-sm mb-2`}>Scroll to explore</p>
            <ChevronDown className={`w-5 h-5 mx-auto ${isDark ? "text-slate-500" : "text-slate-400"} animate-bounce`} />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`relative z-10 py-24 px-6 ${isDark ? "bg-slate-900/50" : "bg-slate-50"}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"} mb-4`}>{"</Projects>"}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projectsData.map((project, index) => (
              <div
                key={index}
                className={`${isDark ? "bg-slate-800/50 border-slate-700/50 hover:border-sky-500/30" : "bg-white border-slate-200 hover:border-sky-300 shadow-sm"} border rounded-2xl overflow-hidden transition-all duration-300 group`}
              >
                <div
                  className={`aspect-video bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
                >
                  <span className="text-6xl">{project.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"} mb-2`}>{project.title}</h3>
                  <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-sm mb-4`}>{project.description}</p>
                  <div className="flex gap-3">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${isDark ? "text-sky-400" : "text-sky-600"} hover:underline text-sm flex items-center gap-1`}
                    >
                      {project.linkText} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 py-16 px-6 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <div className="max-w-5xl mx-auto text-center">
          <p className={`text-2xl font-bold ${isDark ? "text-sky-400" : "text-sky-600"} mb-6 italic`}>{'"熟能生巧！"'}</p>
          <p className={`${isDark ? "text-slate-500" : "text-slate-500"} mb-8`}>Practice makes perfect!</p>

          <div className="flex justify-center gap-6 mb-8">
            <a
              href="https://github.com/IgnatiusHarry"
              target="_blank"
              rel="noopener noreferrer"
              className={`${isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900"} transition-colors`}
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/ignatiusharry/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900"} transition-colors`}
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/ignatius_harry/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900"} transition-colors`}
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="mailto:ignatiusharry14@gmail.com"
              className={`${isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900"} transition-colors`}
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>

          <p className={`${isDark ? "text-slate-600" : "text-slate-400"} text-sm`}>Ignatius Harry Cahiadharma. Built with Love. © 2026</p>
        </div>
      </footer>
    </div>
  )
}
