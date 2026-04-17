import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Database, Calendar, Trash2, Loader2, Search, FileText, ChevronRight, AlertTriangle, X } from 'lucide-react'
import { db } from '../services/firebase'
import { collection, query, where, getDocs, doc, writeBatch } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

// Custom Confirm Modal
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
                <button onClick={onCancel} className="p-2 rounded-xl hover:bg-muted transition-colors">
                    <X className="h-5 w-5 text-zinc-400" />
                </button>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Delete Dataset?</h3>
            <p className="text-zinc-500 text-sm mb-1">
                You are about to delete:
            </p>
            <p className="text-foreground font-semibold text-sm mb-4 bg-muted px-4 py-2 rounded-xl truncate">
                {dataset?.file_name}
            </p>
            <p className="text-zinc-500 text-sm mb-8">
                All associated insights and charts will be permanently lost. This action cannot be undone.
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
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    </div>
)

const History = () => {
    const { user } = useAuth()
    const [datasets, setDatasets] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [deleteTarget, setDeleteTarget] = useState(null) // dataset to delete
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        if (user) fetchHistory()
    }, [user])

    const fetchHistory = async () => {
        setLoading(true)
        try {
            const q = query(
                collection(db, 'datasets'),
                where('user_id', '==', user.uid)
            )
            const querySnapshot = await getDocs(q)
            const data = querySnapshot.docs
                .map(snapshot => ({
                    id: snapshot.id,
                    ...snapshot.data(),
                    upload_date: snapshot.data().upload_date?.toDate?.()?.toISOString() || new Date().toISOString()
                }))
                .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
            setDatasets(data)
        } catch (err) {
            console.error('Error fetching history:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            const batch = writeBatch(db)

            const insightsSnap = await getDocs(query(collection(db, 'insights'), where('dataset_id', '==', deleteTarget.id)))
            insightsSnap.forEach(snapshot => batch.delete(snapshot.ref))

            const chartsSnap = await getDocs(query(collection(db, 'charts'), where('dataset_id', '==', deleteTarget.id)))
            chartsSnap.forEach(snapshot => batch.delete(snapshot.ref))

            batch.delete(doc(db, 'datasets', deleteTarget.id))

            await batch.commit()
            setDatasets(prev => prev.filter(d => d.id !== deleteTarget.id))
            setDeleteTarget(null)
        } catch (err) {
            console.error('Delete error:', err)
            alert(`Failed to delete: ${err.message || 'Unknown error'}`)
        } finally {
            setDeleting(false)
        }
    }

    const filteredDatasets = datasets.filter(d =>
        d.file_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteTarget && (
                    <DeleteModal
                        dataset={deleteTarget}
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => !deleting && setDeleteTarget(null)}
                        deleting={deleting}
                    />
                )}
            </AnimatePresence>

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Dataset History</h1>
                    <p className="text-zinc-500 mt-1 font-medium">Manage and revisit your previously analyzed data.</p>
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

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-[2.5rem]">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Retrieving Archives...</p>
                </div>
            ) : filteredDatasets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredDatasets.map((ds) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={ds.id}
                                className="bg-card border border-border rounded-[2rem] p-6 hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                    <Database className="h-24 w-24 text-primary" />
                                </div>

                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <button
                                        onClick={() => setDeleteTarget(ds)}
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold text-foreground mb-1 truncate pr-8">{ds.file_name}</h3>
                                <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium mb-6">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(ds.upload_date).toLocaleDateString()}
                                    </span>
                                    <span>{ds.row_count} rows</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/dashboard/insights?id=${ds.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 bg-muted text-foreground py-3 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
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
                        {searchTerm ? "No results match your search query." : "You haven't uploaded any data yet. Start your journey by importing a file."}
                    </p>
                    <Link to="/dashboard/upload" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20">
                        Upload Your First Dataset
                    </Link>
                </div>
            )}
        </div>
    )
}

export default History