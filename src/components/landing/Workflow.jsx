import { motion, useScroll, useSpring } from 'framer-motion'
import { Upload, Search, BarChart3, Download, Sparkles } from 'lucide-react'
import { useRef } from 'react'

const steps = [
    {
        title: 'Upload',
        description: 'Drag & drop your CSV or Excel files. Instant parsing with format detection.',
        icon: Upload,
        color: 'text-blue-400',
        iconBg: 'bg-blue-500/10',
        border: 'group-hover:border-blue-500/40',
        glow: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]',
        accent: '#60a5fa',
    },
    {
        title: 'Analyze',
        description: 'Our AI architects trends, corrects anomalies, and identifies hidden patterns for you.',
        icon: Search,
        color: 'text-violet-400',
        iconBg: 'bg-violet-500/10',
        border: 'group-hover:border-violet-500/40',
        glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]',
        accent: '#a78bfa',
    },
    {
        title: 'Visualize',
        description: 'Generate stunning, interactive charts in milliseconds. Auto-suggested for your data.',
        icon: BarChart3,
        color: 'text-purple-400',
        iconBg: 'bg-purple-500/10',
        border: 'group-hover:border-purple-500/40',
        glow: 'group-hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]',
        accent: '#c084fc',
    },
    {
        title: 'Export',
        description: 'Download high-fidelity reports in PNG or PDF formats. Enterprise-ready.',
        icon: Download,
        color: 'text-cyan-400',
        iconBg: 'bg-cyan-500/10',
        border: 'group-hover:border-cyan-500/40',
        glow: 'group-hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]',
        accent: '#22d3ee',
    },
]

const Workflow = () => {
    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    })
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

    return (
        <section id="workflow" ref={sectionRef} className="py-16 sm:py-24 relative overflow-hidden bg-[#0a0a0f]">
            <div className="absolute bottom-0 right-0 w-[700px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-300 tracking-[0.12em] uppercase mb-5"
                    >
                        <Sparkles className="h-3 w-3" />
                        Seamless Experience
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-white mb-4 tracking-[-0.03em] leading-tight"
                    >
                        How It{' '}
                        <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                            Works.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-white/50 leading-relaxed"
                    >
                        From raw data to actionable intelligence in four simple, automated steps.
                    </motion.p>
                </div>

                {/* Timeline steps */}
                <div className="relative">
                    {/* Animated connector line */}
                    <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+40px)] right-[calc(12.5%+40px)] h-[2px] bg-white/5 overflow-hidden">
                        <motion.div
                            style={{ scaleX, transformOrigin: 'left' }}
                            className="absolute inset-0 bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.12 }}
                                className={`relative flex flex-col items-center text-center group`}
                            >
                                {/* Step number dot on timeline */}
                                <div className="relative z-10 mb-7">
                                    <motion.div
                                        whileHover={{ scale: 1.12 }}
                                        className={`w-[88px] h-[88px] ${step.iconBg} rounded-[1.75rem] flex items-center justify-center border border-white/5 shadow-2xl ${step.border} ${step.glow} transition-all duration-500`}
                                    >
                                        <step.icon className={`w-9 h-9 ${step.color}`} />

                                        {/* Number badge */}
                                        <div
                                            className="absolute -top-3 -right-3 w-8 h-8 glass rounded-xl flex items-center justify-center text-white font-black text-xs border border-white/10 shadow-lg group-hover:border-violet-500/50 group-hover:text-violet-300 transition-all duration-500"
                                            style={{ boxShadow: `0 0 0 0 ${step.accent}00` }}
                                        >
                                            {index + 1}
                                        </div>
                                    </motion.div>
                                </div>

                                <h3 className={`text-xl font-black text-white mb-2.5 tracking-tight group-hover:${step.color} transition-colors`}>
                                    {step.title}
                                </h3>
                                <p className="text-white/40 text-sm leading-relaxed px-2">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Workflow
