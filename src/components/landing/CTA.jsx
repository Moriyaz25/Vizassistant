import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const CTA = () => {
    const { user } = useAuth()

    return (
        <section className="py-16 sm:py-28 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[#0a0a0f]" />
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-3xl overflow-hidden"
                >
                    {/* Animated shimmer border */}
                    <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-violet-500/40 via-cyan-400/30 to-violet-500/40 animate-[shimmer_3s_linear_infinite] bg-[length:200%_100%]" />

                    <div className="relative bg-gradient-to-br from-[#0d0720]/95 via-[#0a0a1e]/95 to-[#060d1a]/95 rounded-3xl p-8 sm:p-12 md:p-16 text-center backdrop-blur-xl border border-white/5">
                        {/* Noise texture layer */}
                        <div className="absolute inset-0 rounded-3xl opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]" />

                        <div className="relative z-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-300 tracking-[0.15em] uppercase mb-6"
                            >
                                <Sparkles className="h-3 w-3" />
                                {user ? 'Your workspace awaits' : 'Get started today'}
                            </motion.div>

                            {user ? (
                                <>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white mb-4 leading-tight">
                                        Continue Your{' '}
                                        <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                                            Analysis.
                                        </span>
                                    </h2>
                                    <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                                        Welcome back,{' '}
                                        <span className="text-violet-300 font-bold">
                                            {user?.displayName || user?.email?.split('@')[0]}
                                        </span>
                                        . Your datasets are ready and waiting.
                                    </p>
                                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                        <Link
                                            to="/dashboard"
                                            className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black py-4 px-10 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.5)] hover:shadow-[0_0_60px_rgba(139,92,246,0.7)] transition-shadow duration-300 overflow-hidden relative"
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                            Go to Dashboard
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white mb-4 leading-tight">
                                        Start Transforming{' '}
                                        <br />
                                        <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                                            Your Data.
                                        </span>
                                    </h2>
                                    <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                                        Join thousands of data teams who turned raw spreadsheets into{' '}
                                        <span className="text-white/80 font-semibold">strategic intelligence.</span>
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                            <Link
                                                to="/signup"
                                                className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black py-4 px-10 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.5)] hover:shadow-[0_0_60px_rgba(139,92,246,0.7)] transition-shadow duration-300 overflow-hidden relative"
                                            >
                                                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                Get Started Free
                                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </motion.div>
                                        <Link
                                            to="/login"
                                            className="text-white/50 hover:text-white text-sm font-bold transition-colors"
                                        >
                                            Already have an account? Login →
                                        </Link>
                                    </div>
                                    <p className="mt-6 text-white/25 text-xs font-medium">
                                        No credit card required · Free tier available · Cancel anytime
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Corner orbs */}
                        <div className="absolute top-0 left-0 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default CTA
