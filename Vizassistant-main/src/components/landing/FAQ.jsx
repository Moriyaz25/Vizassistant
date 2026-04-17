import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle } from 'lucide-react'

const faqs = [
    {
        question: 'Is my data secure?',
        answer: 'Yes. Uploaded files are isolated and handled with secure storage practices. The assistant is meant for analysis support, not casual data sharing.',
    },
    {
        question: 'Which file formats do you support?',
        answer: 'The project currently supports CSV and Excel (.xlsx) files, making it practical for most classroom datasets.',
    },
    {
        question: 'How accurate are the AI insights?',
        answer: 'They are designed to support interpretation and save time, but final academic conclusions should still be reviewed by you.',
    },
    {
        question: 'Can I export reports for presentations?',
        answer: 'Yes. Charts and summaries can be exported so your outputs feel more presentation-ready for reviews and demos.',
    },
]

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border-b border-white/[0.06] last:border-0 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors group px-4 rounded-xl"
            >
                <span className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">{question}</span>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus className="h-5 w-5 text-[#ACBBC6]" /> : <Plus className="h-5 w-5 text-white/30" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="pb-6 px-4 text-white/48 leading-relaxed max-w-2xl">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const FAQ = () => {
    return (
        <section className="py-24 bg-[#081020] relative">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16254F]/55 border border-[#667D9D]/25 text-[#ACBBC6] text-xs font-black uppercase tracking-widest mb-4"
                    >
                        <HelpCircle className="h-3 w-3" />
                        Support
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-black text-white"
                    >
                        Frequently Asked <span className="text-[#ACBBC6]">Questions</span>
                    </motion.h2>
                </div>

                <div className="glass-card border border-white/[0.06] rounded-3xl p-4">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FAQ
