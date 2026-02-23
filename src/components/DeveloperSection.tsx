import { Linkedin, Instagram } from 'lucide-react';
import developerImg from '../assets/developer_profile.jpg';
import { Capacitor } from '@capacitor/core';

export const DeveloperSection = ({ forceNativeShow = false }: { forceNativeShow?: boolean }) => {
    return (
        <section className="py-12 md:py-20 px-2 md:px-4 relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="glass-panel p-6 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 relative z-10">
                    {(!Capacitor.isNativePlatform() || forceNativeShow) && (
                        <div className="relative group flex-shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                                <img
                                    src={developerImg}
                                    alt="Bharath CS"
                                    className="w-full h-full object-cover transition-all duration-500 transform hover:scale-110"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-[10px] md:text-sm font-mono text-neon-cyan mb-2 tracking-widest uppercase">Developed By</h2>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Bharath CS
                        </h1>
                        <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-8 leading-relaxed max-w-xl">
                            Crafting seamless digital experiences with a focus on speed, security, and cutting-edge browser technologies. GravityPDF is a testament to the power of client-side computing.
                        </p>

                        <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6">
                            <a
                                href="https://www.linkedin.com/in/bharath-c-srinivasan/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative p-3 rounded-2xl glass-panel hover:border-electric-blue transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,119,181,0.4)] hover:-translate-y-1"
                                title="Connect on LinkedIn"
                            >
                                <Linkedin className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-electric-blue transition-colors" />
                            </a>

                            <a
                                href="https://www.instagram.com/bharath.srinivasan_?igsh=Ymtkbngwa2twYWE0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative p-3 rounded-2xl glass-panel hover:border-neon-magenta transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,234,0.4)] hover:-translate-y-1"
                                title="Follow on Instagram"
                            >
                                <Instagram className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-neon-magenta transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-neon-cyan/10 rounded-full blur-[80px] md:blur-[100px] -z-10"></div>
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-neon-magenta/10 rounded-full blur-[80px] md:blur-[100px] -z-10"></div>
        </section>
    );
};
