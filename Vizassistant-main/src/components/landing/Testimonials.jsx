import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Product Analyst @ TechFlow',
        content: 'Vizassistant transformed our monthly reporting. What used to take hours now feels structured and manageable.',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        rating: 5,
    },
    {
        name: 'Marcus Thorne',
        role: 'Marketing Director',
        content: 'The charts are clean, and the AI guidance helps us move from spreadsheets to presentations much faster.',
        avatar: 'https://i.pravatar.cc/150?u=marcus',
        rating: 5,
    },
    {
        name: 'Elena Rodriguez',
        role: 'Financial Consultant',
        content: 'It gives me professional-looking summaries without making the interface feel overloaded or complicated.',
        avatar: 'https://i.pravatar.cc/150?u=elena',
        rating: 5,
    },
]

const Testimonials = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-[#060817]">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16254F]/55 border border-[#667D9D]/25 text-[#ACBBC6] text-xs font-black uppercase tracking-widest mb-4"
                    >
                        <Star className="h-3 w-3 fill-[#ACBBC6]" />
                        Feedback
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white mb-4"
                    >
                        Designed for modern <br />
                        <span className="bg-gradient-to-r from-white via-[#ACBBC6] to-[#667D9D] bg-clip-text text-transparent">data projects.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 relative border border-white/[0.06] transition-colors duration-300 hover:border-[#667D9D]/22"
                        >
                            <Quote className="absolute top-6 right-8 h-12 w-12 text-white/[0.06]" />
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, idx) => (
                                    <Star key={idx} className="h-4 w-4 fill-[#ACBBC6] text-[#ACBBC6]" />
                                ))}
                            </div>
                            <p className="text-white/72 italic mb-8 leading-loose relative z-10">
                                "{t.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border border-white/[0.08]" />
                                <div>
                                    <h4 className="text-white font-bold">{t.name}</h4>
                                    <p className="text-white/40 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#16254F]/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#667D9D]/10 blur-[120px] rounded-full pointer-events-none" />
        </section>
    )
}

export default Testimonials
