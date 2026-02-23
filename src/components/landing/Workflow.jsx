import { motion } from 'framer-motion'
import { Upload, Search, BarChart3, Download, ChevronRight } from 'lucide-react'

const steps = [
    {
        title: 'Upload',
        description: 'Drag & drop your CSV or Excel files.',
        icon: Upload,
        color: 'bg-blue-500'
    },
    {
        title: 'Analyze',
        description: 'AI automatically detects trends & patterns.',
        icon: Search,
        color: 'bg-purple-500'
    },
    {
        title: 'Visualize',
        description: 'Generate stunning charts instantly.',
        icon: BarChart3,
        color: 'bg-primary'
    },
    {
        title: 'Download',
        description: 'Export your reports as PNG or PDF.',
        icon: Download,
        color: 'bg-green-500'
    }
]

const Workflow = () => {
    return (
        <section id="workflow" className="py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-base font-semibold text-primary uppercase tracking-wider mb-3"
                    >
                        Process
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-foreground mb-6"
                    >
                        How Vizassistance Works
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-primary to-green-500 opacity-20 -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative flex flex-col items-center text-center group"
                            >
                                <div className={`relative z-10 w-20 h-20 ${step.color} rounded-full flex items-center justify-center text-white shadow-2xl mb-8 group-hover:scale-110 transition-transform duration-300`}>
                                    <step.icon className="w-10 h-10" />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-card rounded-full flex items-center justify-center text-foreground font-bold text-sm border border-border">
                                        {index + 1}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                                <p className="text-muted-foreground text-lg">{step.description}</p>

                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-[40px] -right-[15%] text-muted-foreground/30">
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
