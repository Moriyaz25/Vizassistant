import Navbar from '../components/layout/Navbar'
import Hero from '../components/landing/Hero'
import Problem from '../components/landing/Problem'
import Features from '../components/landing/Features'
import Workflow from '../components/landing/Workflow'
import Testimonials from '../components/landing/Testimonials'
import FAQ from '../components/landing/FAQ'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'
import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'

const Landing = () => {
    const { scrollYProgress } = useScroll()
    const [scrollPct, setScrollPct] = useState(0)

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (v) => setScrollPct(v))
        return unsubscribe
    }, [scrollYProgress])

    return (
        <div className="min-h-screen bg-[#0a0a0f] selection:bg-violet-500/30 selection:text-white">
            {/* Scroll progress bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] z-[100] bg-gradient-to-r from-violet-500 via-purple-400 to-cyan-400 origin-left"
                style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
            />

            <Navbar />
            <main>
                <Hero />
                <Problem />
                <Features />
                <Workflow />
                <Testimonials />
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </div>
    )
}

export default Landing
