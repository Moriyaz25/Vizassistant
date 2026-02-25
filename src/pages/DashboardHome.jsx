import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, BarChart3, Sparkles, Clock, ArrowUpRight, Plus, FileText, ChevronRight } from 'lucide-react'
import { db } from '../services/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import DashboardGrid, { DashboardWidget } from '../components/dashboard/DashboardGrid'
import { Settings2, Save, X } from 'lucide-react'

const MetricCard = ({ title, value, icon: Icon, trend, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-card border border-border p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full`} />

        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-muted group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-6 w-6 text-foreground`} />
            </div>
            {trend && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                    <ArrowUpRight className="h-3 w-3" />
                    {trend}
                </span>
            )}
        </div>

        <h3 className="text-zinc-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-black text-foreground">{value}</p>
    </motion.div>
)

const DashboardHome = () => {
    const { user, updateProfile } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [layout, setLayout] = useState([
        { i: 'stats1', x: 0, y: 0, w: 3, h: 2 },
        { i: 'stats2', x: 3, y: 0, w: 3, h: 2 },
        { i: 'stats3', x: 6, y: 0, w: 3, h: 2 },
        { i: 'stats4', x: 9, y: 0, w: 3, h: 2 },
        { i: 'recent', x: 0, y: 2, w: 8, h: 5 },
        { i: 'summary', x: 8, y: 2, w: 4, h: 5 },
    ])
    const [stats, setStats] = useState({
        datasets: 0,
        charts: 0,
        insights: 0,
        lastUpload: null
    })
    const [recentDatasets, setRecentDatasets] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user?.user_metadata?.dashboard_layout) {
            setLayout(user.user_metadata.dashboard_layout)
        }
    }, [user])

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return

            try {
                // Fetch all datasets for this user (sort client-side to avoid composite index)
                const datasetsQuery = query(
                    collection(db, 'datasets'),
                    where('user_id', '==', user.uid)
                )
                const datasetsSnap = await getDocs(datasetsQuery)
                const allDatasets = datasetsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

                // Sort by upload_date desc and take 5 most recent
                const recentData = [...allDatasets]
                    .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
                    .slice(0, 5)

                // Fetch insights count from Firestore
                const insightsQuery = query(
                    collection(db, 'insights'),
                    where('user_id', '==', user.uid)
                )
                const insightsSnap = await getDocs(insightsQuery)

                setStats({
                    datasets: allDatasets.length,
                    charts: (insightsSnap.size || 0) * 1.5,
                    insights: insightsSnap.size || 0,
                    lastUpload: recentData?.[0] || null
                })
                setRecentDatasets(recentData)
            } catch (err) {
                console.error('Error fetching stats:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [user])

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout)
    }

    const saveLayout = async () => {
        try {
            setSaving(true)
            await updateProfile({ dashboard_layout: layout })
            setIsEditing(false)
        } catch (err) {
            console.error('Error saving layout:', err)
            alert('Failed to save layout')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">
                        Welcome, {user?.displayName || user?.email?.split('@')[0]}
                    </h2>
                    <p className="text-zinc-500 mt-1 font-medium">Customize your data workspace.</p>
                </div>
                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center gap-2 bg-muted text-foreground px-6 py-3 rounded-2xl font-bold hover:bg-emphasis transition-all"
                        >
                            <Settings2 className="h-5 w-5" />
                            Edit Layout
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="inline-flex items-center gap-2 bg-muted text-foreground px-4 py-3 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
                            >
                                <X className="h-5 w-5" />
                                Cancel
                            </button>
                            <button
                                onClick={saveLayout}
                                disabled={saving}
                                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                            >
                                <Save className="h-5 w-5" />
                                {saving ? "Saving..." : "Save Layout"}
                            </button>
                        </div>
                    )}
                    <Link
                        to="/dashboard/upload"
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Upload
                    </Link>
                </div>
            </header>

            <DashboardGrid
                layout={layout}
                isDraggable={isEditing}
                onLayoutChange={handleLayoutChange}
            >
                <div key="stats1">
                    <DashboardWidget id="stats1" title="Datasets" isDraggable={isEditing}>
                        <div className="flex flex-col">
                            <Database className="h-8 w-8 text-blue-500 mb-2" />
                            <p className="text-3xl font-black">{loading ? "..." : stats.datasets}</p>
                            <p className="text-xs text-zinc-500">Connected sources</p>
                        </div>
                    </DashboardWidget>
                </div>

                <div key="stats2">
                    <DashboardWidget id="stats2" title="Intelligence" isDraggable={isEditing}>
                        <div className="flex flex-col">
                            <Sparkles className="h-8 w-8 text-purple-500 mb-2" />
                            <p className="text-3xl font-black">{loading ? "..." : stats.insights}</p>
                            <p className="text-xs text-zinc-500">AI generated patterns</p>
                        </div>
                    </DashboardWidget>
                </div>

                <div key="stats3">
                    <DashboardWidget id="stats3" title="Insights" isDraggable={isEditing}>
                        <div className="flex flex-col">
                            <BarChart3 className="h-8 w-8 text-yellow-500 mb-2" />
                            <p className="text-3xl font-black">{loading ? "..." : stats.insights}</p>
                            <p className="text-xs text-zinc-500">Active reports</p>
                        </div>
                    </DashboardWidget>
                </div>

                <div key="stats4">
                    <DashboardWidget id="stats4" title="Time Saved" isDraggable={isEditing}>
                        <div className="flex flex-col">
                            <Clock className="h-8 w-8 text-green-500 mb-2" />
                            <p className="text-3xl font-black">{loading ? "..." : (stats.datasets * 0.5 + stats.insights * 0.2).toFixed(1)}h</p>
                            <p className="text-xs text-zinc-500">Manual effort reduced</p>
                        </div>
                    </DashboardWidget>
                </div>

                <div key="recent">
                    <DashboardWidget id="recent" title="Recent Datasets" isDraggable={isEditing}>
                        <div className="space-y-4">
                            {recentDatasets.map((ds) => (
                                <div key={ds.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Database className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm font-bold">{ds.file_name}</p>
                                            <p className="text-[10px] text-zinc-500">{new Date(ds.upload_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <Link to={`/dashboard/insights?id=${ds.id}`}>
                                        <ArrowUpRight className="h-4 w-4 text-primary" />
                                    </Link>
                                </div>
                            ))}
                            {recentDatasets.length === 0 && !loading && (
                                <p className="text-center text-zinc-500 text-sm py-4">No datasets found.</p>
                            )}
                        </div>
                    </DashboardWidget>
                </div>

                <div key="summary">
                    <DashboardWidget id="summary" title="AI Summary" isDraggable={isEditing}>
                        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white h-full relative overflow-hidden">
                            <Sparkles className="absolute top-0 right-0 p-2 opacity-10 h-16 w-16" />
                            <h5 className="font-bold mb-2">Pro Tip</h5>
                            <p className="text-xs text-white/80 leading-relaxed">
                                Users with customizable dashboards are 40% more efficient at identifying trends. Try rearranging your widgets!
                            </p>
                        </div>
                    </DashboardWidget>
                </div>
            </DashboardGrid>
        </div>
    )
}

export default DashboardHome
