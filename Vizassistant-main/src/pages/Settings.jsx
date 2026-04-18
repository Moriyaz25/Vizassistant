import { useState } from 'react'
import { Moon, Sun, User, Bell, Shield, Trash2, AlertCircle, CheckCircle2, X, LogOut, Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth'
import { db } from '../services/firebase'
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore'
import { useTheme } from '../context/ThemeContext'   // adjust path if different

// ── Password Modal ──────────────────────────────────────────────────────────
const PasswordModal = ({ onClose }) => {
    const [current, setCurrent] = useState('')
    const [next, setNext]       = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState('')
    const [done, setDone]       = useState(false)

    const handle = async () => {
        setError('')
        if (!current)           return setError('Enter current password.')
        if (next.length < 6)    return setError('New password must be at least 6 characters.')
        if (next !== confirm)   return setError('Passwords do not match.')
        setLoading(true)
        try {
            const auth = getAuth()
            const cred = EmailAuthProvider.credential(auth.currentUser.email, current)
            await reauthenticateWithCredential(auth.currentUser, cred)
            await updatePassword(auth.currentUser, next)
            setDone(true)
            setTimeout(onClose, 1500)
        } catch (e) {
            setError(e.code === 'auth/wrong-password' ? 'Current password is incorrect.' : e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => !loading && onClose()}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 10 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="pointer-events-auto w-full max-w-sm bg-card border border-border rounded-[2rem] p-8 shadow-2xl"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="p-3 rounded-2xl bg-primary/10"><Shield className="h-6 w-6 text-primary" /></div>
                        <button onClick={onClose} disabled={loading} className="p-2 rounded-xl hover:bg-muted transition-colors">
                            <X className="h-5 w-5 text-zinc-400" />
                        </button>
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-6">Update Password</h3>
                    {done ? (
                        <div className="flex flex-col items-center gap-3 py-4">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                            <p className="font-bold text-green-500">Password updated!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {[['Current Password', current, setCurrent], ['New Password', next, setNext], ['Confirm New Password', confirm, setConfirm]].map(([label, val, set]) => (
                                <div key={label}>
                                    <label className="text-xs font-bold text-zinc-400 mb-1 block">{label}</label>
                                    <input type="password" value={val} onChange={e => set(e.target.value)} placeholder="••••••••"
                                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            ))}
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
                                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                                </div>
                            )}
                            <button onClick={handle} disabled={loading}
                                className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Update Password'}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    )
}

// ── Delete Account Modal ────────────────────────────────────────────────────
const DeleteModal = ({ onClose }) => {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState('')

    const handle = async () => {
        if (!password) return setError('Enter your password to confirm.')
        setLoading(true)
        setError('')
        try {
            const auth = getAuth()
            const cred = EmailAuthProvider.credential(auth.currentUser.email, password)
            await reauthenticateWithCredential(auth.currentUser, cred)

            // Delete all user data from Firestore
            const batch = writeBatch(db)
            const dsSnap = await getDocs(query(collection(db, 'datasets'), where('user_id', '==', user.uid)))
            const dsIds = dsSnap.docs.map(d => d.id)
            dsSnap.docs.forEach(d => batch.delete(d.ref))

            if (dsIds.length > 0) {
                const insSnap = await getDocs(query(collection(db, 'insights'), where('dataset_id', 'in', dsIds.slice(0, 30))))
                insSnap.docs.forEach(d => batch.delete(d.ref))
            }
            await batch.commit()

            await deleteUser(auth.currentUser)
            navigate('/login')
        } catch (e) {
            setError(e.code === 'auth/wrong-password' ? 'Incorrect password.' : e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => !loading && onClose()}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 10 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="pointer-events-auto w-full max-w-sm bg-card border border-border rounded-[2rem] p-8 shadow-2xl"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                            <Trash2 className="h-6 w-6 text-red-400" />
                        </div>
                        <button onClick={onClose} disabled={loading} className="p-2 rounded-xl hover:bg-muted transition-colors">
                            <X className="h-5 w-5 text-zinc-400" />
                        </button>
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">Delete Account?</h3>
                    <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                        This will permanently delete your account, all datasets, and AI insights. <span className="text-red-400 font-bold">This cannot be undone.</span>
                    </p>
                    <label className="text-xs font-bold text-zinc-400 mb-1 block">Confirm with your password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-red-500 outline-none mb-4" />
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl mb-4">
                            <AlertCircle className="h-4 w-4 shrink-0" />{error}
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button onClick={onClose} disabled={loading}
                            className="flex-1 py-3 rounded-2xl border border-border font-bold text-sm hover:bg-muted transition-all disabled:opacity-50">
                            Cancel
                        </button>
                        <button onClick={handle} disabled={loading}
                            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Trash2 className="h-4 w-4" />Delete</>}
                        </button>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

// ── Main Settings ───────────────────────────────────────────────────────────
const Settings = () => {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    // Try to use ThemeContext — fall back gracefully if not available
    let theme = 'dark', toggleTheme = () => {}
    try {
        const ctx = useTheme()
        theme = ctx.theme
        toggleTheme = ctx.toggleTheme
    } catch {}

    const [notifications, setNotifications] = useState(() => {
        try { return JSON.parse(localStorage.getItem('viz_notifications') ?? 'true') } catch { return true }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showDelete, setShowDelete]     = useState(false)
    const [showLogout, setShowLogout]     = useState(false)
    const [loggingOut, setLoggingOut]     = useState(false)

    const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com'

    const toggleNotifications = (val) => {
        setNotifications(val)
        localStorage.setItem('viz_notifications', JSON.stringify(val))
    }

    const handleLogout = async () => {
        setLoggingOut(true)
        try { await signOut(); navigate('/login') }
        catch (e) { console.error(e) }
        finally { setLoggingOut(false); setShowLogout(false) }
    }

    const sections = [
        {
            title: 'Preferences',
            items: [
                {
                    icon: theme === 'dark' ? Moon : Sun,
                    iconBg: 'bg-primary/10',
                    iconColor: 'text-primary',
                    label: 'Appearance',
                    sub: `Currently: ${theme === 'dark' ? 'Dark' : 'Light'} mode`,
                    action: (
                        <button onClick={toggleTheme}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold border border-border rounded-xl hover:bg-muted transition-colors">
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    )
                },
                {
                    icon: Bell,
                    iconBg: 'bg-orange-500/10',
                    iconColor: 'text-orange-500',
                    label: 'Notifications',
                    sub: notifications ? 'Enabled — you will receive alerts' : 'Disabled',
                    action: (
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={notifications}
                                onChange={e => toggleNotifications(e.target.checked)} />
                            <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                        </label>
                    )
                },
            ]
        },
        {
            title: 'Account',
            items: [
                {
                    icon: User,
                    iconBg: 'bg-primary/10',
                    iconColor: 'text-primary',
                    label: 'Edit Profile',
                    sub: user?.displayName || user?.email || '—',
                    action: (
                        <Link to="/dashboard/profile"
                            className="px-4 py-2 text-xs font-bold border border-border rounded-xl hover:bg-muted transition-colors">
                            Go to Profile
                        </Link>
                    )
                },
                {
                    icon: Shield,
                    iconBg: 'bg-blue-500/10',
                    iconColor: 'text-blue-400',
                    label: 'Update Password',
                    sub: isGoogleUser ? 'Not available for Google sign-in' : 'Change your login password',
                    disabled: isGoogleUser,
                    action: (
                        <button onClick={() => !isGoogleUser && setShowPassword(true)} disabled={isGoogleUser}
                            className="px-4 py-2 text-xs font-bold border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                            Update
                        </button>
                    )
                },
                {
                    icon: LogOut,
                    iconBg: 'bg-zinc-500/10',
                    iconColor: 'text-zinc-400',
                    label: 'Sign Out',
                    sub: 'Sign out of your current session',
                    action: (
                        <button onClick={() => setShowLogout(true)}
                            className="px-4 py-2 text-xs font-bold border border-border rounded-xl hover:bg-muted transition-colors">
                            Sign Out
                        </button>
                    )
                },
            ]
        },
        {
            title: 'Danger Zone',
            danger: true,
            items: [
                {
                    icon: Trash2,
                    iconBg: 'bg-red-500/10',
                    iconColor: 'text-red-500',
                    label: 'Delete Account',
                    sub: 'Permanently delete your account and all data',
                    action: (
                        <button onClick={() => setShowDelete(true)}
                            className="px-4 py-2 text-xs font-bold border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors">
                            Delete
                        </button>
                    )
                }
            ]
        }
    ]

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Modals */}
            <AnimatePresence>
                {showPassword && <PasswordModal onClose={() => setShowPassword(false)} />}
                {showDelete   && <DeleteModal   onClose={() => setShowDelete(false)} />}
                {showLogout   && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => !loggingOut && setShowLogout(false)}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
                        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 10 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="pointer-events-auto w-full max-w-sm bg-card border border-border rounded-[2rem] p-8 shadow-2xl"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                                        <LogOut className="h-6 w-6 text-red-400" />
                                    </div>
                                    <button onClick={() => setShowLogout(false)} disabled={loggingOut} className="p-2 rounded-xl hover:bg-muted transition-colors">
                                        <X className="h-5 w-5 text-zinc-400" />
                                    </button>
                                </div>
                                <h3 className="text-xl font-black text-foreground mb-2">Sign out?</h3>
                                <p className="text-zinc-500 text-sm mb-8">Your data is safely saved and will be here when you return.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowLogout(false)} disabled={loggingOut}
                                        className="flex-1 py-3 rounded-2xl border border-border font-bold text-sm hover:bg-muted transition-all disabled:opacity-50">
                                        Cancel
                                    </button>
                                    <button onClick={handleLogout} disabled={loggingOut}
                                        className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                        {loggingOut ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogOut className="h-4 w-4" />Sign Out</>}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">Settings</h1>
                <p className="text-zinc-500 mt-1 font-medium">Manage your preferences and account settings.</p>
            </div>

            {/* Sections */}
            {sections.map((section) => (
                <div key={section.title}>
                    <p className={`text-xs font-black uppercase tracking-[0.18em] mb-3 px-1 ${section.danger ? 'text-red-500/70' : 'text-zinc-500'}`}>
                        {section.title}
                    </p>
                    <div className={`bg-card border rounded-[2rem] overflow-hidden ${section.danger ? 'border-red-500/20' : 'border-border'}`}>
                        <div className="divide-y divide-border">
                            {section.items.map((item) => (
                                <div key={item.label}
                                    className={`flex items-center justify-between p-6 transition-colors ${item.disabled ? 'opacity-50' : 'hover:bg-muted/40'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 ${item.iconBg} rounded-xl ${item.iconColor}`}>
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-foreground">{item.label}</p>
                                            <p className="text-xs text-zinc-500 mt-0.5">{item.sub}</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0">{item.action}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Settings