import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, BarChart3, LayoutDashboard, LogOut, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const navLinks = [
        { name: 'Features', href: '/#features' },
        { name: 'How it works', href: '/#workflow' },
        { name: 'Pricing', href: '/#pricing' },
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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-primary/5 group-hover:scale-110 transition-transform">
                            <img src="/logo.png" alt="Vizassistance Logo" className="h-full w-full object-contain p-1" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                            Vizassistance
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {!user && navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="inline-flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-full text-sm font-medium transition-all"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-foreground hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-primary/20"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-foreground p-2 rounded-md hover:bg-muted"
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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-border overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {!user && navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-4 space-y-2">
                                {user ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className="block w-full text-center px-4 py-2 border border-input rounded-md text-foreground hover:bg-muted"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout()
                                                setIsOpen(false)
                                            }}
                                            className="block w-full text-center px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block w-full text-center px-4 py-2 border border-input rounded-md text-foreground hover:bg-muted transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
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
