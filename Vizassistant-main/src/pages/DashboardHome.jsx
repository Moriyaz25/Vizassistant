import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Database, BarChart3, Sparkles, Clock, ArrowUpRight,
    Plus, FileText, TrendingUp, Settings2, Save, X, RefreshCw
} from 'lucide-react'
import { db } from '../services/firebase'
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Skeleton, CardSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

// ── Stat Card ──────────────────────────────────────────────────────────────
const statCards = [
    { key: 'datasets',  title: 'Datasets',     icon: Database,  color: 'text-[#ACBBC6]', bg: 'bg-[#16254F]/55', border: 'hover:border-[#667D9D]/28', glow: 'group-hover:shadow-[0_0_28px_rgba(102,125,157,0.12)]', label: 'Connected sources',      accent: 'from-[#16254F]/55' },
    { key: 'insights',  title: 'Intelligence', icon: Sparkles,  color: 'text-white',     bg: 'bg-[#667D9D]/18', border: 'hover:border-[#ACBBC6]/22', glow: 'group-hover:shadow-[0_0_28px_rgba(172,187,198,0.1)]',  label: 'AI generated patterns', accent: 'from-[#667D9D]/35' },
    { key: 'charts',    title: 'Charts',       icon: BarChart3, color: 'text-[#ACBBC6]', bg: 'bg-[#667D9D]/14', border: 'hover:border-[#667D9D]/24', glow: 'group-hover:shadow-[0_0_28px_rgba(102,125,157,0.12)]', label: 'Active visualizations', accent: 'from-[#ACBBC6]/22' },
    { key: 'timeSaved', title: 'Time Saved',   icon: Clock,     color: 'text-white',     bg: 'bg-[#16254F]/50', border: 'hover:border-[#ACBBC6]/18', glow: 'group-hover:shadow-[0_0_28px_rgba(172,187,198,0.08)]', label: 'Manual hours reduced',  accent: 'from-[#667D9D]/28', suffix: 'h' },
]

const MetricCard = ({ title, value, icon: Icon, color, bg, border, glow, label, accent, suffix }) => (
    <motion.div
        whileHover={{ y: -2 }}
        className={`relative glass-card overflow-hidden group border-white/[0.06] ${border} ${glow} transition-all duration-300`}
    >
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${accent} to-transparent`} />
        <div className="flex items-start justify-between mb-5">
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center border border-white/[0.06]`}>
                <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#ACBBC6] bg-[#667D9D]/12 border border-[#ACBBC6]/12 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />
                Live
            </div>
        </div>
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-black text-foreground">
            {value}
            {suffix && <span className="text-lg ml-0.5 text-muted-foreground">{suffix}</span>}
        </p>
        <p className="text-muted-foreground/80 text-xs font-bold mt-1 uppercase tracking-[0.1em]">{title}</p>
    </motion.div>
)

// ── Main Component ─────────────────────────────────────────────────────────
const DashboardHome = () => {
    const { user } = useAuth()
    const [loading, setLoading]               = useState(true)
    const [latestInsight, setLatestInsight]   = useState(null)
    const [recentDatasets, setRecentDatasets] = useState([])
    const [stats, setStats] = useState({ datasets: 0, charts: 0, insights: 0, timeSaved: 0 })

    useEffect(() => {
        if (!user) return

        const unsubDatasets = onSnapshot(
            query(collection(db, 'datasets'), where('user_id', '==', user.uid)),
            async (snap) => {
                const datasetsCount = snap.size

                const sorted = snap.docs
                    .map(d => ({
                        id: d.id,
                        ...d.data(),
                        upload_date: d.data().upload_date?.toDate?.()?.toISOString() || new Date().toISOString()
                    }))
                    .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))

                setRecentDatasets(sorted.slice(0, 5))

                let insightsCount = 0
                let insightText   = null

                if (datasetsCount > 0) {
                    try {
                        const dsIds  = sorted.map(d => d.id)
                        const chunks = []
                        for (let i = 0; i < dsIds.length; i += 30) chunks.push(dsIds.slice(i, i + 30))

                        for (const chunk of chunks) {
                            const insSnap = await getDocs(
                                query(collection(db, 'insights'), where('dataset_id', 'in', chunk))
                            )
                            insightsCount += insSnap.size
                            if (insSnap.size > 0 && !insightText) {
                                insightText = insSnap.docs[insSnap.docs.length - 1].data().summary_text || null
                            }
                        }
                    } catch (err) {
                        console.error('Insights fetch error:', err)
                    }
                }

                setLatestInsight(insightText)
                setStats({
                    datasets:  datasetsCount,
                    insights:  insightsCount,
                    charts:    Math.max(Math.round(insightsCount * 1.5), datasetsCount),
                    timeSaved: parseFloat((datasetsCount * 0.5 + insightsCount * 0.3).toFixed(1)),
                })
                setLoading(false)
            },
            (err) => {
                console.error('Datasets listener error:', err)
                setLoading(false)
            }
        )

        return () => unsubDatasets()
    }, [user])

    const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'

    return (
        <div className="space-y-8 min-h-full pb-10">

            {/* ── Header ── */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-2 w-2 rounded-full bg-[#ACBBC6] shadow-[0_0_8px_rgba(172,187,198,0.6)]"
                        />
                        <span className="text-[10px] font-black text-[#ACBBC6]/80 uppercase tracking-[0.2em]">
                            Live Workspace
                        </span>
                    </div>
                    {loading ? (
                        <Skeleton className="h-10 w-64 mt-2" />
                    ) : (
                        <h2 className="text-3xl font-black tracking-tight text-foreground">
                            Welcome back,{' '}
                            <span className="bg-gradient-to-r from-white via-[#ACBBC6] to-[#667D9D] bg-clip-text text-transparent">
                                {firstName}
                            </span>
                        </h2>
                    )}
                    <p className="text-muted-foreground mt-1 font-medium text-sm">
                        {loading
                            ? 'Loading workspace...'
                            : `${stats.datasets} dataset${stats.datasets !== 1 ? 's' : ''} · ${stats.insights} insight${stats.insights !== 1 ? 's' : ''} generated`
                        }
                    </p>
                </div>

                <Link
                    to="/dashboard/upload"
                    className="inline-flex items-center gap-2 bg-[#667D9D] text-[#060817] px-6 py-3 rounded-2xl font-bold shadow-lg text-sm hover:bg-[#7890ae] transition-colors w-fit"
                >
                    <Plus className="h-4 w-4" />
                    Upload
                </Link>
            </motion.header>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        {loading ? (
                            <div className="glass-card flex flex-col gap-2 p-6 h-full">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        ) : (
                            <MetricCard
                                title={card.title}
                                value={card.key === 'timeSaved' ? stats.timeSaved : stats[card.key]}
                                icon={card.icon}
                                color={card.color}
                                bg={card.bg}
                                border={card.border}
                                glow={card.glow}
                                label={card.label}
                                accent={card.accent}
                                suffix={card.suffix}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* ── Main Content Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Datasets — spans 2 cols */}
                <div className="lg:col-span-2 bg-card/72 backdrop-blur-xl border border-border rounded-3xl shadow-[0_12px_30px_rgba(6,8,23,0.16)] overflow-hidden flex flex-col">
                    <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                        <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">Recent Datasets</h4>
                        <Link to="/dashboard/history" className="text-[10px] font-bold text-[#667D9D] hover:text-[#ACBBC6] transition-colors uppercase tracking-wider">
                            View all →
                        </Link>
                    </div>
                    <div className="flex-1 p-5 space-y-3 overflow-y-auto">
                        {loading ? (
                            <>
                                <Skeleton className="h-16 w-full rounded-xl" />
                                <Skeleton className="h-16 w-full rounded-xl" />
                                <Skeleton className="h-16 w-full rounded-xl" />
                            </>
                        ) : recentDatasets.length > 0 ? (
                            recentDatasets.map((ds) => (
                                <div
                                    key={ds.id}
                                    className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-primary/20 hover:bg-white/[0.05] transition-all group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-9 w-9 rounded-xl bg-primary/12 flex items-center justify-center border border-white/[0.06] shrink-0">
                                            <FileText className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-foreground truncate max-w-[200px]">
                                                {ds.file_name}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {new Date(ds.upload_date).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                                {' · '}{ds.row_count?.toLocaleString() || 0} rows
                                                {' · '}{ds.column_count || 0} cols
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/dashboard/insights?id=${ds.id}`}
                                        className="p-2 rounded-xl hover:bg-primary/10 transition-colors shrink-0"
                                    >
                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <EmptyState
                                className="h-full py-8 bg-transparent border-0 shadow-none"
                                title="No datasets yet"
                                description="Upload your first CSV or Excel file to get AI-powered insights."
                                actionLabel="Upload Now"
                                actionLink="/dashboard/upload"
                            />
                        )}
                    </div>
                </div>

                {/* AI Summary — 1 col */}
                <div className="bg-card/72 backdrop-blur-xl border border-border rounded-3xl shadow-[0_12px_30px_rgba(6,8,23,0.16)] overflow-hidden flex flex-col">
                    <div className="px-5 py-3.5 border-b border-border">
                        <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">AI Summary</h4>
                    </div>
                    <div className="flex-1 p-5">
                        {loading ? (
                            <Skeleton className="h-full w-full rounded-2xl min-h-[200px]" />
                        ) : (
                            <div className="relative overflow-hidden rounded-2xl p-5 h-full bg-gradient-to-br from-[#0d1731] via-[#16254F] to-[#0b1120] border border-[#667D9D]/20 flex flex-col min-h-[200px]">
                                <Sparkles className="absolute top-3 right-3 h-10 w-10 text-[#ACBBC6]/10 pointer-events-none" />

                                <div className="inline-flex items-center gap-1.5 text-[9px] font-black text-[#ACBBC6] bg-[#667D9D]/14 border border-[#ACBBC6]/12 px-2 py-1 rounded-full uppercase tracking-wider mb-3 w-fit">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    {latestInsight ? 'Latest Insight' : 'AI Tip'}
                                </div>

                                {latestInsight ? (
                                    <div className="flex-1 overflow-hidden flex flex-col">
                                        <p
                                            className="text-white/70 text-xs leading-relaxed flex-1 overflow-hidden"
                                            style={{ display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                        >
                                            {latestInsight.replace(/[#*`]/g, '').slice(0, 400)}
                                            {latestInsight.length > 400 && '...'}
                                        </p>
                                        <Link
                                            to={recentDatasets[0] ? `/dashboard/insights?id=${recentDatasets[0].id}` : '/dashboard/insights'}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ACBBC6] hover:text-white transition-colors mt-3"
                                        >
                                            View full report <ArrowUpRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                ) : stats.datasets === 0 ? (
                                    <div className="flex-1 flex flex-col justify-center gap-2">
                                        <p className="text-white font-bold text-sm">No datasets uploaded yet.</p>
                                        <p className="text-white/40 text-xs">Upload a CSV or Excel file to get AI-powered insights.</p>
                                        <Link
                                            to="/dashboard/upload"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#667D9D] hover:text-[#ACBBC6] transition-colors mt-1"
                                        >
                                            Upload now <ArrowUpRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col justify-center gap-3">
                                        <p className="text-white font-bold text-sm">
                                            You have{' '}
                                            <span className="text-[#ACBBC6]">{stats.datasets} dataset{stats.datasets !== 1 ? 's' : ''}</span>{' '}
                                            ready for analysis.
                                        </p>
                                        <p className="text-white/40 text-xs">No AI insights yet. Open a dataset to analyze it.</p>
                                        <Link
                                            to={`/dashboard/insights?id=${recentDatasets[0]?.id}`}
                                            className="inline-flex items-center gap-2 bg-[#667D9D]/20 hover:bg-[#667D9D]/30 border border-[#667D9D]/30 text-[#ACBBC6] px-4 py-2 rounded-xl text-xs font-bold transition-all w-fit"
                                        >
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            Generate Insights
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DashboardHome