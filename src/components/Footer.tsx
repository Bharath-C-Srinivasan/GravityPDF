
import { Github, Twitter, Linkedin, Instagram, Shield, Zap, Globe } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full border-t border-white/10 bg-black/60 backdrop-blur-2xl py-16 mt-auto relative z-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand & About */}
                    <div className="space-y-6">
                        <div className="text-3xl font-black text-white tracking-tighter">
                            Gravity<span className="text-neon-cyan">PDF</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base max-w-xs">
                            GravityPDF is a local-first PDF toolkit built for security and speed.
                            We process everything directly in your browser using WebAssembly—meaning your data never touches a server.
                        </p>
                        <div className="flex items-center gap-4 text-gray-500">
                            <a href="#" className="hover:text-neon-cyan transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="https://www.linkedin.com/in/bharath-c-srinivasan/" target="_blank" rel="noopener noreferrer" className="hover:text-electric-blue transition-colors"><Linkedin className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-neon-magenta transition-colors"><Instagram className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4 text-neon-cyan" /> Features
                        </h3>
                        <ul className="grid grid-cols-2 lg:grid-cols-1 gap-3 text-gray-400 text-sm">
                            <li><a href="/merge" className="hover:text-neon-cyan transition-colors">Merge PDF</a></li>
                            <li><a href="/split" className="hover:text-neon-cyan transition-colors">Split & Extract</a></li>
                            <li><a href="/rotate" className="hover:text-neon-cyan transition-colors">Rotate Pages</a></li>
                            <li><a href="/compress" className="hover:text-neon-cyan transition-colors">Compress Size</a></li>
                            <li><a href="/image-to-pdf" className="hover:text-neon-cyan transition-colors">Image to PDF</a></li>
                            <li><a href="/pdf-to-image" className="hover:text-neon-cyan transition-colors">PDF to Image</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                            Resources
                        </h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">GitHub Repository</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">WebAssembly Guide</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Browser Security</a></li>
                        </ul>
                    </div>

                    {/* Company/Trust */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                                <Shield className="w-4 h-4 text-neon-green" /> Trust & Privacy
                            </h3>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" /> 100% Client-Side</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-green" /> No Data Collection</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-magenta" /> Open Source Code</li>
                                <li><a href="#" className="hover:text-white transition-colors mt-2 block font-medium">Privacy Policy →</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <div className="text-gray-500 text-[10px] md:text-xs font-mono">
                            © {new Date().getFullYear()} GravityPDF. Crafted by <a href="#" className="text-gray-400 hover:text-white">Bharath CS</a>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">
                            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                            System Status: Operational
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-mono text-gray-500">
                        <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Global CDN</span>
                        <span className="hidden sm:inline">Version 2.4.0-Stable</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
