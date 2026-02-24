import React from 'react';
import { Toaster } from 'react-hot-toast';
import { SideDock } from './SideDock';
import { Capacitor } from '@capacitor/core';
import { Footer } from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="relative min-h-screen flex flex-col pt-16">
            <SideDock />

            <main className="flex-grow">
                {children}
            </main>

            {!Capacitor.isNativePlatform() && <Footer />}

            {/* 
        Customized Neon Toast Notifications 
      */}
            <Toaster
                position="bottom-center"
                toastOptions={{
                    className: 'dark:bg-[#1a1a1a] dark:text-white bg-white text-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl rounded-xl px-6 py-3 font-medium text-sm transition-all duration-300',
                    style: {
                        background: 'transparent', // controlled by tailwind classes in className
                        border: 'none',
                        boxShadow: 'none',
                    },
                    success: {
                        iconTheme: {
                            primary: '#22d3ee', // neon-cyan
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </div>
    );
};
