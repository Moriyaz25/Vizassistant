import { BarChart3, Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <BarChart3 className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                Vizassistance
                            </span>
                        </div>
                        <p className="text-muted-foreground max-w-sm">
                            Transforming how you see data. AI-powered visualization platform for modern businesses and analysts.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-sm">
                    &copy; {new Date().getFullYear()} Vizassistance. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
