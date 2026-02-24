
import { Github, Twitter, Linkedin, Instagram, Shield, Zap, Globe } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full border-t border-white/10 bg-black/60 backdrop-blur-2xl py-16 mt-auto relative z-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-white/10 pb-12">
                    {/* Brand & About */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="text-3xl font-black text-white tracking-tighter">
                            Gravity<span className="text-neon-cyan">PDF</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
                            GravityPDF is a local-first PDF toolkit built for security and speed.
                            We process everything directly in your browser using WebAssembly—meaning your sensitive data never leaves your device or touches a server.
                        </p>
                        <div className="flex items-center gap-4 text-gray-500 pt-2">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-cyan/20 hover:text-neon-cyan hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all border border-white/10"><Twitter className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all border border-white/10"><Github className="w-4 h-4" /></a>
                            <a href="https://www.linkedin.com/in/bharath-c-srinivasan/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-electric-blue/20 hover:text-electric-blue hover:shadow-[0_0_15px_rgba(0,123,255,0.4)] transition-all border border-white/10"><Linkedin className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-magenta/20 hover:text-neon-magenta hover:shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-all border border-white/10"><Instagram className="w-4 h-4" /></a>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="lg:col-span-4 lg:pl-8">
                        <h3 className="text-white font-bold mb-6 text-sm tracking-wider flex items-center gap-2">
                            <Zap className="w-4 h-4 text-neon-cyan" /> POWERFUL TOOLS
                        </h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-gray-400 text-sm">
                            <a href="/merge" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Merge PDF</a>
                            <a href="/split" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Split PDF</a>
                            <a href="/rotate" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Rotate PDF</a>
                            <a href="/compress" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Compress PDF</a>
                            <a href="/delete-pages" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Delete Pages</a>
                            <a href="/reorder-pages" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Reorder Pages</a>
                            <a href="/add-blank-pages" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Blank Pages</a>
                            <a href="/image-to-pdf" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Image to PDF</a>
                            <a href="/pdf-to-image" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> PDF to Image</a>
                            <a href="/text-to-pdf" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Text to PDF</a>
                            <a href="/png-to-pdf" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> PNG to PDF</a>
                            <a href="/add-watermark" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Watermark</a>
                            <a href="/add-page-numbers" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Page Numbers</a>
                            <a href="/edit-metadata" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Edit Metadata</a>
                            <a href="/flatten-pdf" className="hover:text-neon-cyan transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="w-1 h-1 rounded-full bg-white/20" /> Flatten PDF</a>
                        </div>
                    </div>

                    {/* Resources & Security */}
                    <div className="lg:col-span-4 space-y-10">
                        <div>
                            <h3 className="text-white font-bold mb-6 text-sm tracking-wider flex items-center gap-2">
                                <Shield className="w-4 h-4 text-neon-green" /> TRUST & PRIVACY
                            </h3>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5"><div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#22d3ee]" /> 100% Client-Side Processing</li>
                                <li className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5"><div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_#39ff14]" /> Zero Data Collection</li>
                                <li className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5"><div className="w-2 h-2 rounded-full bg-neon-magenta shadow-[0_0_8px_#d946ef]" /> Free & Open Source</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-4 text-sm tracking-wider">STAY UPDATED</h3>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan w-full transition-colors"
                                />
                                <button className="bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-black border border-neon-cyan px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <div className="text-gray-500 text-[10px] md:text-sm font-mono">
                            © {new Date().getFullYear()} GravityPDF. Crafted by <a href="#" className="text-neon-cyan hover:text-white underline decoration-neon-cyan/30 underline-offset-4">Bharath CS</a>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]">
                            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_5px_#39ff14]" />
                            System Status: Operational
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] md:text-xs uppercase tracking-[0.2em] font-mono text-gray-500">
                        <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"><Globe className="w-3.5 h-3.5 text-neon-magenta" /> Global CDN</span>
                        <span className="hidden sm:inline">Version 2.5.0-Stable</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
