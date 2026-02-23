import { motion } from 'framer-motion'
import { Zap, BarChart3, Eraser, Download } from 'lucide-react'

const features = [
    {
        name: 'AI Insight Generation',
        description: 'Advanced AI models analyze your datasets to highlight critical trends and actionable intelligence automatically.',
        icon: Zap,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10'
    },
    {
        name: 'Auto Chart Suggestions',
        description: 'Intelligent detection of data types to recommend the most impactful visualizations for your specific metrics.',
        icon: BarChart3,
        color: 'text-primary',
        bg: 'bg-primary/10'
    },
    {
        name: 'Smart Data Cleaning',
        description: 'Automatically handle missing values, outliers, and formatting inconsistencies before visualization.',
        icon: Eraser,
        color: 'text-green-500',
        bg: 'bg-green-500/10'
    },
    {
        name: 'Export Reports',
        description: 'Seamlessly export your high-resolution charts as PNG or comprehensive analytical summaries as PDF.',
        icon: Download,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
]

const Features = () => {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-base font-semibold text-primary uppercase tracking-wider mb-3"
                    >
                        Features
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-foreground mb-6"
                    >
                        Powerful Tools for Smart Data
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 shadow-xl"
                        >
                            <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">{feature.name}</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>

                            {/* Decorative accent */}
                            <div className="absolute bottom-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 rounded-l-2xl" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features

