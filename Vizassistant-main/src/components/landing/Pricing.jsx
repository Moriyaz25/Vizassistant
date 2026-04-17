import { motion } from 'framer-motion'
import { Check, Sparkles, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'Good for individual experimentation and college project demos.',
        features: ['Up to 3 uploads/mo', 'Basic AI insights', 'Standard chart types', 'CSV export only', 'Community support'],
        buttonText: 'Get Started',
        highlight: false,
        buttonLink: '/signup',
    },
    {
        name: 'Professional',
        price: '$29',
        priceSuffix: '/mo',
        description: 'Advanced features for teams that need deeper analysis and polished exports.',
        features: ['Unlimited uploads', 'Advanced AI insights', 'Custom chart selection', 'PDF & PNG export', 'Priority support', 'Early access features'],
        buttonText: 'Go Pro',
        highlight: true,
        buttonLink: '/signup',
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'A tailored setup for organizations with larger data and support needs.',
        features: ['Custom model tuning', 'White-label reports', 'SSO & security', 'Dedicated manager', '24/7 support', 'SLA guarantee'],
        buttonText: 'Contact Sales',
        buttonLink: 'mailto:sales@vizassistance.ai',
    },
]

const Pricing = () => {
    const { user } = useAuth()

    return (
        <section id="pricing" className="py-24 relative overflow-hidden bg-[#060817]">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#16254F]/18 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#667D9D]/12 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full border border-[#667D9D]/35 bg-[#16254F]/55 px-4 py-1.5 text-xs font-bold text-[#ACBBC6] tracking-[0.12em] uppercase mb-5"
                    >
                        <Sparkles className="h-3 w-3" />
                        Flexible Plans
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-white mb-4 tracking-[-0.03em] leading-tight"
                    >
                        Pricing that Scales{' '}
                        <br />
                        <span className="bg-gradient-to-r from-white via-[#ACBBC6] to-[#667D9D] bg-clip-text text-transparent">
                            With Your Data.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-white/50 leading-relaxed"
                    >
                        Start free and upgrade only if your project or team needs more.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative glass-card flex flex-col border ${plan.highlight ? 'border-[#667D9D]/35' : 'border-white/[0.06]'}`}
                        >
                            {plan.highlight && (
                                <>
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-5 py-1.5 bg-[#ACBBC6] text-[#060817] text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-[#060817]/15">
                                        <Zap className="h-3 w-3" />
                                        Most Popular
                                    </div>
                                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#ACBBC6] to-transparent" />
                                </>
                            )}

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="mb-7">
                                    <h3 className="text-xs font-black text-white/40 tracking-[0.15em] uppercase mb-3">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-3">
                                        <span className="text-5xl font-black text-white tracking-tight">{plan.price}</span>
                                        {plan.priceSuffix && <span className="text-white/40 font-bold text-base">{plan.priceSuffix}</span>}
                                    </div>
                                    <p className="text-white/42 text-sm leading-relaxed">{plan.description}</p>
                                </div>

                                <div className="space-y-3 mb-8 flex-grow">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3">
                                            <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-[#667D9D]/20' : 'bg-white/[0.06]'}`}>
                                                <Check className={`h-3 w-3 ${plan.highlight ? 'text-[#ACBBC6]' : 'text-white/40'}`} />
                                            </div>
                                            <span className="text-white/65 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    to={user && plan.highlight ? '/dashboard' : plan.buttonLink}
                                    className={`w-full py-4 rounded-2xl text-center font-black transition-colors duration-300 text-sm ${plan.highlight
                                        ? 'bg-[#ACBBC6] text-[#060817] hover:bg-[#bcc9d1]'
                                        : 'glass text-white border border-white/[0.08] hover:bg-white/[0.04]'
                                        }`}
                                >
                                    {user && plan.highlight ? 'Upgrade Plan' : plan.buttonText}
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Pricing
