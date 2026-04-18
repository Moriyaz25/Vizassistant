import { useState, useMemo, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { cn } from '../../utils/cn'
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, AreaChart as AreaIcon, Settings2 } from 'lucide-react'

const COLORS = ['#16254F', '#667D9D', '#ACBBC6', '#4D6380', '#7E93AF', '#CBD5DC', '#2A3F6F', '#8FA8BF', '#3D5A80', '#98C1D9']

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-2xl">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color || entry.fill }} />
                        <p className="text-sm font-semibold">
                            {entry.name}: <span className="text-primary">{Number(entry.value).toLocaleString()}</span>
                        </p>
                    </div>
                ))}
            </div>
        )
    }
    return null
}

// ── Custom Pie Legend (scrollable, no overflow) ───────────────────────────────
const CustomPieLegend = ({ data, xAxisKey, yAxisKey }) => {
    const total = data.reduce((s, d) => s + (d[yAxisKey] || 0), 0)
    return (
        <div className="mt-4 max-h-36 overflow-y-auto pr-1 space-y-1.5">
            {data.map((entry, index) => {
                const pct = total > 0 ? ((entry[yAxisKey] / total) * 100).toFixed(1) : 0
                return (
                    <div key={index} className="flex items-center justify-between gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                            <div
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-xs text-muted-foreground truncate">{entry[xAxisKey]}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-foreground">{Number(entry[yAxisKey]).toLocaleString()}</span>
                            <span className="text-[10px] text-muted-foreground w-10 text-right">{pct}%</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const ChartGenerator = ({ data }) => {
    const [chartType, setChartType] = useState('area')

    const keys = data && data.length > 0 ? Object.keys(data[0]) : []

    const isNumeric = (val) => {
        if (typeof val === 'number') return true
        if (typeof val !== 'string') return false
        return !isNaN(parseFloat(val)) && isFinite(val)
    }

    const numericKeys = keys.filter(key => {
        const firstVal = data.find(row => row[key] !== null && row[key] !== undefined)?.[key]
        return isNumeric(firstVal)
    })

    const categoricalKeys = keys.filter(key => !numericKeys.includes(key))

    const [xAxisKey, setXAxisKey] = useState(categoricalKeys[0] || keys[0] || '')
    const [yAxisKey, setYAxisKey] = useState(numericKeys[0] || keys[1] || keys[0] || '')

    useEffect(() => {
        if (data && data.length > 0) {
            if (!xAxisKey || !keys.includes(xAxisKey))
                setXAxisKey(categoricalKeys[0] || keys[0] || '')
            if (!yAxisKey || !keys.includes(yAxisKey))
                setYAxisKey(numericKeys[0] || keys[1] || keys[0] || '')
        }
    }, [data])

    const aggregatedData = useMemo(() => {
        if (!data || data.length === 0 || !xAxisKey || !yAxisKey) return []

        const groups = data.reduce((acc, curr) => {
            const key = String(curr[xAxisKey] ?? 'Unknown')
            const value = Number(curr[yAxisKey]) || 0
            acc[key] = (acc[key] || 0) + value
            return acc
        }, {})

        let result = Object.entries(groups).map(([name, value]) => ({
            [xAxisKey]: name,
            [yAxisKey]: value
        })).sort((a, b) => b[yAxisKey] - a[yAxisKey])

        if (chartType === 'pie' && result.length > 10) {
            const top = result.slice(0, 10)
            const othersValue = result.slice(10).reduce((s, i) => s + i[yAxisKey], 0)
            return [...top, { [xAxisKey]: 'Others', [yAxisKey]: othersValue }]
        }

        return result
    }, [data, xAxisKey, yAxisKey, chartType])

    const Defs = () => (
        <defs>
            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="hsl(var(--primary))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
            </linearGradient>
        </defs>
    )

    const commonAxisProps = {
        stroke: 'hsl(var(--muted-foreground))',
        fontSize: 10,
        axisLine: false,
        tickLine: false,
        tick: { fill: 'hsl(var(--muted-foreground))' },
    }

    const renderChart = () => {
        const commonProps = {
            data: aggregatedData,
            margin: { top: 10, right: 10, left: 0, bottom: 30 }
        }

        switch (chartType) {
            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={360}>
                        <AreaChart {...commonProps}>
                            <Defs />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                            <XAxis dataKey={xAxisKey} {...commonAxisProps} dy={10} angle={-15} textAnchor="end" />
                            <YAxis {...commonAxisProps} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }} />
                            <Area type="monotone" dataKey={yAxisKey} stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorPrimary)" animationDuration={1500} />
                        </AreaChart>
                    </ResponsiveContainer>
                )

            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={360}>
                        <BarChart {...commonProps}>
                            <Defs />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                            <XAxis dataKey={xAxisKey} {...commonAxisProps} dy={10} angle={-15} textAnchor="end" />
                            <YAxis {...commonAxisProps} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary)/0.05)' }} />
                            <Bar dataKey={yAxisKey} fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={50} animationDuration={1000} />
                        </BarChart>
                    </ResponsiveContainer>
                )

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={360}>
                        <LineChart {...commonProps}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                            <XAxis dataKey={xAxisKey} {...commonAxisProps} dy={10} angle={-15} textAnchor="end" />
                            <YAxis {...commonAxisProps} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey={yAxisKey} stroke="hsl(var(--primary))" strokeWidth={4}
                                dot={{ r: 4, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                                activeDot={{ r: 8, strokeWidth: 0 }} animationDuration={1200} />
                        </LineChart>
                    </ResponsiveContainer>
                )

            case 'pie':
                return (
                    // Pie chart WITHOUT built-in Legend — we render our own below
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={aggregatedData}
                                cx="50%"
                                cy="50%"
                                innerRadius="30%"
                                outerRadius="55%"
                                paddingAngle={3}
                                dataKey={yAxisKey}
                                nameKey={xAxisKey}
                                animationDuration={1500}
                            >
                                {aggregatedData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                )

            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            {/* ── Controls ── */}
            <div className="flex flex-col gap-4 p-4 sm:p-6 bg-gradient-to-br from-card to-muted/20 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Settings2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold tracking-tight">Visualization Settings</h4>
                        <p className="text-xs text-muted-foreground">Adjust axes and chart type</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full">
                    {/* Chart type toggle */}
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</label>
                        <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
                            {[
                                { id: 'area', icon: AreaIcon },
                                { id: 'bar',  icon: BarChart3 },
                                { id: 'line', icon: LineIcon },
                                { id: 'pie',  icon: PieIcon },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setChartType(item.id)}
                                    className={cn(
                                        'p-2 rounded-md transition-all',
                                        chartType === item.id
                                            ? 'bg-background shadow-sm text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* X Axis */}
                    <div className="flex flex-col space-y-1.5 flex-1 min-w-[120px]">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">X Axis</label>
                        <select
                            value={xAxisKey}
                            onChange={e => setXAxisKey(e.target.value)}
                            className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            {keys.map(key => <option key={key} value={key}>{key}</option>)}
                        </select>
                    </div>

                    {/* Y Axis */}
                    <div className="flex flex-col space-y-1.5 flex-1 min-w-[120px]">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Y Axis</label>
                        <select
                            value={yAxisKey}
                            onChange={e => setYAxisKey(e.target.value)}
                            className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            {(numericKeys.length > 0 ? numericKeys : keys).map(key => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Chart ── */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />
                <div className="relative bg-card w-full p-4 sm:p-8 rounded-2xl border border-border shadow-xl backdrop-blur-sm">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            {yAxisKey} vs {xAxisKey}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Visualizing {aggregatedData.length} data points
                            {data.length !== aggregatedData.length && ` (aggregated from ${data.length} rows)`}
                        </p>
                    </div>

                    {/* Chart render */}
                    {renderChart()}

                    {/* Custom legend only for pie */}
                    {chartType === 'pie' && aggregatedData.length > 0 && (
                        <div className="mt-2 border-t border-border pt-3">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                                Legend
                            </p>
                            <CustomPieLegend
                                data={aggregatedData}
                                xAxisKey={xAxisKey}
                                yAxisKey={yAxisKey}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChartGenerator