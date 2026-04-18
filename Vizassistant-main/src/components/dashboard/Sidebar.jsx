import { useState } from 'react'
import { Home, LayoutDashboard, Upload, BarChart3, History, User, LogOut, ChevronRight, GitMerge, Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'
import ThemeToggle from '../ui/ThemeToggle'

// ── Logout Modal (inline, no separate file needed) ─────────────────────────
const LogoutModal = ({ onConfirm, onCancel, loading }) => (
    <>
        {/* Backdrop */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && onCancel()}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="pointer-events-auto w-full max-w-sm bg-[#0d1225] border border-white/[0.08] rounded-[2rem] p-8 shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                        <LogOut className="h-6 w-6 text-red-400" />
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="p-2 rounded-xl hover:bg-white/[0.05] transition-colors disabled:opacity-40"
                    >
                        <X className="h-5 w-5 text-zinc-400" />
                    </button>
                </div>

                {/* Text */}
                <h3 className="text-xl font-black text-white mb-2">Sign out?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    You will be signed out of your account. Your data will be safely saved and waiting when you return.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-3 rounded-2xl border border-white/[0.08] text-zinc-300 font-bold text-sm hover:bg-white/[0.04] transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <><LogOut className="h-4 w-4" /> Sign Out</>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    </>
)

// ── Sidebar ────────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { signOut, user } = useAuth()

    const [showLogout, setShowLogout] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)

    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            await signOut()
            navigate('/login')
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            setLoggingOut(false)
            setShowLogout(false)
        }
    }

    const links = [
        { name: 'Home',        href: '/',                   icon: Home },
        { name: 'Dashboard',   href: '/dashboard',          icon: LayoutDashboard },
        { name: 'Upload Data', href: '/dashboard/upload',   icon: Upload },
        { name: 'Data Modeler',href: '/dashboard/modeler',  icon: GitMerge },
        { name: 'Insights',    href: '/dashboard/insights', icon: BarChart3 },
        { name: 'History',     href: '/dashboard/history',  icon: History },
        { name: 'Profile',     href: '/dashboard/profile',  icon: User },
    ]

    return (
        <>
            {/* ── Logout Modal ── */}
            <AnimatePresence>
                {showLogout && (
                    <LogoutModal
                        onConfirm={handleLogout}
                        onCancel={() => setShowLogout(false)}
                        loading={loggingOut}
                    />
                )}
            </AnimatePresence>

            <aside className={cn(
                "fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-card border-r border-border backdrop-blur-2xl transition-transform duration-300 md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo */}
                <div className="h-16 flex items-center px-5 border-b border-border justify-between">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative h-9 w-9 flex items-center justify-center rounded-xl bg-primary/12 border border-primary/25 transition-colors duration-300 group-hover:bg-primary/18">
                            <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-lg font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300">
                            Vizassistance
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-2 -mr-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronRight className="h-5 w-5 rotate-180" />
                    </button>
                </div>

                {/* User badge */}
                {user && (
                    <div className="mx-4 mt-4 p-3 bg-muted rounded-2xl border border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#16254F] to-[#667D9D] flex items-center justify-center shrink-0 text-sm font-black text-white shadow-lg shadow-[#060817]/15">
                                {(user?.displayName || user?.email || '?')[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-black text-foreground truncate leading-none mb-1">
                                    {user?.displayName || user?.email?.split('@')[0]}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Free Tier</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nav links */}
                <div className="flex-1 overflow-y-auto py-5 px-4 space-y-1">
                    <p className="px-3 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
                        Navigation
                    </p>
                    {links.map((link) => {
                        const isActive = location.pathname === link.href
                        return (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={cn(
                                    "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                                    isActive
                                        ? "bg-gradient-to-r from-[#16254F] to-[#667D9D]/70 text-white shadow-lg shadow-[#060817]/20 border border-[#667D9D]/35"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <link.icon className={cn(
                                        "h-4 w-4 transition-colors",
                                        isActive ? "text-white" : "group-hover:text-primary"
                                    )} />
                                    <span>{link.name}</span>
                                </div>
                                {isActive && (
                                    <motion.div layoutId="sidebar-active-indicator">
                                        <ChevronRight className="h-4 w-4 text-white/60" />
                                    </motion.div>
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Bottom actions */}
                <div className="p-4 border-t border-border space-y-3">
                    <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-xs font-bold text-muted-foreground">Theme</span>
                        <ThemeToggle size="sm" />
                    </div>

                    {/* Logout button — opens modal */}
                    <button
                        onClick={() => setShowLogout(true)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar