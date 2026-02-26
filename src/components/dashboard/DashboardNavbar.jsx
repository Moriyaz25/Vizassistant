import { Moon, Sun, User, Bell, Menu, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'

const DashboardNavbar = ({ onMenuClick }) => {
    const { user } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'

    return (
        <header className="h-16 bg-[#0a0a0f]/80 border-b border-white/5 backdrop-blur-2xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5 transition-all"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Mobile logo */}
                <Link to="/" className="md:hidden flex items-center gap-2">
                    <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-violet-500/15 border border-violet-500/20">
                        <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                    </div>
                    <span className="text-base font-black tracking-tighter text-white">
                        Vizassistance
                    </span>
                </Link>

                {/* Desktop breadcrumb */}
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">Workspace</span>
                    <span className="text-white/10">/</span>
                    <span className="text-xs font-bold text-white/40 capitalize">
                        {firstName}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/8 transition-all border border-white/5 text-white/50 hover:text-white"
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5 text-yellow-400" />}
                </button>

                {/* Notifications */}
                <button className="relative p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/8 border border-white/5 text-white/50 hover:text-white transition-all">
                    <Bell className="h-4.5 w-4.5" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-400 rounded-full border border-[#0a0a0f] shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
                </button>

                <div className="h-7 w-px bg-white/5 mx-1" />

                {/* Profile */}
                <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-3 group cursor-pointer"
                >
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors leading-none mb-1">
                            {firstName}
                        </p>
                        <p className="text-[10px] text-white/30 font-medium">Free Plan</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 p-[1.5px] shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-full h-full rounded-[10px] bg-[#0d0a1e] flex items-center justify-center overflow-hidden">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm font-black text-violet-300">
                                    {firstName[0].toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default DashboardNavbar
