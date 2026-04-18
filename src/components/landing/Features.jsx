import { motion } from 'framer-motion'
import { Zap, BarChart3, Eraser, Download, Sparkles } from 'lucide-react'

const features = [
    {
        name: 'AI Insight Generation',
        description: 'Advanced AI models scan your entire dataset in seconds, surfacing critical trends, outliers, and actionable intelligence automatically.',
        icon: Zap,
        color: 'text-violet-400',
        iconBg: 'bg-violet-500/10',
        accent: 'from-violet-500/20 to-violet-500/0',
        border: 'hover:border-violet-500/40',
        glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]',
        num: '01',
        large: true,
    },
    {
        name: 'Auto Chart Suggestions',
        description: 'Intelligent detection recommends the perfect chart type for your data structure.',
        icon: BarChart3,
        color: 'text-cyan-400',
        iconBg: 'bg-cyan-500/10',
        accent: 'from-cyan-500/20 to-cyan-500/0',
        border: 'hover:border-cyan-500/40',
        glow: 'group-hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]',
        num: '02',
        large: false,
    },
    {
        name: 'Smart Data Cleaning',
        description: 'Automatically handle missing values, outliers, and formatting inconsistencies before visualization.',
        icon: Eraser,
        color: 'text-purple-400',
        iconBg: 'bg-purple-500/10',
        accent: 'from-purple-500/20 to-purple-500/0',
        border: 'hover:border-purple-500/40',
        glow: 'group-hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]',
        num: '03',
        large: false,
    },
    {
        name: 'Enterprise Report Export',
        description: 'Seamlessly export high-resolution charts as PNG or comprehensive analytical summaries as PDF. Enterprise-grade output, instantly.',
        icon: Download,
        color: 'text-blue-400',
        iconBg: 'bg-blue-500/10',
        accent: 'from-blue-500/20 to-blue-500/0',
        border: 'hover:border-blue-500/40',
        glow: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]',
        num: '04',
        large: true,
    },
]

const Features = () => {
    return (
        <section id="features" className="py-16 sm:py-24 relative overflow-hidden bg-[#0a0a0f]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-violet-600/5 rounded-full blur-[130px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-300 tracking-[0.12em] uppercase mb-5"
                    >
                        <Sparkles className="h-3 w-3" />
                        Next-Gen Features
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-white mb-4 tracking-[-0.03em] leading-tight"
                    >
                        Tools Built for{' '}
                        <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                            Enterprise Precision.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-white/50 leading-relaxed"
                    >
                        A suite of AI-driven tools designed to eliminate manual overhead and deliver instant clarity.
                    </motion.p>
                </div>

                {/* Bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.12 }}
                            className={`relative group glass-card overflow-hidden ${feature.border} transition-all duration-500 ${feature.glow} ${feature.large ? 'lg:col-span-2' : ''
                                }`}
                        >
                            {/* Number badge */}
                            <div className="absolute top-5 right-5 text-[40px] font-black text-white/[0.04] leading-none select-none group-hover:text-white/[0.07] transition-colors duration-500">
                                {feature.num}
                            </div>

                            {/* Top accent line */}
                            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${feature.accent}`} />

                            <div className="relative z-10 p-7">
                                {/* Icon */}
                                <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                </div>

                                <h3 className={`text-xl font-black text-white mb-3 tracking-tight group-hover:${feature.color} transition-colors duration-300`}>
                                    {feature.name}
                                </h3>
                                <p className="text-white/45 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Bottom gradient */}
                            <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${feature.accent} opacity-40 pointer-events-none`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
