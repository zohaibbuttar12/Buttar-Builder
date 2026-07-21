"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  Crown,
  Dumbbell,
  Hammer,
  Home,
  Layers3,
  MapPin,
  Menu,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  TrendingUp,
  UserRound,
  Wrench,
  X,
} from "lucide-react"

const services = [
  { icon: Home, title: "Residential Construction", text: "Elegant homes with precision engineering and timeless finishes." },
  { icon: Building2, title: "Commercial Buildings", text: "Premium commercial spaces designed for growth and prestige." },
  { icon: Layers3, title: "Grey Structure", text: "Solid structural foundations built with uncompromising quality." },
  { icon: Crown, title: "Turnkey Projects", text: "Complete construction solutions from concept to handover." },
  { icon: Wrench, title: "Renovation", text: "Modern transformations that elevate functionality and aesthetics." },
  { icon: Compass, title: "Interior Design", text: "Luxury interiors crafted for comfort, beauty, and performance." },
  { icon: Sparkles, title: "Architecture", text: "Thoughtful architectural concepts with innovation at the core." },
  { icon: TrendingUp, title: "Project Consultancy", text: "Strategic planning and expert guidance for every milestone." },
]

const benefits = [
  "Quality Materials",
  "Experienced Engineers",
  "Transparent Pricing",
  "Skilled Labour",
  "Timely Delivery",
  "Safety Standards",
]

const projects = [
  {
    title: "Marina Residences",
    budget: "PKR 1.8B",
    status: "Under Construction",
    location: "Islamabad",
    progress: "78%",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Golden Tower Suites",
    budget: "PKR 2.4B",
    status: "In Design",
    location: "Lahore",
    progress: "42%",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Harbor Commercial Hub",
    budget: "PKR 3.1B",
    status: "Completed",
    location: "Karachi",
    progress: "100%",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
  },
]

const processSteps = [
  { step: "01", title: "Planning", text: "Precise feasibility, budgeting, and strategic project guidance." },
  { step: "02", title: "Design", text: "Luxury architecture and engineered solutions tailored to your brief." },
  { step: "03", title: "Foundation", text: "Robust groundwork that ensures enduring structural integrity." },
  { step: "04", title: "Grey Structure", text: "Expert structural execution with disciplined quality control." },
  { step: "05", title: "Finishing", text: "Refined detailing, interiors, and world-class completion standards." },
  { step: "06", title: "Handover", text: "Seamless delivery with transparency, care, and lasting value." },
]

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Home Owner",
    quote: "Their craftsmanship and attention to detail transformed our vision into a masterpiece.",
  },
  {
    name: "Sultan Malik",
    role: "Business Investor",
    quote: "Professional, dependable, and incredibly transparent from planning to completion.",
  },
  {
    name: "Nadia Qureshi",
    role: "Architectural Consultant",
    quote: "A premium team that delivers luxury quality with exceptional execution.",
  },
]

export function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#projects", label: "Projects" },
    { href: "#gallery", label: "Gallery" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.15),_transparent_35%)] text-slate-900 dark:text-slate-100">
      <header id="home" className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80")' }}
        />
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/70 to-transparent" />

        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <Link href="#home" className="flex items-center gap-3 text-sm font-semibold tracking-[0.25em] text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-white/10 backdrop-blur">
              <Building2 className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <span className="hidden sm:block">BUTTAR BUILDER&apos;S &amp; DEVELOPER&apos;S</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-200 lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-[#D4AF37]">
                {link.label}
              </a>
            ))}
            <Link href="/dashboard" className="rounded-full border border-[#D4AF37]/60 px-4 py-2 text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-slate-950">
              Admin Login
            </Link>
            {mounted ? (
              <button
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full border border-white/20 p-2 text-white transition hover:bg-white/10"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            {mounted ? (
              <button
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full border border-white/20 p-2 text-white"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            ) : null}
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-full border border-white/20 p-2 text-white"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {menuOpen ? (
          <div className="relative z-20 border-t border-white/10 bg-slate-950/95 px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-3 text-sm text-slate-200">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="transition hover:text-[#D4AF37]">
                  {link.label}
                </a>
              ))}
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="w-fit rounded-full border border-[#D4AF37]/60 px-4 py-2 text-[#D4AF37]">
                Admin Login
              </Link>
            </div>
          </div>
        ) : null}

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-32">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">
              <ShieldCheck className="h-4 w-4" />
              Luxury Construction & Development Specialists
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
              Building the Future with Quality, Trust & Excellence
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              From grey structure to turnkey handover, we create landmark residences and commercial spaces with the discipline of engineering and the elegance of luxury.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#projects" className="rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]">
                Explore Projects
              </a>
              <a href="#contact" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Get a Quote
              </a>
              <Link href="/dashboard" className="rounded-full border border-[#D4AF37]/40 px-6 py-3 font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-slate-950">
                Admin Login
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-4">
              {[
                { value: "500+", label: "Projects" },
                { value: "100+", label: "Happy Clients" },
                { value: "50+", label: "Workers" },
                { value: "10+", label: "Years" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="rounded-[32px] border border-white/10 bg-slate-950/45 p-6 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[24px] border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/20 to-slate-800/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]">Signature Portfolio</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Trusted by elite developers & investors</h2>
                </div>
                <div className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-3 text-[#D4AF37]">
                  <Crown className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-8 space-y-4">
                {[
                  { title: "Luxury Residences", desc: "High-end homes with exceptional finish quality" },
                  { title: "Smart Commercial Spaces", desc: "Future-ready business environments and offices" },
                  { title: "Consultancy & Delivery", desc: "Complete project oversight and value-driven execution" },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center gap-2 text-[#D4AF37]">
                      <CheckCircle2 className="h-4 w-4" />
                      <p className="font-semibold text-white">{item.title}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main>
        <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">About the company</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                A premium construction partner built on integrity, precision, and vision.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Buttar Builders & Developers is a distinguished construction group specializing in grey structure, turnkey delivery, residential and commercial developments, renovation, interior design, architecture, and strategic consultancy.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { title: "Mission", text: "To deliver resilient, elegant, and future-ready spaces that exceed expectations." },
                { title: "Vision", text: "To become the benchmark for luxury construction excellence in every market we serve." },
                { title: "Core Values", text: "Integrity, craftsmanship, sustainability, client focus, and disciplined execution." },
                { title: "Approach", text: "Design-led construction powered by technology, transparency, and experienced leadership." },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Our services</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">Integrated services for every stage of construction.</h2>
            </div>
            <p className="max-w-2xl text-slate-600 dark:text-slate-300">From visionary planning to final handover, our expert team delivers with clarity, quality, and distinction.</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{service.text}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-800 p-8 text-white shadow-2xl dark:border-slate-800">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Why choose us</p>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Crafting landmark spaces with a luxury mindset.</h2>
                <p className="mt-4 max-w-2xl text-slate-300">Every project is driven by discipline, elegance, and a commitment to delivering exceptional value.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {benefits.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-center gap-2 text-[#D4AF37]">
                      <CheckCircle2 className="h-4 w-4" />
                      <p className="font-semibold">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Featured projects</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">Signature developments with timeless impact.</h2>
            </div>
            <p className="max-w-2xl text-slate-600 dark:text-slate-300">Explore our flagship residential and commercial ventures designed to stand the test of time.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <motion.article key={project.title} whileHover={{ y: -6, scale: 1.01 }} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <img src={project.image} alt={project.title} className="h-56 w-full object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                    <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-sm font-medium text-[#D4AF37]">{project.status}</span>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between"><span>Budget</span><span className="font-semibold text-slate-900 dark:text-white">{project.budget}</span></div>
                    <div className="flex items-center justify-between"><span>Location</span><span className="font-semibold text-slate-900 dark:text-white">{project.location}</span></div>
                    <div className="flex items-center justify-between"><span>Completion</span><span className="font-semibold text-slate-900 dark:text-white">{project.progress}</span></div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Construction process</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">A refined path from vision to handover.</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {processSteps.map((step, index) => (
                <div key={step.step} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#D4AF37]">{step.step}</span>
                    <div className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{step.text}</p>
                  {index < processSteps.length - 1 ? <div className="mt-6 h-px w-full bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/60 to-[#D4AF37]/0" /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Testimonials</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">What our clients say about the experience.</h2>
            </div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex items-center gap-3 text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => <Sparkles key={i} className="h-4 w-4" />)}
                </div>
                <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">“{item.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-8 text-white shadow-2xl dark:border-slate-800">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Contact us</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Let’s build something exceptional together.</h2>
              <div className="mt-8 space-y-4 text-slate-300">
                <div className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 text-[#D4AF37]" /><div><p className="font-semibold text-white">Office Address</p><p>29-A, Gulberg III, Lahore, Pakistan</p></div></div>
                <div className="flex items-start gap-3"><Phone className="mt-1 h-5 w-5 text-[#D4AF37]" /><div><p className="font-semibold text-white">Phone</p><p>+92 300 1234567</p></div></div>
                <div className="flex items-start gap-3"><UserRound className="mt-1 h-5 w-5 text-[#D4AF37]" /><div><p className="font-semibold text-white">Email</p><p>info@buttarbuilders.com</p></div></div>
                <div className="flex items-start gap-3"><Hammer className="mt-1 h-5 w-5 text-[#D4AF37]" /><div><p className="font-semibold text-white">WhatsApp</p><p>+92 300 1234567</p></div></div>
              </div>
              <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
                <iframe
                  title="Office location"
                  src="https://www.google.com/maps?q=Gulberg%20III%20Lahore&z=13&output=embed"
                  className="h-56 w-full"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white/80 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                    <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Project Type</label>
                  <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" placeholder="Residential / Commercial / Renovation" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Project Details</label>
                  <textarea rows={5} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 dark:border-slate-700 dark:bg-slate-950" placeholder="Tell us about your vision..." />
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]">
                  Send Inquiry <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/70 px-6 py-10 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">BUTTAR BUILDER&apos;S &amp; DEVELOPER&apos;S</p>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Luxury construction, architecture, renovation, and consultancy with a commitment to excellence.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>About</li>
              <li>Projects</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Services</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Grey Structure</li>
              <li>Turnkey Projects</li>
              <li>Interior Design</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="/dashboard">Admin Login</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Buttar Builders & Developers. All rights reserved.</p>
          <p>Luxury construction • Modern architecture • Trusted delivery</p>
        </div>
      </footer>
    </div>
  )
}
