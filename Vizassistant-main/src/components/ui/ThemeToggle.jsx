import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

/**
 * Beautiful animated pill theme toggle.
 * Props:
 *   size?: 'sm' | 'md'  (default 'md')
 */
const ThemeToggle = ({ size = 'md' }) => {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    const pill = size === 'sm'
        ? { w: 'w-14', h: 'h-7', knob: 'w-5 h-5', icon: 'h-3 w-3', translate: 28 }
        : { w: 'w-16', h: 'h-8', knob: 'w-6 h-6', icon: 'h-3.5 w-3.5', translate: 32 }

    return (
        <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
            className={`
                relative inline-flex items-center ${pill.w} ${pill.h} rounded-full
                transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                ${isDark
                    ? 'bg-[#16254F] border border-[#667D9D]/40 shadow-[0_0_14px_rgba(102,125,157,0.2)]'
                    : 'bg-[#ECECEC] border border-[#ACBBC6] shadow-[0_0_14px_rgba(102,125,157,0.12)]'
                }
            `}
        >
            {/* Track icons */}
            <span className="absolute left-1.5 flex items-center text-[#ACBBC6] opacity-70">
                <Moon className={pill.icon} />
            </span>
            <span className="absolute right-1.5 flex items-center text-[#667D9D] opacity-70">
                <Sun className={pill.icon} />
            </span>

            {/* Sliding knob */}
            <motion.span
                layout
                animate={{
                    x: isDark ? 2 : pill.translate - 2,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className={`
                    absolute ${pill.knob} rounded-full flex items-center justify-center
                    shadow-md z-10
                    ${isDark
                        ? 'bg-gradient-to-br from-[#ACBBC6] to-[#667D9D] shadow-[#667D9D]/35'
                        : 'bg-gradient-to-br from-[#16254F] to-[#667D9D] shadow-[#16254F]/25'
                    }
                `}
            >
                <motion.span
                    animate={{ rotate: isDark ? 0 : 180 }}
                    transition={{ duration: 0.4 }}
                >
                    {isDark
                        ? <Moon className={`${pill.icon} text-white`} />
                        : <Sun className={`${pill.icon} text-white`} />
                    }
                </motion.span>
            </motion.span>
        </button>
    )
}

export default ThemeToggle
