import { motion, useScroll, useSpring } from 'framer-motion'
import { Upload, Search, BarChart3, Download, Sparkles } from 'lucide-react'
import { useRef } from 'react'

const steps = [
    {
        title: 'Upload',
        description: 'Drop in your CSV or Excel file and let the parser structure it immediately.',
        icon: Upload,
        color: 'text-white',
        iconBg: 'bg-[#16254F]/55',
    },
    {
        title: 'Analyze',
        description: 'The assistant reviews the dataset and highlights trends, gaps, and unusual values.',
        icon: Search,
        color: 'text-[#ACBBC6]',
        iconBg: 'bg-[#667D9D]/18',
    },
    {
        title: 'Visualize',
        description: 'Generate charts that fit the data instead of manually testing every possible view.',
        icon: BarChart3,
        color: 'text-white',
        iconBg: 'bg-[#667D9D]/18',
    },
    {
        title: 'Export',
        description: 'Present your final visuals and summaries in a format ready for class review.',
        icon: Download,
        color: 'text-[#ACBBC6]',
        iconBg: 'bg-[#16254F]/55',
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
        <section id="workflow" ref={sectionRef} className="py-16 sm:py-24 relative overflow-hidden bg-[#081020]">
            <div className="absolute bottom-0 right-0 w-[700px] h-[400px] bg-[#16254F]/22 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full border border-[#667D9D]/35 bg-[#16254F]/55 px-4 py-1.5 text-xs font-bold text-[#ACBBC6] tracking-[0.12em] uppercase mb-5"
                    >
                        <Sparkles className="h-3 w-3" />
                        Simple Workflow
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-white mb-4 tracking-[-0.03em] leading-tight"
                    >
                        How It{' '}
                        <span className="bg-gradient-to-r from-white via-[#ACBBC6] to-[#667D9D] bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                            Works.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-white/52 leading-relaxed"
                    >
                        A clean four-step flow that keeps the experience straightforward from upload to final output.
                    </motion.p>
                </div>

                <div className="relative">
                    <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+40px)] right-[calc(12.5%+40px)] h-[2px] bg-white/[0.06] overflow-hidden">
                        <motion.div
                            style={{ scaleX, transformOrigin: 'left' }}
                            className="absolute inset-0 bg-gradient-to-r from-[#16254F] via-[#667D9D] to-[#ACBBC6]"
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
                                className="relative flex flex-col items-center text-center group"
                            >
                                <div className="relative z-10 mb-7">
                                    <motion.div
                                        whileHover={{ scale: 1.04 }}
                                        className={`w-[88px] h-[88px] ${step.iconBg} rounded-[1.75rem] flex items-center justify-center border border-white/[0.06] shadow-xl transition-transform duration-300`}
                                    >
                                        <step.icon className={`w-9 h-9 ${step.color}`} />
                                        <div className="absolute -top-3 -right-3 w-8 h-8 glass rounded-xl flex items-center justify-center text-white font-black text-xs border border-[#ACBBC6]/10 shadow-lg">
                                            {index + 1}
                                        </div>
                                    </motion.div>
                                </div>

                                <h3 className="text-xl font-black text-white mb-2.5 tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-white/42 text-sm leading-relaxed px-2">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Workflow
