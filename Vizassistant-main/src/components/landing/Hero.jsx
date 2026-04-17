import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, BarChart2, Sparkles, TrendingUp, Zap, Database, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRef, useState, useEffect } from 'react'

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

const StatChip = ({ icon: Icon, label, value, delay, className }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay }}
        className={`absolute hidden md:flex items-center gap-2.5 glass px-4 py-2.5 rounded-2xl border border-[#ACBBC6]/12 shadow-xl backdrop-blur-xl z-20 ${className}`}
    >
        <div className="h-7 w-7 rounded-xl bg-[#667D9D]/18 flex items-center justify-center shrink-0">
            <Icon className="h-3.5 w-3.5 text-[#ACBBC6]" />
        </div>
        <div>
            <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider leading-none mb-0.5">{label}</p>
            <p className="text-sm font-black text-white leading-none">{value}</p>
        </div>
        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#ACBBC6] border border-[#060817]" />
    </motion.div>
)

const BAR_COLORS = ['#16254F', '#667D9D', '#ACBBC6', '#4D6380']

const Hero = () => {
    const { user } = useAuth()
    const cardRef = useRef(null)
    const typed = useTypewriter(WORDS)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const springConfig = { damping: 30, stiffness: 120 }
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig)
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig)

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
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 sm:pt-32 bg-[#060817]">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#060817] via-[#0b1226] to-[#060817]" />

                <motion.div
                    animate={{ x: [-50, 50, -50], y: [-16, 16, -16], opacity: [0.16, 0.28, 0.16] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] bg-[#16254F]/40 rounded-full blur-[130px]"
                />
                <motion.div
                    animate={{ x: [70, -70, 70], y: [24, -24, 24], opacity: [0.08, 0.18, 0.08] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-[-10%] right-[-5%] w-[620px] h-[620px] bg-[#667D9D]/24 rounded-full blur-[125px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.14, 0.08] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[420px] bg-[#ACBBC6]/10 rounded-full blur-[105px]"
                />

                <div className="absolute inset-0 bg-[linear-gradient(rgba(172,187,198,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(172,187,198,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute inset-0 bg-radial-[ellipse_80%_60%_at_50%_50%] from-transparent to-[#060817]/88" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#667D9D]/35 bg-[#16254F]/60 px-5 py-2 text-xs font-bold text-[#ACBBC6] tracking-[0.15em] uppercase mb-8 backdrop-blur-md"
                >
                    <motion.span
                        animate={{ opacity: [1, 0.45, 1] }}
                        transition={{ duration: 1.7, repeat: Infinity }}
                        className="flex h-2 w-2 rounded-full bg-[#ACBBC6]"
                    />
                    AI-Powered Data Intelligence Platform
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="font-black tracking-[-0.04em] text-white mb-6 w-full text-center"
                    style={{ fontSize: 'clamp(2rem, 9vw, 5.125rem)', lineHeight: 1.08 }}
                >
                    <span className="block">From Raw Data to</span>

                    <span className="block relative pb-3" style={{ minHeight: '1.2em' }}>
                        <span
                            className="bg-gradient-to-r from-white via-[#ACBBC6] to-[#667D9D] bg-clip-text text-transparent"
                            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900 }}
                        >
                            {typed}
                        </span>
                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            className="inline-block ml-1 w-[2px] sm:w-[3px] bg-[#ACBBC6] rounded-full align-middle"
                            style={{ height: '0.8em' }}
                        />
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] sm:h-[3px] bg-gradient-to-r from-[#16254F]/0 via-[#667D9D]/80 to-[#ACBBC6]/0 rounded-full pointer-events-none" />
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45 }}
                    className="text-lg md:text-xl text-white/58 mb-10 font-medium tracking-[0.05em] max-w-xl"
                >
                    Upload. <span className="text-white/78">Analyze.</span> Visualize. <span className="text-white/78">Decide.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 sm:mb-20 w-full"
                >
                    {user ? (
                        <>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center justify-center px-8 py-4 text-sm font-black text-[#060817] bg-[#ACBBC6] rounded-2xl shadow-lg shadow-[#060817]/20 transition-colors hover:bg-[#bcc9d1]"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </motion.div>
                            <p className="text-white/42 text-sm font-medium">
                                Welcome back,{' '}
                                <span className="text-[#ACBBC6] font-bold">
                                    {user?.displayName || user?.email?.split('@')[0]}
                                </span>
                                . Ready to analyze more data?
                            </p>
                        </>
                    ) : (
                        <>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center px-8 py-4 text-sm font-black text-[#060817] bg-[#ACBBC6] rounded-2xl shadow-lg shadow-[#060817]/20 transition-colors hover:bg-[#bcc9d1]"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white/72 hover:text-white glass hover:bg-white/[0.04] rounded-2xl border border-[#ACBBC6]/12 transition-colors"
                                >
                                    Login
                                </Link>
                            </motion.div>
                        </>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 70 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-5xl px-2 sm:px-0"
                    style={{ perspective: 1200 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={cardRef}
                >
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-16 bg-[#16254F]/40 blur-[60px] rounded-full" />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[42%] h-8 bg-[#667D9D]/28 blur-[42px] rounded-full" />

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

                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                        className="glass-card p-2 md:p-3 overflow-hidden cursor-default"
                    >
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#ACBBC6]/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0c1330] via-[#16254F] to-[#08101c]" />

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
                                            background: `linear-gradient(to top, ${BAR_COLORS[i % BAR_COLORS.length]}, ${BAR_COLORS[(i + 1) % BAR_COLORS.length]})`,
                                            opacity: 0.82,
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-[#ACBBC6]" />
                                    <span className="text-white/80 text-xs font-bold tracking-wider">AI Dashboard · Live</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#ACBBC6]" />
                                    <span className="text-white/42 text-[10px]">Processing</span>
                                </div>
                            </div>

                            <div className="absolute top-12 left-4 right-4 flex gap-3">
                                {[
                                    { l: 'Revenue', v: '$84.2K', c: 'text-[#ACBBC6]' },
                                    { l: 'Growth', v: '+23.1%', c: 'text-white' },
                                    { l: 'Anomalies', v: '3 found', c: 'text-[#667D9D]' },
                                ].map(({ l, v, c }) => (
                                    <div key={l} className="flex-1 bg-white/[0.05] rounded-xl p-3 border border-white/[0.06]">
                                        <p className="text-white/40 text-[9px] font-semibold uppercase tracking-wider mb-1">{l}</p>
                                        <p className={`text-sm font-black ${c}`}>{v}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="absolute inset-0 pointer-events-none">
                                {[25, 50, 75].map((p) => (
                                    <div key={p} className="absolute left-8 right-8 border-t border-white/[0.06]" style={{ bottom: `${8 + p * 0.3}%` }} />
                                ))}
                            </div>

                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#08101c] to-transparent" />
                        </div>

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-10 -left-5 md:-left-10 glass p-3 rounded-2xl shadow-xl hidden md:flex border border-[#ACBBC6]/10"
                        >
                            <BarChart2 className="h-6 w-6 text-[#ACBBC6]" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            className="absolute bottom-24 -right-5 md:-right-10 glass p-3 rounded-2xl shadow-xl hidden md:flex border border-[#ACBBC6]/10"
                        >
                            <Sparkles className="h-6 w-6 text-[#667D9D]" />
                        </motion.div>

                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 glass px-5 py-2 rounded-full flex items-center gap-2.5 border border-[#ACBBC6]/10 shadow-xl whitespace-nowrap">
                            <div className="h-2 w-2 rounded-full bg-[#ACBBC6] animate-pulse" />
                            <span className="text-xs font-bold tracking-tight text-white/70">AI Model Active · Processing Data</span>
                        </div>
                    </motion.div>
                </motion.div>

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
