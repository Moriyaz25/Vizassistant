import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart2, Sparkles } from 'lucide-react'

const Hero = () => {
    return (
        <div className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24">
            {/* Premium Animated Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[140px]" />
                <motion.div
                    animate={{ x: [-100, 100, -100], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [100, -100, 100], opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-4xl"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-7 backdrop-blur-md"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse shadow-[0_0_8px_#8b5cf6]" />
                            The Future of Analytics
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-7xl font-black tracking-[-0.03em] text-white mb-5 leading-[1.08]">
                            Data Intelligence{' '}
                            <br />
                            <span className="relative">
                                <span className="bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                    Without Limits.
                                </span>
                                {/* Underline glow */}
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-primary/0 via-primary/60 to-cyan-400/0 origin-left"
                                />
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="max-w-xl mx-auto text-base md:text-lg text-white/55 mb-10 leading-relaxed font-medium tracking-wide">
                            Vizassistance cleanses, analyzes, and visualizes complex datasets using advanced AI.{' '}
                            <span className="text-white/80 font-semibold">Transform raw data into competitive advantages.</span>
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                                <Link
                                    to="/signup"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-primary rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] overflow-hidden text-sm"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white transition-all duration-300 glass hover:bg-white/10 rounded-2xl border border-white/10"
                            >
                                Explore Platform
                            </Link>
                        </div>
                    </motion.div>

                    {/* Dashboard Mockup */}
                    <div className="relative w-full max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="glass-card p-2 md:p-3 overflow-hidden group"
                        >
                            <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden border border-white/5">
                                <motion.img
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    src="/images/hero-mockup.png"
                                    alt="Vizassistance Dashboard Preview"
                                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-40" />
                            </div>

                            {/* Floating elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-16 -left-5 md:-left-10 glass p-3 md:p-4 rounded-2xl shadow-2xl hidden md:block border border-white/10"
                            >
                                <BarChart2 className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-28 -right-5 md:-right-10 glass p-3 md:p-4 rounded-2xl shadow-2xl hidden md:block border border-white/10"
                            >
                                <Sparkles className="h-5 w-5 md:h-7 md:w-7 text-cyan-400" />
                            </motion.div>

                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass px-6 py-2.5 rounded-full flex items-center gap-3 border border-white/10 shadow-2xl whitespace-nowrap">
                                <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold tracking-tight text-white/80">AI Model Active: Processing Data</span>
                            </div>
                        </motion.div>

                        <div className="absolute -inset-4 bg-primary/20 blur-[100px] -z-10 opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
