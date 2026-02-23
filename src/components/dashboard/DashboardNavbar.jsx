import { Moon, Sun, User, Bell, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const DashboardNavbar = ({ onMenuClick }) => {
    const { user } = useAuth()
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-xl bg-muted text-foreground hover:bg-emphasis transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="md:hidden">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent truncate max-w-[150px] inline-block">
                        Vizassistance
                    </span>
                </div>
                <div className="hidden md:block">
                    <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                        Workspace
                    </h1>
                </div>
            </div>


            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-muted hover:bg-emphasis transition-colors text-foreground"
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>

                <button className="p-2 rounded-xl bg-muted hover:bg-emphasis transition-colors text-foreground relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card" />
                </button>

                <div className="h-8 w-px bg-border mx-2" />

                <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-3 pl-2 group cursor-pointer"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-foreground leading-none mb-1 group-hover:text-primary transition-colors">
                            {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium">Free Plan</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 p-0.5 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                        <div className="w-full h-full rounded-[10px] bg-card flex items-center justify-center overflow-hidden">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-5 w-5 text-primary" />
                            )}
                        </div>
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default DashboardNavbar
