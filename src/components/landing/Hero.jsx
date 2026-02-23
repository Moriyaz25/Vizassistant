import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart2, PieChart, LineChart, Activity, Sparkles } from 'lucide-react'

const Hero = () => {
    return (
        <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                        Vizassistance AI Intelligence
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8">
                        Turn Raw Data into <br />
                        <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                            Smart Insights Instantly
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
                        Harness the power of AI to clean, analyze, and visualize your complex datasets in seconds. Get actionable insights without the manual grunt work.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/signup"
                                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-primary rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-foreground transition-all duration-200 bg-transparent border border-border rounded-full hover:bg-muted/50"
                        >
                            Explore Demo
                        </Link>
                    </div>
                </motion.div>

                {/* Floating Chart Animations */}
                <div className="relative mt-20 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="relative rounded-3xl border border-white/10 bg-card/50 backdrop-blur-xl p-4 shadow-2xl overflow-hidden"
                    >
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                                src="/images/hero-mockup.png"
                                alt="Vizassistance Dashboard Preview"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                        </div>

                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 -left-10 bg-card/80 backdrop-blur-lg border border-border p-4 rounded-2xl shadow-xl hidden lg:block"
                        >
                            <BarChart2 className="h-8 w-8 text-primary" />
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-20 -right-12 bg-card/80 backdrop-blur-lg border border-border p-4 rounded-2xl shadow-xl hidden lg:block"
                        >
                            <PieChart className="h-8 w-8 text-blue-500" />
                        </motion.div>

                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute top-1/4 -right-8 bg-card/80 backdrop-blur-lg border border-border p-4 rounded-2xl shadow-xl hidden lg:block"
                        >
                            <LineChart className="h-8 w-8 text-cyan-500" />
                        </motion.div>

                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-8 left-1/4 bg-card/80 backdrop-blur-lg border border-border px-6 py-3 rounded-full shadow-xl hidden lg:block"
                        >
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-green-500" />
                                <span className="text-xs font-bold text-foreground">Real-time Analysis</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Hero

