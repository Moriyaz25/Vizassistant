import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Database, Calendar, Trash2, Loader2, Search, FileText, ChevronRight, AlertTriangle, X } from 'lucide-react'
import { db } from '../services/firebase'
import { collection, query, where, getDocs, doc, writeBatch, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

// ── Delete Confirm Modal ───────────────────────────────────────────────────
const DeleteModal = ({ dataset, onConfirm, onCancel, deleting }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card border border-border rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-red-500/10">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <button onClick={onCancel} disabled={deleting} className="p-2 rounded-xl hover:bg-muted transition-colors disabled:opacity-50">
                    <X className="h-5 w-5 text-zinc-400" />
                </button>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Delete Dataset?</h3>
            <p className="text-zinc-500 text-sm mb-1">You are about to delete:</p>
            <p className="text-foreground font-semibold text-sm mb-4 bg-muted px-4 py-2 rounded-xl truncate">
                {dataset?.file_name}
            </p>
            <p className="text-zinc-500 text-sm mb-8">
                All associated insights and charts will be permanently deleted from the database. This cannot be undone.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    disabled={deleting}
                    className="flex-1 py-3 rounded-2xl border border-border font-bold text-sm hover:bg-muted transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={deleting}
                    className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {deleting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Deleting...</>
                    ) : (
                        <><Trash2 className="h-4 w-4" /> Delete Forever</>
                    )}
                </button>
            </div>
        </motion.div>
    </div>
)

// ── Main Component ─────────────────────────────────────────────────────────
const History = () => {
    const { user } = useAuth()
    const [datasets, setDatasets]       = useState([])
    const [loading, setLoading]         = useState(true)
    const [searchTerm, setSearchTerm]   = useState('')
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting]       = useState(false)
    const [deleteError, setDeleteError] = useState(null)

    // ── Real-time listener ─────────────────────────────────────────────────
    useEffect(() => {
        if (!user) return

        const q = query(
            collection(db, 'datasets'),
            where('user_id', '==', user.uid)
        )

        const unsub = onSnapshot(q,
            (snap) => {
                const data = snap.docs
                    .map(d => ({
                        id: d.id,
                        ...d.data(),
                        upload_date: d.data().upload_date?.toDate?.()?.toISOString() || new Date().toISOString()
                    }))
                    .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
                setDatasets(data)
                setLoading(false)
            },
            (err) => {
                console.error('History listener error:', err)
                setLoading(false)
            }
        )

        return () => unsub()
    }, [user])

    // ── Delete handler ─────────────────────────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        setDeleteError(null)

        try {
            const batch = writeBatch(db)

            // 1. Delete all insights for this dataset
            const insightsSnap = await getDocs(
                query(collection(db, 'insights'), where('dataset_id', '==', deleteTarget.id))
            )
            insightsSnap.forEach(snap => batch.delete(snap.ref))

            // 2. Delete all charts for this dataset
            const chartsSnap = await getDocs(
                query(collection(db, 'charts'), where('dataset_id', '==', deleteTarget.id))
            )
            chartsSnap.forEach(snap => batch.delete(snap.ref))

            // 3. Delete the dataset itself
            batch.delete(doc(db, 'datasets', deleteTarget.id))

            // 4. Commit all deletes in one atomic write
            await batch.commit()

            // onSnapshot will auto-update the list — no manual setDatasets needed
            setDeleteTarget(null)
        } catch (err) {
            console.error('Delete error:', err)
            setDeleteError(err.message || 'Failed to delete. Please try again.')
        } finally {
            setDeleting(false)
        }
    }

    const filteredDatasets = datasets.filter(d =>
        d.file_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteTarget && (
                    <DeleteModal
                        dataset={deleteTarget}
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => { if (!deleting) { setDeleteTarget(null); setDeleteError(null) } }}
                        deleting={deleting}
                    />
                )}
            </AnimatePresence>

            {/* Error toast */}
            <AnimatePresence>
                {deleteError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-6 right-6 z-50 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-xl"
                    >
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {deleteError}
                        <button onClick={() => setDeleteError(null)} className="ml-2 hover:text-red-300">
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Dataset History</h1>
                    <p className="text-zinc-500 mt-1 font-medium">
                        {loading ? 'Loading...' : `${datasets.length} dataset${datasets.length !== 1 ? 's' : ''} stored`}
                    </p>
                </div>
                <div className="relative w-full md:w-72 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search datasets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    />
                </div>
            </header>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-[2.5rem]">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading History...</p>
                </div>
            ) : filteredDatasets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredDatasets.map((ds) => (
                            <motion.div
                                layout
                                key={ds.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="bg-card border border-border rounded-[2rem] p-6 hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden relative"
                            >
                                {/* Background icon — pointer-events-none so it never blocks clicks */}
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none select-none">
                                    <Database className="h-24 w-24 text-primary" />
                                </div>

                                {/* All interactive content sits above the bg icon */}
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setDeleteError(null); setDeleteTarget(ds) }}
                                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                                            title="Delete dataset"
                                            type="button"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold text-foreground mb-1 truncate pr-2">
                                        {ds.file_name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium mb-6">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(ds.upload_date).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                        <span>{ds.row_count?.toLocaleString() || 0} rows</span>
                                        {ds.column_count && <span>{ds.column_count} cols</span>}
                                    </div>

                                    <Link
                                        to={`/dashboard/insights?id=${ds.id}`}
                                        className="flex items-center justify-center gap-2 bg-muted text-foreground py-3 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
                                    >
                                        View Analysis
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-24 bg-card border-2 border-dashed border-border rounded-[2.5rem]">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-3xl inline-block mb-6">
                        <Database className="h-12 w-12 text-zinc-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No Datasets Found</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto mb-8">
                        {searchTerm
                            ? `No results for "${searchTerm}"`
                            : "You haven't uploaded any data yet. Start by importing a file."}
                    </p>
                    {!searchTerm && (
                        <Link
                            to="/dashboard/upload"
                            className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20"
                        >
                            Upload Your First Dataset
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}

export default History