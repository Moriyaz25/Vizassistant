import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'Perfect for individual analysts and small projects.',
        features: [
            'Up to 3 Data Uploads/mo',
            'Basic AI Insights',
            'Standard Chart Types',
            'CSV Export only',
            'Community Support'
        ],
        buttonText: 'Get Started',
        highlight: false
    },
    {
        name: 'Professional',
        price: '$29',
        priceSuffix: '/mo',
        description: 'Advanced features for scaling data teams.',
        features: [
            'Unlimited Data Uploads',
            'Advanced AI Predictor',
            'Custom Chart Architect',
            'PDF & PNG High-Res Export',
            'Priority Email Support',
            'Early Access Features'
        ],
        buttonText: 'Go Pro',
        highlight: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'Dedicated infrastructure for large organizations.',
        features: [
            'Custom AI Model Training',
            'White-label Reports',
            'SSO & Advanced Security',
            'Dedicated Account Manager',
            '24/7 Phone Support',
            'SLA Guarantee'
        ],
        buttonText: 'Contact Sales',
        highlight: false
    }
]

const Pricing = () => {
    return (
        <section id="pricing" className="py-20 relative overflow-hidden bg-[#0a0a0f]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-bold text-primary tracking-[0.12em] uppercase mb-4"
                    >
                        <Sparkles className="h-3 w-3" />
                        Flexible Plans
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black text-white mb-4 tracking-[-0.03em] leading-tight"
                    >
                        Pricing that Scales{' '}
                        <br />
                        <span className="bg-gradient-to-r from-white/30 via-white/50 to-white/20 bg-clip-text text-transparent">
                            With Your Data.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-white/50 leading-relaxed tracking-wide"
                    >
                        Start free and upgrade as your team grows. No hidden fees.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`glass-card p-8 flex flex-col ${plan.highlight ? 'border-primary/50 relative' : 'border-white/5'}`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-white/50 tracking-[0.12em] uppercase mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-white tracking-tight">{plan.price}</span>
                                    {plan.priceSuffix && <span className="text-white/40 font-bold text-sm">{plan.priceSuffix}</span>}
                                </div>
                                <p className="mt-3 text-white/40 text-sm font-medium leading-relaxed">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-3 mb-8 flex-grow">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <Check className="h-2.5 w-2.5 text-primary" />
                                        </div>
                                        <span className="text-white/70 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to={plan.name === 'Enterprise' ? 'mailto:sales@vizassistance.ai' : '/signup'}
                                className={`w-full py-3.5 rounded-xl text-center font-bold transition-all duration-300 text-sm ${plan.highlight
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40'
                                    : 'glass text-white hover:bg-white/10 border-white/10'
                                    }`}
                            >
                                {plan.buttonText}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Pricing
