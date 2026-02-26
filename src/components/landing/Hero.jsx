import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, BarChart2, Sparkles, TrendingUp, Zap, Database, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRef, useState, useEffect } from 'react'

/* ── Typewriter hook ─────────────────────────────────────────────── */
const WORDS = ['Real Intelligence.', 'Deep Insights.', 'Instant Clarity.', 'Smart Decisions.']

function useTypewriter(words, speed = 70, pauseMs = 1800) {
    const [wordIdx, setWordIdx] = useState(0)
    const [displayed, setDisplayed] = useState('')
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const current = words[wordIdx]
        let timeout

        if (!deleting && displayed.length < current.length) {
            timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed)
        } else if (!deleting && displayed.length === current.length) {
            timeout = setTimeout(() => setDeleting(true), pauseMs)
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), speed / 2)
        } else if (deleting && displayed.length === 0) {
            setDeleting(false)
            setWordIdx((i) => (i + 1) % words.length)
        }

        return () => clearTimeout(timeout)
    }, [displayed, deleting, wordIdx, words, speed, pauseMs])

    return displayed
}

/* ── FloatingChip ────────────────────────────────────────────────── */
const StatChip = ({ icon: Icon, label, value, delay, className }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay }}
        className={`absolute hidden md:flex items-center gap-2.5 glass px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl z-20 ${className}`}
    >
        <div className="h-7 w-7 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
            <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider leading-none mb-0.5">{label}</p>
            <p className="text-sm font-black text-white leading-none">{value}</p>
        </div>
        <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-400 border border-[#0a0a0f]"
        />
    </motion.div>
)

/* ── Hero ────────────────────────────────────────────────────────── */
const Hero = () => {
    const { user } = useAuth()
    const cardRef = useRef(null)
    const typed = useTypewriter(WORDS)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const springConfig = { damping: 30, stiffness: 120 }
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig)
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig)

    const handleMouseMove = (e) => {
        const card = cardRef.current
        if (!card) return
        const { left, top, width, height } = card.getBoundingClientRect()
        mouseX.set((e.clientX - left) / width - 0.5)
        mouseY.set((e.clientY - top) / height - 0.5)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    return (
        /* pt-28 ensures content clears the fixed h-20 navbar with breathing room */
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 sm:pt-32">
            {/* Layered animated background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#06030f] via-[#0a0520] to-[#0a0a0f]" />

                <motion.div
                    animate={{ x: [-60, 60, -60], y: [-20, 20, -20], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] bg-violet-700/20 rounded-full blur-[130px]"
                />
                <motion.div
                    animate={{ x: [80, -80, 80], y: [30, -30, 30], opacity: [0.1, 0.22, 0.1] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.16, 0.08] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]"
                />

                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
                {/* Vignette */}
                <div className="absolute inset-0 bg-radial-[ellipse_80%_60%_at_50%_50%] from-transparent to-[#0a0a0f]/80" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-xs font-bold text-violet-300 tracking-[0.15em] uppercase mb-8 backdrop-blur-md"
                >
                    <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]"
                    />
                    AI-Powered Data Intelligence Platform
                </motion.div>

                {/* Headline — Playfair Display italic for the accent word */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-[82px] font-black tracking-[-0.04em] text-white mb-6 leading-[1.05] max-w-5xl"
                >
                    From Raw Data to{' '}
                    <br className="hidden sm:block" />
                    {/* Typewriter with cursive Playfair Display italic */}
                    <span className="relative inline-block min-h-[1.1em]">
                        <span
                            className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent"
                            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900 }}
                        >
                            {typed}
                        </span>
                        {/* blinking cursor */}
                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            className="inline-block ml-1 w-[3px] h-[0.85em] bg-violet-400 rounded-full align-middle"
                        />
                        {/* underline accent */}
                        <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-violet-500/0 via-violet-400 to-cyan-400/0 rounded-full" />
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45 }}
                    className="text-lg md:text-xl text-white/50 mb-10 font-medium tracking-[0.06em] max-w-lg"
                >
                    Upload.{' '}
                    <span className="text-white/75">Analyze.</span>{' '}
                    Visualize.{' '}
                    <span className="text-white/75">Decide.</span>
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 sm:mb-20 w-full"
                >
                    {user ? (
                        <>
                            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                <Link
                                    to="/dashboard"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-black text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.45)] hover:shadow-[0_0_60px_rgba(139,92,246,0.65)] overflow-hidden transition-shadow duration-300"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                            <p className="text-white/40 text-sm font-medium">
                                Welcome back,{' '}
                                <span className="text-violet-300 font-bold">
                                    {user?.displayName || user?.email?.split('@')[0]}
                                </span>
                                . Ready to analyze more data?
                            </p>
                        </>
                    ) : (
                        <>
                            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                <Link
                                    to="/signup"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-black text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.45)] hover:shadow-[0_0_60px_rgba(139,92,246,0.65)] overflow-hidden transition-shadow duration-300"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white/70 hover:text-white glass hover:bg-white/8 rounded-2xl border border-white/10 transition-all duration-300"
                                >
                                    Login
                                </Link>
                            </motion.div>
                        </>
                    )}
                </motion.div>

                {/* 3D Tilt Dashboard Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 70 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.3, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-5xl px-2 sm:px-0"
                    style={{ perspective: 1200 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={cardRef}
                >
                    {/* Glow ring below card */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-16 bg-violet-600/30 blur-[60px] rounded-full" />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[40%] h-8 bg-cyan-400/20 blur-[40px] rounded-full" />

                    {/* Floating stat chips — hidden on mobile, visible md+ */}
                    <StatChip
                        icon={TrendingUp}
                        label="AI Accuracy"
                        value="98.7%"
                        delay={1.1}
                        className="-top-5 left-0 sm:-left-4 lg:-left-12 animate-float"
                    />
                    <StatChip
                        icon={Database}
                        label="Datasets Processed"
                        value="2,400+"
                        delay={1.3}
                        className="-bottom-10 left-0 sm:-left-4 lg:-left-14"
                    />
                    <StatChip
                        icon={Zap}
                        label="Charts Generated"
                        value="847 today"
                        delay={1.5}
                        className="top-1/3 right-0 sm:-right-4 lg:-right-14"
                    />

                    {/* The 3D card */}
                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                        className="glass-card p-2 md:p-3 overflow-hidden group cursor-default"
                    >
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/8">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0720] via-[#0a0a1e] to-[#080d1a]" />

                            {/* Fake chart bars */}
                            <div className="absolute bottom-8 left-8 right-8 flex items-end gap-3 h-32">
                                {[55, 80, 65, 95, 70, 85, 60, 90, 75, 88, 50, 78].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ duration: 0.8, delay: 0.9 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                        className="flex-1 rounded-t-lg origin-bottom"
                                        style={{
                                            height: `${h}%`,
                                            background: i % 3 === 0
                                                ? 'linear-gradient(to top, #7c3aed, #a855f7)'
                                                : i % 3 === 1
                                                    ? 'linear-gradient(to top, #0ea5e9, #22d3ee)'
                                                    : 'linear-gradient(to top, #6d28d9, #8b5cf6)',
                                            opacity: 0.7 + (i % 3) * 0.1
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Top bar – fake UI header */}
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-violet-400" />
                                    <span className="text-white/80 text-xs font-bold tracking-wider">AI Dashboard · Live</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-white/40 text-[10px]">Processing</span>
                                </div>
                            </div>

                            {/* Fake stat row */}
                            <div className="absolute top-12 left-4 right-4 flex gap-3">
                                {[
                                    { l: 'Revenue', v: '$84.2K', c: 'text-cyan-400' },
                                    { l: 'Growth', v: '+23.1%', c: 'text-green-400' },
                                    { l: 'Anomalies', v: '3 found', c: 'text-violet-400' },
                                ].map(({ l, v, c }) => (
                                    <div key={l} className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5">
                                        <p className="text-white/40 text-[9px] font-semibold uppercase tracking-wider mb-1">{l}</p>
                                        <p className={`text-sm font-black ${c}`}>{v}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Grid lines */}
                            <div className="absolute inset-0 pointer-events-none">
                                {[25, 50, 75].map(p => (
                                    <div key={p} className="absolute left-8 right-8 border-t border-white/5" style={{ bottom: `${8 + p * 0.3}%` }} />
                                ))}
                            </div>

                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#080d1a] to-transparent" />
                        </div>

                        {/* Card floating icons */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-10 -left-5 md:-left-10 glass p-3 rounded-2xl shadow-2xl hidden md:flex border border-white/10"
                        >
                            <BarChart2 className="h-6 w-6 text-violet-400" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            className="absolute bottom-24 -right-5 md:-right-10 glass p-3 rounded-2xl shadow-2xl hidden md:flex border border-white/10"
                        >
                            <Sparkles className="h-6 w-6 text-cyan-400" />
                        </motion.div>

                        {/* Status pill */}
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 glass px-5 py-2 rounded-full flex items-center gap-2.5 border border-white/10 shadow-xl whitespace-nowrap">
                            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_#4ade80]" />
                            <span className="text-xs font-bold tracking-tight text-white/70">AI Model Active · Processing Data</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="mt-16 sm:mt-24 flex flex-col items-center gap-2"
                >
                    <span className="text-white/25 text-xs font-semibold tracking-[0.2em] uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ChevronDown className="h-5 w-5 text-white/25" />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Hero
