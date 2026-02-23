import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, BarChart3, Sparkles, Clock, ArrowUpRight, Plus, FileText, ChevronRight } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

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
    const { user } = useAuth()
    const [stats, setStats] = useState({
        datasets: 0,
        charts: 0,
        insights: 0,
        lastUpload: null
    })
    const [recentDatasets, setRecentDatasets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return

            try {
                // Fetch counts from Supabase
                const { count: datasetsCount } = await supabase
                    .from('datasets')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)

                const { count: insightsCount } = await supabase
                    .from('insights')
                    .select('*, datasets!inner(*)', { count: 'exact', head: true })
                    .eq('datasets.user_id', user.id)

                const { data: recent } = await supabase
                    .from('datasets')
                    .select('id, file_name, upload_date, row_count')
                    .eq('user_id', user.id)
                    .order('upload_date', { ascending: false })
                    .limit(5)

                setStats({
                    datasets: datasetsCount || 0,
                    charts: (insightsCount || 0) * 1.5, // Estimated visuals
                    insights: insightsCount || 0,
                    lastUpload: recent?.[0] || null
                })
                setRecentDatasets(recent || [])
            } catch (err) {
                console.error('Error fetching stats:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [user])

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">
                        Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                    </h2>
                    <p className="text-zinc-500 mt-1 font-medium">Here's what's happening with your data today.</p>
                </div>
                <Link
                    to="/dashboard/upload"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Upload New Data
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Datasets"
                    value={loading ? "..." : stats.datasets}
                    icon={Database}
                    trend={stats.datasets > 0 ? "+1" : null}
                    color="from-primary to-blue-600"
                />
                <MetricCard
                    title="Intelligence Score"
                    value={loading ? "..." : stats.insights}
                    icon={Sparkles}
                    trend={stats.insights > 0 ? "Live" : null}
                    color="from-purple-500 to-pink-600"
                />
                <MetricCard
                    title="Active Insights"
                    value={loading ? "..." : stats.insights}
                    icon={Sparkles}
                    color="from-yellow-500 to-orange-600"
                />
                <MetricCard
                    title="Hours Saved"
                    value={loading ? "..." : (stats.datasets * 0.5 + stats.insights * 0.2).toFixed(1)}
                    icon={Clock}
                    color="from-green-500 to-emerald-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Recent Datasets
                        </h3>
                        <Link to="/dashboard/history" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                            View All <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="bg-card border border-border rounded-[2rem] overflow-hidden">
                        {recentDatasets.length > 0 ? (
                            <div className="divide-y divide-border">
                                {recentDatasets.map((ds) => (
                                    <div key={ds.id} className="p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Database className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{ds.file_name}</p>
                                                <p className="text-xs text-zinc-500">
                                                    Uploaded {new Date(ds.upload_date).toLocaleDateString()} • {ds.row_count} rows
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/dashboard/insights?id=${ds.id}`}
                                            className="p-2 rounded-xl bg-muted hover:bg-primary hover:text-white transition-all"
                                        >
                                            <ArrowUpRight className="h-5 w-5" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-muted-foreground italic">No datasets uploaded yet.</p>
                                <Link to="/dashboard/upload" className="text-primary font-bold mt-2 inline-block">
                                    Upload your first file
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Insight */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        Quick Summary
                    </h3>

                    <div className="bg-gradient-to-br from-primary to-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="h-24 w-24" />
                        </div>
                        <h4 className="text-lg font-bold mb-4">AI Assistant Tip</h4>
                        <p className="text-sm text-white/80 leading-relaxed mb-6">
                            Based on your recent uploads, you tend to see the highest growth in the "Enterprise" sector. We've updated your suggested charts.
                        </p>
                        <Link
                            to="/dashboard/insights"
                            className="w-full bg-white text-primary font-bold py-3 rounded-2xl flex items-center justify-center hover:bg-white/90 transition-all"
                        >
                            Explore Insights
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
