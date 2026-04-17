import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { TrendingUp, Zap, Loader2, AlertTriangle, Sparkles, Database, MessageSquare, Send, ArrowLeft, Download, FileText, Image, FileDown, ChevronDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { generateInsights, askAI } from '../services/aiService'
import { db } from '../services/firebase'
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import ChartGenerator from '../components/charts/ChartGenerator'
import { downloadChartAsPNG, exportFullReportAsPDF, exportDataAsCSV, exportInsightsAsTxt } from '../utils/downloadUtils'

const InsightsPage = () => {
    const [searchParams] = useSearchParams()
    const datasetId = searchParams.get('id')

    const [dataset, setDataset] = useState(null)
    const [insights, setInsights] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Download state
    const [downloading, setDownloading] = useState(false)
    const [showDownloadMenu, setShowDownloadMenu] = useState(false)
    const downloadMenuRef = useRef(null)

    // Chat State
    const [query, setQuery] = useState('')
    const [chatHistory, setChatHistory] = useState([])
    const [chatLoading, setChatLoading] = useState(false)

    // Close download menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target)) {
                setShowDownloadMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const fetchDataset = async (id) => {
            setLoading(true)
            setError(null)
            try {
                const docRef = doc(db, 'datasets', id)
                const docSnap = await getDoc(docRef)

                if (!docSnap.exists()) {
                    setError("Dataset not found.")
                    setLoading(false)
                    return
                }
                const data = { id: docSnap.id, ...docSnap.data() }
                setDataset(data)

                // Check if insights already exist for this dataset
                const q = query(collection(db, 'insights'), where('dataset_id', '==', id))
                const querySnapshot = await getDocs(q)

                if (!querySnapshot.empty) {
                    setInsights(querySnapshot.docs[0].data().summary_text)
                } else if (data && data.raw_data) {
                    handleGenerateInsights(data.raw_data)
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load dataset")
            } finally {
                setLoading(false)
            }
        }

        if (datasetId) {
            fetchDataset(datasetId)
        }
    }, [datasetId])

    const handleDownload = async (type) => {
        setShowDownloadMenu(false)
        setDownloading(true)
        try {
            const name = dataset?.file_name?.replace(/\.[^.]+$/, '') || 'analysis'
            if (type === 'png') await downloadChartAsPNG('chart-capture', `${name}_chart.png`)
            else if (type === 'pdf') await exportFullReportAsPDF('chart-capture', insights, name)
            else if (type === 'csv') exportDataAsCSV(dataset?.raw_data || [], `${name}.csv`)
            else if (type === 'txt') exportInsightsAsTxt(insights, `${name}_insights.txt`)
        } finally {
            setDownloading(false)
        }
    }

    const handleGenerateInsights = useCallback(async (dataToAnalyze) => {
        if (!dataToAnalyze || dataToAnalyze.length === 0) return

        setLoading(true)
        setError(null)
        try {
            const aiResult = await generateInsights(dataToAnalyze)

            if (aiResult?.startsWith("QUOTA_EXCEEDED:")) {
                setInsights(aiResult.replace("QUOTA_EXCEEDED: ", ""))
                setError("AI Quota exceeded - showing limit message")
            } else if (aiResult?.startsWith("AI_UNAVAILABLE:")) {
                setInsights(null)
                setError("AI Service Unavailable: Missing API Key")
            } else if (aiResult?.startsWith("ERROR:")) {
                setInsights(null)
                setError(aiResult.replace("ERROR: ", ""))
            } else {
                setInsights(aiResult)
                try {
                    await addDoc(collection(db, 'insights'), {
                        dataset_id: datasetId,
                        summary_text: aiResult,
                        created_at: serverTimestamp()
                    })
                } catch (saveError) {
                    console.error("Error saving insights:", saveError)
                }
            }
        } catch (e) {
            console.error(e)
            setError("AI analysis failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [datasetId])

    const handleAskAI = async (e) => {
        e.preventDefault()
        if (!query.trim() || !dataset) return

        const userMsg = { role: 'user', content: query }
        setChatHistory(prev => [...prev, userMsg])
        setQuery('')
        setChatLoading(true)

        try {
            const response = await askAI(query, dataset.raw_data || [])
            const aiMsg = { role: 'assistant', content: response }
            setChatHistory(prev => [...prev, aiMsg])
        } catch (err) {
            console.error(err)
            const errorMsg = { role: 'assistant', content: "Sorry, I couldn't process that query. Please try again." }
            setChatHistory(prev => [...prev, errorMsg])
        } finally {
            setChatLoading(false)
        }
    }

    if (!datasetId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="bg-primary/10 p-6 rounded-3xl">
                    <Database className="h-12 w-12 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">No Dataset Selected</h2>
                    <p className="text-zinc-500 max-w-sm mx-auto mt-2">Please upload a dataset or select one from your history to see AI insights.</p>
                </div>
                <Link to="/dashboard/upload" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold">
                    Go to Upload
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/history" className="p-2 hover:bg-muted rounded-xl transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">AI Intelligence</h1>
                        <p className="text-zinc-500 font-medium">Analyzing: {dataset?.file_name || 'Loading...'}</p>
                    </div>
                </div>

                    <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="h-3 w-3" />
                        Groq AI Active
                    </div>

                    {/* Download Dropdown */}
                    <div className="relative" ref={downloadMenuRef}>
                        <button
                            onClick={() => setShowDownloadMenu(v => !v)}
                            disabled={downloading || !dataset}
                            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {downloading
                                ? <><Loader2 className="h-4 w-4 animate-spin" /> Exporting...</>
                                : <><Download className="h-4 w-4" /> Export <ChevronDown className="h-3 w-3" /></>
                            }
                        </button>

                        <AnimatePresence>
                            {showDownloadMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-2xl shadow-black/30 overflow-hidden z-50"
                                >
                                    {[ 
                                        { type: 'pdf', icon: FileText, label: 'Full Report', sub: 'Chart + AI insights (PDF)', color: 'text-red-400' },
                                        { type: 'png', icon: Image, label: 'Chart Image', sub: 'High-res PNG', color: 'text-primary' },
                                        { type: 'csv', icon: FileDown, label: 'Raw Data', sub: 'Spreadsheet (CSV)', color: 'text-green-400' },
                                        { type: 'txt', icon: FileText, label: 'AI Insights', sub: 'Plain text report', color: 'text-[#667D9D]' },
                                    ].map(item => (
                                        <button
                                            key={item.type}
                                            onClick={() => handleDownload(item.type)}
                                            disabled={item.type === 'txt' && !insights}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors text-left group disabled:opacity-40"
                                        >
                                            <div className={`p-1.5 rounded-lg bg-muted group-hover:scale-110 transition-transform`}>
                                                <item.icon className={`h-4 w-4 ${item.color}`} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{item.label}</p>
                                                <p className="text-[10px] text-zinc-500">{item.sub}</p>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Analysis Area */}
                <div className="lg:col-span-2 space-y-8">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center justify-between gap-4 text-red-500 mb-6"
                        >
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 shrink-0" />
                                <p className="text-sm font-bold">{error}</p>
                            </div>
                            <button
                                onClick={() => dataset && handleGenerateInsights(dataset.raw_data || [])}
                                className="text-xs font-black uppercase tracking-widest bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors"
                            >
                                Retry AI
                            </button>
                        </motion.div>
                    )}

                    {/* Visual Analytics */}
                    <motion.div
                        id="chart-capture"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                    >
                        <ChartGenerator data={dataset?.raw_data || []} />
                    </motion.div>

                    {loading ? (
                        <div className="bg-card border border-border rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                            <h3 className="text-xl font-bold">Generating Insights...</h3>
                            <p className="text-zinc-500">Extracting signals from your data noise</p>
                        </div>
                    ) : insights ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-primary/5"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-primary/10 p-2 rounded-xl">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black">Strategic Report</h2>
                            </div>

                            <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-black">
                                <ReactMarkdown>{insights}</ReactMarkdown>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-card border border-border rounded-[2.5rem] p-20 text-center">
                            <Sparkles className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold">No Insights Yet</h3>
                            <button
                                onClick={() => handleGenerateInsights(dataset?.raw_data || [])}
                                className="text-primary font-bold mt-4 hover:underline"
                            >
                                Generate Analysis Now
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar: AI Chat */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-[2.5rem] flex flex-col h-[600px] shadow-xl">
                        <div className="p-6 border-b border-border flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-xl text-primary">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold">Natural Query</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {chatHistory.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-sm text-zinc-500 italic">Ask anything about this dataset...</p>
                                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                        {["Top 3 trends?", "Data outliers?", "Future forecast?"].map(tip => (
                                            <button
                                                key={tip}
                                                onClick={() => setQuery(tip)}
                                                className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-muted rounded-lg hover:bg-emphasis transition-colors"
                                            >
                                                {tip}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-primary text-white text-right rounded-tr-none'
                                        : 'bg-muted text-foreground rounded-tl-none'
                                        }`}>
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            {chatLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none">
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleAskAI} className="p-4 border-t border-border bg-muted/30">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Type your question..."
                                    className="w-full bg-card border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!query.trim() || chatLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InsightsPage
