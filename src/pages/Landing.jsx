import Navbar from '../components/layout/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import Workflow from '../components/landing/Workflow'
import Pricing from '../components/landing/Pricing'
import Footer from '../components/landing/Footer'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Landing = () => {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-[#0a0a0f] selection:bg-primary/30 selection:text-white">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Workflow />
                <Pricing />
            </main>
            <Footer />
        </div>
    )
}

export default Landing

