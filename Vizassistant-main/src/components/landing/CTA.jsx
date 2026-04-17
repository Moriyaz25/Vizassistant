import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const CTA = () => {
    const { user } = useAuth()

    return (
        <section className="py-16 sm:py-28 relative overflow-hidden bg-[#081020]">
            <div className="absolute inset-0 bg-[#081020]" />
            <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.24, 0.12] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#16254F]/28 rounded-full blur-[120px] pointer-events-none"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#667D9D]/16 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-3xl overflow-hidden"
                >
                    <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-[#16254F]/60 via-[#667D9D]/40 to-[#ACBBC6]/45" />

                    <div className="relative bg-gradient-to-br from-[#0c1330]/95 via-[#16254F]/90 to-[#0a1220]/95 rounded-3xl p-8 sm:p-12 md:p-16 text-center backdrop-blur-xl border border-white/[0.06]">
                        <div className="relative z-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 rounded-full border border-[#667D9D]/35 bg-[#16254F]/55 px-4 py-1.5 text-xs font-bold text-[#ACBBC6] tracking-[0.15em] uppercase mb-6"
                            >
                                <Sparkles className="h-3 w-3" />
                                {user ? 'Your workspace awaits' : 'Ready when you are'}
                            </motion.div>

                            {user ? (
                                <>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white mb-4 leading-tight">
                                        Continue Your{' '}
                                        <span className="bg-gradient-to-r from-white via-[#ACBBC6] to-[#667D9D] bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                                            Analysis.
                                        </span>
                                    </h2>
                                    <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                                        Welcome back,{' '}
                                        <span className="text-[#ACBBC6] font-bold">
                                            {user?.displayName || user?.email?.split('@')[0]}
                                        </span>
                                        . Your datasets are ready and waiting.
                                    </p>
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Link
                                            to="/dashboard"
                                            className="inline-flex items-center gap-2 bg-[#ACBBC6] text-[#060817] font-black py-4 px-10 rounded-2xl shadow-lg shadow-[#060817]/18 transition-colors hover:bg-[#bcc9d1]"
                                        >
                                            Go to Dashboard
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white mb-4 leading-tight">
                                        Start Presenting{' '}
                                        <br />
                                        <span className="bg-gradient-to-r from-white via-[#ACBBC6] to-[#667D9D] bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                                            Your Data Better.
                                        </span>
                                    </h2>
                                    <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                                        Build a cleaner dashboard, faster insights, and a more professional final submission.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Link
                                                to="/signup"
                                                className="inline-flex items-center gap-2 bg-[#ACBBC6] text-[#060817] font-black py-4 px-10 rounded-2xl shadow-lg shadow-[#060817]/18 transition-colors hover:bg-[#bcc9d1]"
                                            >
                                                Get Started Free
                                                <ArrowRight className="h-5 w-5" />
                                            </Link>
                                        </motion.div>
                                        <Link
                                            to="/login"
                                            className="text-white/56 hover:text-white text-sm font-bold transition-colors"
                                        >
                                            Already have an account? Login →
                                        </Link>
                                    </div>
                                    <p className="mt-6 text-white/25 text-xs font-medium">
                                        Free tier available · Simple workflow · Clean presentation-ready output
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="absolute top-0 left-0 w-40 h-40 bg-[#16254F]/22 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#667D9D]/16 rounded-full blur-3xl pointer-events-none" />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default CTA
