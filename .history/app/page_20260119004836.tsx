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

type TabType = "skills" | "experience" | "education" | "certifications" | "language"

// Skills data organized by category
const skillsData = {
  icons: [
    "Python",
    "R",
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
    items: ["Python", "PostgreSQL", "MySQL", "R", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Data Manipulation & Analysis",
    items: ["Pandas", "NumPy", "Polars", "Statsmodels", "Excel", "Google Sheets"],
  },
  {
    title: "Machine Learning",
    items: ["Scikit-learn", "XGBoost", "KNN", "Time Series Modeling"],
  },
  {
    title: "LLM Systems & NLP",
    items: [
      "Hugging Face",
      "Text Embeddings",
      "Sentiment Analysis",
      "Topic Modeling",
      "Named Entity Recognition (NER)",
    ],
  },
  {
    title: "AI Applications & Systems",
    items: ["AI Chatbots", "RAG", "Semantic Search", "Document Q&A"],
  },
  {
    title: "Data Engineering & System Integration",
    items: [
      "REST APIs",
      "Webhook Integration",
      "API Data Ingestion",
      "ETL / ELT Pipelines",
      "JSON / HTTP"
    ],
  },
  {
    title: "Business Systems & Automation",
    items: [
      "Ragic (No-Code Database)",
      "Workflow Automation",
      "Business Process Automation",
      "Operational Dashboards"
    ],
  },
  {
    title: "Databases & Cloud",
    items: ["PostgreSQL", "MySQL", "MongoDB", "BigQuery", "AWS", "Google Cloud"],
  },
  {
  title: "Financial Markets & Investment Analysis",
  items: [
    "Equity Research & Data Analysis",
    "Financial and Data Modeling",
    "Valuation (DCF, Multiples)",
    "Financial Statement Analysis",
    "Market & Sector Analysis",
    "Investment Thesis Development"
  ],
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
    company: "信傳企業有限公司",
    period: "Sept 2025 - Present",
    location: "Kaohsiung, Taiwan",
    type: "On-site",
    description: [
      "Built and maintained ETL/ELT data lake pipelines (PostgreSQL) and integrated data from MySQL, Appsflyer, Meta Ads, TikTok Ads.",
      "Analyzed user journeys (install → register → add to cart → purchase) across OS and languages.",
      "Built automations in Ragic (CRM/ERP platform) using JavaScript and reduced NPL monitoring time by 70%.",
    ],
    tags: ["Python", "PostgreSQL", "MySQL", "ETL/ELT", "JavaScript"],
  },
  {
    title: "Teaching Assistant - Introduction to AI",
    company: "National Chengchi University",
    period: "Feb 2025 - June 2025",
    location: "Taipei, Taiwan",
    type: "On-site",
    description: [
      "Mentored 40+ students in Python, machine learning (DNN, CNN, RNN), and Transformer models.",
      "Led AI projects involving NLP (LLM), MongoDB, API integration, and RAG pipelines.",
      "Conducted NLP tasks such as classification, sequence labelling, seq2seq, and topic modelling",
      "Evaluated model prediction",
      "Created Chatbot integrated with RAG, using API"
    ],
    tags: ["Python", "Machine Learning", "NLP", "LLM", "RAG"],
  },
  {
    title: "Market Analyst Intern",
    company: "The Economist Group: Clearstate",
    period: "Nov 2024 - March 2025",
    location: "Singapore",
    type: "Remote",
    description: [
      "Analyzed global healthcare and IVD/med-tech trends, conducting APAC-wide market sizing and financial modeling.",
      "Led 10+ interviews with KOLs and multinational companies on histopathology markets.",
      "Cleaned and analyzed 500,000+ import records using Python and Excel.",
    ],
    tags: ["Python", "Excel", "Market Analysis", "Financial Modeling"],
  },
  {
    title: "Teaching Assistant - Statistics",
    company: "National Chengchi University",
    period: "Sep 2024 - Jan 2025",
    location: "Taipei, Taiwan",
    type: "On-site",
    description: [
      "Guided 50+ students in statistical analysis using R.",
      "Supported quantitative research methodology and statistical inference.",
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
      "Managed marketing campaigns across social media, digital ads, CRM, SEO & SEM.",
      "Created 90+ marketing briefs for SkillAcademy's Google Display and YouTube ads.",
    ],
    tags: ["Marketing Strategy", "Digital Marketing", "Campaign Management"],
  },
  {
    title: "Business Project Consultant",
    company: "Asuransi Astra",
    period: "Aug 2021 - Dec 2021",
    location: "Jakarta, Indonesia",
    type: "On-site",
    description: [
      "Increased employer branding effectiveness by 20%.",
      "Ensured 100% on-time project completion through process refinement.",
    ],
    tags: ["Business Consulting", "Employer Branding", "Project Management"],
  },
]

const educationData = [
  {
    title: "Master of Arts in Applied Economics & Social Development",
    institution: "National Chengchi University (政大)",
    period: "2023 - 2025",
    location: "Taipei, Taiwan",
    type: "On-site",
    description: [
      "CGPA: 4.26/4.3 | Fully Scholarship | Coursework: Big Data for Social Analysis, Causal Inference & Data Science in Economics, Business Data Analytics (Python), Applied Econometrics.",
      "Research: Causal inference and LLM analysis on Trump's social media impact on Bitcoin markets.",
    ],
    tags: ["Econometrics", "Machine Learning", "Causal Inference", "Python", "LLM"],
  },
  {
    title: "Non-Degree Program - Chinese Language and Literature",
    institution: "National Taiwan Normal University (師大)",
    period: "2022 - 2024",
    location: "Taipei, Taiwan",
    type: "On-site",
    description: [
      "Huayu Enrichment Scholarship (HES) awardee - international scholarship for Mandarin language study.",
      "Professional workplace Chinese proficiency while maintaining master's degree.",
    ],
    tags: ["Chinese Language", "Mandarin"],
  },
  {
    title: "Bachelor of Management",
    institution: "Parahyangan Catholic University (UNPAR)",
    period: "2018 - 2022",
    location: "Bandung, Indonesia",
    type: "On-site",
    description: [
      "CGPA: 3.54/4.00 (Cum Laude) | Partial Scholarship | Finance, Accounting, Quantitative Analysis, Marketing, Strategic Management.",
      "Head of Public Relations, UNPAR Student Senate (2021-2022) - elected with 93% of votes.",
    ],
    tags: ["Business Management", "Finance", "Marketing", "Leadership"],
  },
]

const certificationsData = [
  {
    title: "Business Intelligence & Data Analyst (BIDA®)",
    provider: "Corporate Finance Institute (CFI)",
    date: "2024",
    link: "#",
  },
  {
    title: "FULLSTACK BOOTCAMP",
    provider: "MySkill",
    date: "2024",
    link: "#",
  },
  {
    title: "Machine Learning with Tree-Based Models in R",
    provider: "DataCamp",
    date: "2023",
    link: "#",
  },
  {
    title: "Time Series Analysis in R",
    provider: "DataCamp",
    date: "2023",
    link: "#",
  },
  {
    title: "Investment",
    provider: "The Indonesia Capital Market Institute (TICMI)",
    date: "2023",
    link: "#",
  },
]

const languagesData = [
  "Indonesia",
  "English",
  "Mandarin 中文",
]

const projectsData = [
  {
    title: "Trump's Social Media & Bitcoin Analysis",
    description:
      "LLM-powered analysis studying the causal relationship between Trump's social media posts and Bitcoin returns during the 2024 U.S. Presidential Election.",
    icon: "📊",
    image: "/images/trump-bitcoin-thesis.jpg",
    gradient: "from-sky-500/20 to-violet-500/20",
    links: [
      {
        text: "View PPT",
        url: "https://www.dropbox.com/scl/fi/mzxcjio5ec8snrzjskheu/Harry-s-Thesis.pdf?rlkey=k1ooxm8j2hjqlwxbqtb0rysy3&st=d15wboee&dl=0",
      },
      {
        text: "View Paper",
        url: "https://nccur.lib.nccu.edu.tw/handle/140.119/158548",
      },
    ],
  },
{
  title: "Tourism, GRDP & Unemployment in Indonesia",
  description:
    "Spatial panel data analysis examining how foreign and domestic tourism affect regional economic performance and unemployment across 34 Indonesian provinces (2018–2020).",
  icon: "🗺️",
  image: "/images/Portfolio LPF.png",
  gradient: "from-emerald-500/20 to-sky-500/20",
  highlights: [
    "Foreign tourism significantly increases GRDP and reduces unemployment",
    "Domestic tourism shows limited economic impact",
    "Strong spatial clustering but weak spillover effects"
  ],
  methods: [
    "Fixed Effects Panel Regression",
    "Spatial Autocorrelation (Moran’s I)",
    "LISA Cluster Analysis",
    "Spatial Econometrics"
  ],
  tools: [
    "R (plm, spdep, ggplot2)",
    "Spatial Mapping & Panel Data Modeling",
    "Tourism Satellite Account (UNWTO)"
  ],
  data: [
    "Statistics Indonesia (BPS)",
    "Ministry of Tourism & Creative Economy",
    "34 Provinces × 3 Years (2018–2020)"
  ],
  links: [
    {
      text: "View PPT",
      url: "https://www.dropbox.com/scl/fi/dm2jb8u7j4m98y7choxzy/Ignatius-Harry-Cahiadharma_Marcella-Alifia_LPF-Final-Assignment.pdf?rlkey=wa96v79tvo3230fhy2xl4tw9d&st=awz1dpgm&dl=0"
    },
    {
      text: "Github",
      url: "https://github.com/IgnatiusHarry/Tourism-in-Indonesia"
    }
  ]
},
  {
    title: "Exploring the Relationship Between Proxies of Social Capital Loss and Suicide In the United States (2000-2022)",
    description:
      "Investigated the relationship between suicide rates and various proxies of 'Social Capital loss' in the United States from 2000 to 2022. The breakdown of society in the West, marked by rising rates of racism, hate speech, and discrimination, has been accompanied by an increase in suicide rates.",
    icon: "📊",
    image: "/images/Social Capital and Suicide in the United States.png",
    gradient: "from-sky-500/20 to-violet-500/20",
    links: [
    {
      text: "View Paper",
      url: "https://github.com/IgnatiusHarry/Social-Capital-in-the-US/blob/main/Social%20Capital%20Loss%20and%20Suicide%20in%20the%20United%20States.pdf"
    },
      {
        text: "View Github",
        url: "https://github.com/IgnatiusHarry/Social-Capital-in-the-US/tree/main",
      },
    ],
  },
  {
    title: "Analysis of Taiwan Presidential Elections (2000 vs. 2024)",
    description:
      "Analyzed changes in Taiwan's political alignment by comparing the partisan characteristics of electoral regions in the 2000 and 2024 presidential elections. This analysis will include aggregating vote counts at the district level, calculating vote share percentages, and examining the correlation between vote shares across the tw",
    icon: "📊",
    image: "/images/Screenshot 2026-01-18 at 23.56.52.png",
    gradient: "from-sky-500/20 to-violet-500/20",
    links: [
      {
        text: "View Github",
        url: "https://github.com/IgnatiusHarry/Taiwan-s-Political-Alignment-Analysis-",
      },
    ],
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

// Skill logo mapping
const skillLogoMap: { [key: string]: string } = {
  "Python": "Python.png",
  "R": "R.png",
  "PostgreSQL": "postgress.png",
  "MySQL": "MySQL.png",
  "MongoDB": "MongoDB.png",
  "Power BI": "power-bi-icon.png",
  "Excel": "microsoft-excel-icon.png",
  "Google Cloud": "GoogleCloud.png",
  "Docker": "docker-inc-clip-art-microservices-application-software-container-4b0215d202db534a531f728e2f5eeeb7.png",
  "Git": "gitlogo.png",
  "GitHub": "githublogo.png",
  "Figma": "figmalogo.png",
  "Premiere Pro": "Adobe Premiere Pro.png",
  "Photoshop": "pslogo.png",
  "Illustrator": "ailogo.png",
}

function SkillIcon({ name, isDark }: { name: string; isDark: boolean }) {
  const logoFile = skillLogoMap[name]

  if (logoFile) {
    return (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center p-2 transition-all duration-300 hover:scale-110 relative"
        title={name}
      >
        <Image
          src={`/images/${logoFile}`}
          alt={name}
          fill
          className="object-contain p-1"
        />
      </div>
    )
  }

  // Fallback to initials if logo not found
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

// Typing text component
const TypingText = ({ phrases, isDark }: { phrases: string[]; isDark: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentPhrase = phrases[currentIndex]
    let charIndex = 0

    if (isTyping) {
      const typingInterval = setInterval(() => {
        if (charIndex < currentPhrase.length) {
          setDisplayText(currentPhrase.substring(0, charIndex + 1))
          charIndex++
        } else {
          setIsTyping(false)
          clearInterval(typingInterval)
        }
      }, 75) // Typing speed: 75ms per character

      return () => clearInterval(typingInterval)
    } else {
      const pauseTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length)
        setDisplayText("")
        setIsTyping(true)
      }, 1500) // Pause for 1.5 seconds before next phrase

      return () => clearTimeout(pauseTimeout)
    }
  }, [currentIndex, isTyping, phrases])

  return (
    <div className={`text-xl md:text-2xl font-medium h-12 flex items-center justify-center ${isDark ? "text-sky-400" : "text-sky-600"}`}>
      <span className={`inline-block border-r-3 ${isDark ? "border-sky-400" : "border-sky-600"} pr-1`}>
        {displayText}
      </span>
    </div>
  )
}

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<TabType>("skills")
  const [isDark, setIsDark] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
    { id: "language", label: "Language" },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-slate-950 text-white" : "bg-gradient-to-b from-sky-100 via-slate-50 to-white text-slate-900"}`}>
      {/* Background with Taiwan cityscape image */}
      <div className="fixed inset-0 pointer-events-none">
        <Image
          src="/images/taiwan-cityscape.jpg"
          alt="Taiwan cityscape"
          fill
          className="object-cover"
          priority
          quality={75}
        />
      </div>

      {/* Background gradient overlay */}
      {isDark ? (
        <>
          <div className="fixed inset-0 bg-gradient-to-b from-slate-900/70 via-slate-950/80 to-slate-950/90 pointer-events-none" />
          <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-sky-900/20 to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="fixed inset-0 bg-gradient-to-b from-white/40 via-sky-50/50 to-white/70 pointer-events-none" />
      )}

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
            </h2>

            {/* Typing text animation */}
            <TypingText 
              isDark={isDark}
              phrases={[
                "Building Data Pipelines & Intelligent Models",
                "Turning Data into Business Insights",
                "Applied Machine Learning & NLP",
                "Data-Driven Research for Real-World Impact"
              ]} 
            />

            {/* Description */}
            <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            Data Analyst & Data Engineer with experience across Indonesia, Taiwan, and Singapore
            in E-commerce, Healthcare, and Insurance. Specialized in financial market analysis,
            ETL pipelines, SQL & Python analytics, machine learning, and econometrics.
          </p>

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
          </div>
        </div>
      </section>

      {/* About Me Introduction with Photo */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <h2 className={`font-mono text-3xl md:text-4xl ${isDark ? "text-white" : "text-slate-900"}`}>
                {"</"}<span className={isDark ? "text-sky-400" : "text-sky-600"}>Intro</span>{">"}
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

            {activeTab === "language" && (
              <div className="animate-in fade-in duration-500">
                <h3 className={`${isDark ? "text-sky-400" : "text-sky-600"} font-semibold mb-4`}>Languages</h3>
                <ul className="space-y-2">
                  {languagesData.map((lang, index) => (
                    <li key={index} className={`${isDark ? "text-slate-300" : "text-slate-700"} flex items-center gap-2`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-sky-400/50" : "bg-sky-500/50"}`} />
                      {lang}
                    </li>
                  ))}
                </ul>
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
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
                    >
                      <span className="text-6xl">{project.icon}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"} mb-2`}>{project.title}</h3>
                  <p className={`${isDark ? "text-slate-400" : "text-slate-600"} text-sm mb-4`}>{project.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {project.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${isDark ? "text-sky-400" : "text-sky-600"} hover:underline text-sm flex items-center gap-1`}
                      >
                        {link.text} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
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
