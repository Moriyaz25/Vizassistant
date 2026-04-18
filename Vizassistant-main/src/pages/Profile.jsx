import { useAuth } from '../context/AuthContext'
import { User, Mail, Shield, Zap, LogOut, Clock, Database, BarChart3, CheckCircle2, X, AlertCircle, Pencil, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../services/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'

// ── Logout Modal ────────────────────────────────────────────────────────────
const LogoutModal = ({ onConfirm, onCancel, loading }) => (
    <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !loading && onCancel()}
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
                    <button onClick={onCancel} disabled={loading} className="p-2 rounded-xl hover:bg-muted transition-colors disabled:opacity-40">
                        <X className="h-5 w-5 text-zinc-400" />
                    </button>
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">Sign out?</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                    You will be signed out of your account. Your data will be safely saved.
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel} disabled={loading}
                        className="flex-1 py-3 rounded-2xl border border-border font-bold text-sm hover:bg-muted transition-all disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading
                            ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <><LogOut className="h-4 w-4" /> Sign Out</>}
                    </button>
                </div>
            </motion.div>
        </div>
    </>
)

// ── Password Modal ──────────────────────────────────────────────────────────
const PasswordModal = ({ onClose }) => {
    const [current, setCurrent]   = useState('')
    const [next, setNext]         = useState('')
    const [confirm, setConfirm]   = useState('')
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState('')
    const [success, setSuccess]   = useState(false)

    const handleUpdate = async () => {
        setError('')
        if (next.length < 6)          return setError('New password must be at least 6 characters.')
        if (next !== confirm)         return setError('Passwords do not match.')
        if (!current)                 return setError('Please enter your current password.')

        setLoading(true)
        try {
            const auth = getAuth()
            const credential = EmailAuthProvider.credential(auth.currentUser.email, current)
            await reauthenticateWithCredential(auth.currentUser, credential)
            await updatePassword(auth.currentUser, next)
            setSuccess(true)
            setTimeout(onClose, 1500)
        } catch (err) {
            if (err.code === 'auth/wrong-password') setError('Current password is incorrect.')
            else setError(err.message || 'Failed to update password.')
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
                        <div className="p-3 rounded-2xl bg-primary/10">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <button onClick={onClose} disabled={loading} className="p-2 rounded-xl hover:bg-muted transition-colors">
                            <X className="h-5 w-5 text-zinc-400" />
                        </button>
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-6">Update Password</h3>

                    {success ? (
                        <div className="flex flex-col items-center gap-3 py-4">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                            <p className="font-bold text-green-500">Password updated!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {[
                                { label: 'Current Password', value: current, set: setCurrent },
                                { label: 'New Password',     value: next,    set: setNext },
                                { label: 'Confirm Password', value: confirm, set: setConfirm },
                            ].map(({ label, value, set }) => (
                                <div key={label}>
                                    <label className="text-xs font-bold text-zinc-400 mb-1 block">{label}</label>
                                    <input type="password" value={value} onChange={e => set(e.target.value)}
                                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="••••••••" />
                                </div>
                            ))}

                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
                                    <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                                </div>
                            )}

                            <button onClick={handleUpdate} disabled={loading}
                                className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                                {loading
                                    ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : 'Update Password'}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    )
}

// ── Main Profile ────────────────────────────────────────────────────────────
const Profile = () => {
    const { user, signOut, updateProfile } = useAuth()
    const navigate = useNavigate()

    const [isEditing, setIsEditing]       = useState(false)
    const [fullName, setFullName]         = useState('')
    const [saving, setSaving]             = useState(false)
    const [saveMsg, setSaveMsg]           = useState('')

    const [showLogout, setShowLogout]     = useState(false)
    const [loggingOut, setLoggingOut]     = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [stats, setStats] = useState({ datasets: 0, insights: 0, memberSince: '—' })

    // Sync name from user
    useEffect(() => {
        if (user) {
            setFullName(user.displayName || user.email?.split('@')[0] || '')
            fetchStats()
        }
    }, [user])

    const fetchStats = async () => {
        try {
            const [dsSnap, insSnap] = await Promise.all([
                getDocs(query(collection(db, 'datasets'), where('user_id', '==', user.uid))),
                getDocs(query(collection(db, 'insights'), where('dataset_id', 'in',
                    // get dataset ids first, fallback to ['__none__'] to avoid empty 'in'
                    (await getDocs(query(collection(db, 'datasets'), where('user_id', '==', user.uid))))
                        .docs.map(d => d.id).slice(0, 30).concat(['__none__'])
                )))
            ])
            setStats({
                datasets: dsSnap.size,
                insights: insSnap.size,
                memberSince: user.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : '—'
            })
        } catch (err) {
            console.error('Stats fetch error:', err)
        }
    }

    const handleSave = async () => {
        if (!fullName.trim()) return
        setSaving(true)
        setSaveMsg('')
        try {
            await updateProfile({ full_name: fullName.trim() })
            setSaveMsg('Saved!')
            setIsEditing(false)
            setTimeout(() => setSaveMsg(''), 2000)
        } catch (err) {
            setSaveMsg('Failed to save.')
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            await signOut()
            navigate('/login')
        } catch (err) {
            console.error(err)
        } finally {
            setLoggingOut(false)
            setShowLogout(false)
        }
    }

    const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com'

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">

            {/* Modals */}
            <AnimatePresence>
                {showLogout && <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} loading={loggingOut} />}
                {showPassword && <PasswordModal onClose={() => setShowPassword(false)} />}
            </AnimatePresence>

            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">User Account</h1>
                    <p className="text-zinc-500 mt-1 font-medium">Manage your personal settings and platform usage.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saveMsg && (
                        <span className={`text-xs font-bold ${saveMsg === 'Saved!' ? 'text-green-500' : 'text-red-400'}`}>
                            {saveMsg}
                        </span>
                    )}
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all text-sm">
                            <Pencil className="h-4 w-4" /> Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(false)}
                                className="px-5 py-2.5 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all text-sm">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all text-sm disabled:opacity-50">
                                {saving
                                    ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <><Save className="h-4 w-4" /> Save</>}
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* ── Left: Profile + Security ── */}
                <div className="md:col-span-2 space-y-6">

                    {/* Profile Card */}
                    <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none">
                            <User className="h-32 w-32 text-primary" />
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-[#667D9D] p-[3px] shadow-lg shadow-primary/20 shrink-0">
                                <div className="w-full h-full rounded-[1.8rem] bg-card flex items-center justify-center overflow-hidden">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-black text-primary">
                                            {(user?.displayName || user?.email || '?')[0].toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                {isEditing ? (
                                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                                        className="w-full bg-muted border border-border rounded-xl px-4 py-2 font-bold text-xl text-foreground focus:ring-2 focus:ring-primary outline-none mb-1"
                                        placeholder="Full Name" />
                                ) : (
                                    <h2 className="text-2xl font-black text-foreground truncate">
                                        {user?.displayName || user?.email?.split('@')[0]}
                                    </h2>
                                )}
                                <p className="text-zinc-500 font-medium flex items-center gap-2 mt-1 text-sm">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    {user?.email}
                                </p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-bold text-green-500">Active Account</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted px-5 py-4 rounded-2xl border border-border">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Provider</p>
                                <p className="text-sm font-bold text-foreground capitalize">
                                    {isGoogleUser ? '🔵 Google' : '📧 Email'}
                                </p>
                            </div>
                            <div className="bg-muted px-5 py-4 rounded-2xl border border-border">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Member Since</p>
                                <p className="text-sm font-bold text-foreground">{stats.memberSince}</p>
                            </div>
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-card border border-border rounded-[2.5rem] p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Security & Settings
                        </h3>
                        <div className="space-y-3">
                            {/* Password — disabled for Google users */}
                            <button
                                onClick={() => !isGoogleUser && setShowPassword(true)}
                                disabled={isGoogleUser}
                                className="w-full text-left px-6 py-4 bg-muted hover:bg-emphasis border border-border rounded-2xl transition-all flex items-center justify-between group disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center gap-4">
                                    <Shield className="h-5 w-5 text-zinc-500 group-hover:text-primary transition-colors" />
                                    <div>
                                        <span className="font-bold text-sm block">Update Password</span>
                                        {isGoogleUser && <span className="text-[10px] text-zinc-500">Not available for Google accounts</span>}
                                    </div>
                                </div>
                                <Clock className="h-4 w-4 text-zinc-400" />
                            </button>

                            {/* Sign out */}
                            <button
                                onClick={() => setShowLogout(true)}
                                className="w-full text-left px-6 py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-2xl transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <LogOut className="h-5 w-5 text-red-500" />
                                    <span className="font-bold text-sm text-red-500">Sign Out</span>
                                </div>
                                <Zap className="h-4 w-4 text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Right: Plan + Stats ── */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary to-[#667D9D] rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Zap className="h-24 w-24" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">Free Plan</h3>
                        <p className="text-white/70 text-sm mb-6">You're on the free tier.</p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                                    <span>Datasets</span>
                                    <span>{stats.datasets} / 10</span>
                                </div>
                                <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((stats.datasets / 10) * 100, 100)}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className="h-full bg-white rounded-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                                    <span>AI Insights</span>
                                    <span>{stats.insights} / 25</span>
                                </div>
                                <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((stats.insights / 25) * 100, 100)}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-white rounded-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-white text-primary font-black py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl text-sm">
                            Upgrade to Pro ✦
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-card border border-border rounded-[2.5rem] p-6">
                        <h4 className="font-bold text-sm mb-5 text-foreground">Quick Stats</h4>
                        <div className="space-y-4">
                            {[
                                { icon: Database,  color: 'text-primary',    bg: 'bg-primary/10',      label: 'Total Uploads', value: stats.datasets },
                                { icon: BarChart3, color: 'text-[#667D9D]',  bg: 'bg-[#667D9D]/14',   label: 'AI Insights',   value: stats.insights },
                            ].map(({ icon: Icon, color, bg, label, value }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <div className={`p-2 ${bg} rounded-lg ${color}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-black text-foreground">{value}</p>
                                        <p className="text-zinc-500">{label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile