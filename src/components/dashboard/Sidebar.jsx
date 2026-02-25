import { Home, LayoutDashboard, Upload, BarChart3, History, User, LogOut, ChevronRight, Moon, Sun, GitMerge } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/cn'

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation()
    const { signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const links = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Upload Data', href: '/dashboard/upload', icon: Upload },
        { name: 'Data Modeler', href: '/dashboard/modeler', icon: GitMerge },
        { name: 'Insights', href: '/dashboard/insights', icon: BarChart3 },
        { name: 'History', href: '/dashboard/history', icon: History },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
    ]

    return (
        <aside className={cn(
            "fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-card border-r border-border transition-transform duration-300 md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="h-16 flex items-center px-6 border-b border-border justify-between">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-primary/5 group-hover:scale-110 transition-transform">
                        <img src="/logo.png" alt="Vizassistance Logo" className="h-full w-full object-contain p-1" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                        Vizassistance
                    </span>
                </Link>
                <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden p-2 -mr-2 text-zinc-500 hover:text-foreground"
                >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
            </div>


            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
                    Menu
                </p>
                {links.map((link) => {
                    const isActive = location.pathname === link.href
                    return (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={cn(
                                "group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "text-zinc-500 hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <link.icon className={cn("h-5 w-5", isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
                                <span>{link.name}</span>
                            </div>
                            {isActive && (
                                <motion.div layoutId="active" className="lg:block hidden">
                                    <ChevronRight className="h-4 w-4" />
                                </motion.div>
                            )}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-border space-y-2">
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-primary" />}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </div>
                </button>
                <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors group"
                >
                    <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar

