import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard, LogOut, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../ui/ThemeToggle'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const navLinks = [
        { name: 'Features', href: '/#features' },
        { name: 'How it works', href: '/#workflow' },
    ]

    const handleLogout = async () => {
        try {
            await signOut()
            navigate('/')
        } catch (error) {
            console.error('Error logging out:', error.message)
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060817]/78 backdrop-blur-2xl border-b border-[#ACBBC6]/8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Premium Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-primary/12 border border-primary/25 transition-colors duration-300 group-hover:bg-primary/18">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white transition-colors duration-300 group-hover:text-[#ACBBC6]">
                            Vizassistance
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-10">
                        {!user && navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="relative text-white/58 hover:text-white transition-colors text-sm font-bold tracking-tight group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#ACBBC6] group-hover:w-full transition-all duration-300" />
                            </a>
                        ))}

                        <div className="flex items-center space-x-4">
                            {/* Theme Toggle */}
                            <ThemeToggle size="sm" />

                            {user ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="inline-flex items-center gap-2 text-white/70 hover:text-[#ACBBC6] transition-colors text-sm font-bold"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="inline-flex items-center gap-2 glass text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-[#ACBBC6]/10 hover:border-[#ACBBC6]/20 hover:bg-white/[0.04] active:scale-95"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-white/70 hover:text-white transition-colors text-sm font-bold"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-[#667D9D] hover:bg-[#7389a7] text-[#060817] px-7 py-3 rounded-xl text-sm font-black transition-colors shadow-lg shadow-[#060817]/20 active:scale-95"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3">
                        <ThemeToggle size="sm" />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white p-2.5 rounded-xl hover:bg-white/[0.04] border border-[#ACBBC6]/8 transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden bg-[#060817] border-b border-[#ACBBC6]/8 overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-3">
                            {!user && navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block px-4 py-3 rounded-xl text-lg font-bold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-6 space-y-4">
                                {user ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className="block w-full text-center px-4 py-4 border border-[#ACBBC6]/12 rounded-xl text-white font-bold hover:bg-white/[0.04]"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout()
                                                setIsOpen(false)
                                            }}
                                            className="block w-full text-center px-4 py-4 glass text-white rounded-xl font-bold border border-[#ACBBC6]/10"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block w-full text-center px-4 py-4 border border-[#ACBBC6]/12 rounded-xl text-white font-bold hover:bg-white/[0.04] transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="block w-full text-center px-4 py-4 bg-[#667D9D] text-[#060817] rounded-xl font-bold shadow-lg shadow-[#060817]/20"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
