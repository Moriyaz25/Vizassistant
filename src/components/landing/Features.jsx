import { motion } from 'framer-motion'
import { Zap, BarChart3, Eraser, Download, Sparkles } from 'lucide-react'

const features = [
    {
        name: 'AI Insight Generation',
        description: 'Advanced AI models analyze your datasets to highlight critical trends and actionable intelligence automatically.',
        icon: Zap,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]'
    },
    {
        name: 'Auto Chart Suggestions',
        description: 'Intelligent detection of data types to recommend the most impactful visualizations for your specific metrics.',
        icon: BarChart3,
        color: 'text-primary',
        bg: 'bg-primary/10',
        glow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]'
    },
    {
        name: 'Smart Data Cleaning',
        description: 'Automatically handle missing values, outliers, and formatting inconsistencies before visualization.',
        icon: Eraser,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]'
    },
    {
        name: 'Export Enterprise Reports',
        description: 'Seamlessly export your high-resolution charts as PNG or comprehensive analytical summaries as PDF.',
        icon: Download,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
    },
]

const Features = () => {
    return (
        <section id="features" className="py-20 relative overflow-hidden bg-[#0a0a0f]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-bold text-primary tracking-[0.12em] uppercase mb-4"
                    >
                        <Sparkles className="h-3 w-3" />
                        Next-Gen Features
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black text-white mb-4 tracking-[-0.03em] leading-tight"
                    >
                        Tools Built for{' '}
                        <span className="bg-gradient-to-r from-white/30 via-white/50 to-white/20 bg-clip-text text-transparent">
                            Enterprise Precision.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-white/50 leading-relaxed tracking-wide"
                    >
                        A suite of AI-driven tools designed to eliminate manual overhead and deliver instant clarity.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="glass-card flex flex-col md:flex-row gap-6 items-start p-7 hover:border-primary/30 group"
                        >
                            <div className={`shrink-0 w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center border border-white/5 ${feature.glow} group-hover:scale-110 transition-transform duration-500`}>
                                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                            </div>

                            <div>
                                <h3 className="text-lg font-black text-white mb-2 group-hover:text-primary transition-colors tracking-tight">{feature.name}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
