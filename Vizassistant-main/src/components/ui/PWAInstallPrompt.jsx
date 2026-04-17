import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Sparkles, Wifi } from 'lucide-react'
import { useState } from 'react'
import { usePWAInstall } from '../../hooks/usePWAInstall'

const PWAInstallPrompt = () => {
    const { isInstallable, isInstalled, installApp } = usePWAInstall()
    const [dismissed, setDismissed] = useState(false)

    const show = isInstallable && !isInstalled && !dismissed

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 80, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 2 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[calc(100vw-2rem)] max-w-sm"
                >
                    <div className="relative overflow-hidden rounded-2xl border border-[#667D9D]/25 bg-[#0c1330]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(6,8,23,0.28)] p-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#16254F]/18 via-transparent to-[#667D9D]/8 pointer-events-none" />

                        {/* Top bar */}
                        <div className="flex items-start justify-between gap-3 relative">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16254F] to-[#667D9D] flex items-center justify-center shadow-lg shadow-[#060817]/20 shrink-0">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>

                                <div>
                                    <p className="text-sm font-black text-white leading-none mb-1">
                                        Install Vizassistance
                                    </p>
                                    <p className="text-[11px] text-white/50 font-medium leading-snug">
                                        Add to home screen for offline access & faster load times
                                    </p>
                                </div>
                            </div>

                            {/* Dismiss */}
                            <button
                                onClick={() => setDismissed(true)}
                                className="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Features row */}
                        <div className="flex items-center gap-3 mt-3 mb-4 px-1">
                            {[
                                { icon: Wifi, label: 'Works offline' },
                                { icon: Download, label: 'Instant load' },
                                { icon: Sparkles, label: 'Full features' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-1.5 text-[10px] text-white/40 font-semibold">
                                    <Icon className="h-3 w-3 text-[#ACBBC6]" />
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 relative">
                            <button
                                onClick={() => setDismissed(true)}
                                className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-xs font-bold text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors"
                            >
                                Not now
                            </button>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={installApp}
                                className="flex-[2] py-2.5 rounded-xl bg-[#ACBBC6] text-xs font-black text-[#060817] shadow-lg shadow-[#060817]/20 hover:bg-[#bcc9d1] transition-colors flex items-center justify-center gap-2"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Install App
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PWAInstallPrompt
