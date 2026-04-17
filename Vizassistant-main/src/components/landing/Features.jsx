import { motion } from 'framer-motion'
import { Zap, BarChart3, Eraser, Download, Sparkles } from 'lucide-react'

const features = [
    {
        name: 'AI Insight Generation',
        description: 'Advanced models scan your dataset in seconds and surface the trends, outliers, and summaries that matter most.',
        icon: Zap,
        color: 'text-[#ACBBC6]',
        iconBg: 'bg-[#16254F]/55',
        accent: 'from-[#16254F]/60 to-transparent',
        border: 'hover:border-[#667D9D]/28',
        num: '01',
        large: true,
    },
    {
        name: 'Auto Chart Suggestions',
        description: 'Recommended chart types help you move from raw values to a polished visual much faster.',
        icon: BarChart3,
        color: 'text-white',
        iconBg: 'bg-[#667D9D]/18',
        accent: 'from-[#667D9D]/35 to-transparent',
        border: 'hover:border-[#ACBBC6]/22',
        num: '02',
        large: false,
    },
    {
        name: 'Smart Data Cleaning',
        description: 'Identify missing values, inconsistent formats, and outliers before they affect your analysis.',
        icon: Eraser,
        color: 'text-[#ACBBC6]',
        iconBg: 'bg-[#667D9D]/14',
        accent: 'from-[#ACBBC6]/22 to-transparent',
        border: 'hover:border-[#667D9D]/24',
        num: '03',
        large: false,
    },
    {
        name: 'Professional Exports',
        description: 'Export polished visuals and analytical summaries that feel presentation-ready for reviews and submissions.',
        icon: Download,
        color: 'text-white',
        iconBg: 'bg-[#16254F]/52',
        accent: 'from-[#667D9D]/28 to-transparent',
        border: 'hover:border-[#ACBBC6]/22',
        num: '04',
        large: true,
    },
]

const Features = () => {
    return (
        <section id="features" className="py-16 sm:py-24 relative overflow-hidden bg-[#060817]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#16254F]/26 rounded-full blur-[130px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full border border-[#667D9D]/35 bg-[#16254F]/55 px-4 py-1.5 text-xs font-bold text-[#ACBBC6] tracking-[0.12em] uppercase mb-5"
                    >
                        <Sparkles className="h-3 w-3" />
                        Core Features
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-white mb-4 tracking-[-0.03em] leading-tight"
                    >
                        Tools Built for{' '}
                        <span className="bg-gradient-to-r from-white via-[#ACBBC6] to-[#667D9D] bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                            Clear Decisions.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-white/52 leading-relaxed"
                    >
                        A simple suite of AI-assisted tools designed to make your college project feel more polished and professional.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.12 }}
                            className={`relative group glass-card overflow-hidden ${feature.border} transition-colors duration-300 ${feature.large ? 'lg:col-span-2' : ''}`}
                        >
                            <div className="absolute top-5 right-5 text-[40px] font-black text-white/[0.05] leading-none select-none">
                                {feature.num}
                            </div>

                            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${feature.accent}`} />

                            <div className="relative z-10 p-7">
                                <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 border border-white/[0.06]`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                </div>

                                <h3 className="text-xl font-black text-white mb-3 tracking-tight">
                                    {feature.name}
                                </h3>
                                <p className="text-white/48 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${feature.accent} opacity-35 pointer-events-none`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
