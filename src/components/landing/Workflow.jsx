import { motion } from 'framer-motion'
import { Upload, Search, BarChart3, Download, ChevronRight, Sparkles } from 'lucide-react'

const steps = [
    {
        title: 'Upload',
        description: 'Drag & drop your CSV or Excel files with ease.',
        icon: Upload,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]'
    },
    {
        title: 'Analyze',
        description: 'Our AI automatically architects trends & patterns for you.',
        icon: Search,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]'
    },
    {
        title: 'Visualize',
        description: 'Generate stunning, interactive charts in milliseconds.',
        icon: BarChart3,
        color: 'text-primary',
        bg: 'bg-primary/10',
        glow: 'shadow-[0_0_20px_rgba(139,92,246,0.2)]'
    },
    {
        title: 'Export',
        description: 'Download high-fidelity reports in PNG or PDF formats.',
        icon: Download,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]'
    }
]

const Workflow = () => {
    return (
        <section id="workflow" className="py-20 relative overflow-hidden bg-[#0a0a0f]">
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

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
                        Seamless Experience
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black text-white mb-4 tracking-[-0.03em] leading-tight"
                    >
                        How It{' '}
                        <span className="bg-gradient-to-r from-white/30 via-white/50 to-white/20 bg-clip-text text-transparent">
                            Works.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-white/50 leading-relaxed tracking-wide"
                    >
                        From raw data to actionable intelligence in four simple, automated steps.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-[44px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative flex flex-col items-center text-center group"
                            >
                                <div className={`relative z-10 w-20 h-20 ${step.bg} rounded-[1.5rem] flex items-center justify-center border border-white/5 shadow-2xl mb-7 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500 ${step.glow}`}>
                                    <step.icon className={`w-9 h-9 ${step.color}`} />

                                    <div className="absolute -top-2.5 -right-2.5 w-8 h-8 glass rounded-xl flex items-center justify-center text-white font-black text-xs border border-white/10 shadow-lg group-hover:bg-primary group-hover:border-primary transition-colors duration-500">
                                        {index + 1}
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-white mb-2 group-hover:text-primary transition-colors tracking-tight">{step.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed px-2">{step.description}</p>

                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-[44px] -right-[10%] text-white/5 group-hover:text-primary/20 transition-colors duration-500">
                                        <ChevronRight className="w-8 h-8" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Workflow
