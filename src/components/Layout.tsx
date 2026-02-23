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

            <main className="flex-grow z-10">
                {children}
            </main>

            {!Capacitor.isNativePlatform() && <Footer />}

            {/* 
        Customized Neon Toast Notifications 
      */}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    className: '',
                    style: {
                        background: 'rgba(20, 20, 20, 0.9)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        border: '1px solid rgba(57, 255, 20, 0.5)',
                        boxShadow: '0 0 15px rgba(57, 255, 20, 0.3)', // neon-green
                        borderRadius: '8px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#39ff14', // neon-green
                            secondary: '#1a1a1a',
                        },
                    },
                }}
            />
        </div>
    );
};
