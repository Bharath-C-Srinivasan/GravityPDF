import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layers, MoreVertical, X, ChevronDown, Sun, Moon, Search, Smartphone, FolderOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { Layout } from './components/Layout';
import Dashboard from './pages/index';
import MergeTool from './pages/merge';
import SplitTool from './pages/split';
import ImageToPDFTool from './pages/image-to-pdf';
import RotateTool from './pages/rotate';
import CompressTool from './pages/compress';
import PDFToImageTool from './pages/pdf-to-image';
import TextToPDFTool from './pages/text-to-pdf';
import PNGToPDFTool from './pages/png-to-pdf';
import AddWatermarkTool from './pages/add-watermark';
import AddPageNumbersTool from './pages/add-page-numbers';
import DeletePagesTool from './pages/delete-pages';
import ReorderPagesTool from './pages/reorder-pages';
import AddBlankPagesTool from './pages/add-blank-pages';
import EditMetadataTool from './pages/edit-metadata';
import FlattenPDFTool from './pages/flatten-pdf';
import SavedFiles from './pages/saved-files';
import AboutPage from './pages/about';
import './App.css';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = ({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (q: string) => void }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Dashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} /></PageTransition>} />
        <Route path="/merge" element={<PageTransition><MergeTool /></PageTransition>} />
        <Route path="/split" element={<PageTransition><SplitTool /></PageTransition>} />
        <Route path="/image-to-pdf" element={<PageTransition><ImageToPDFTool /></PageTransition>} />
        <Route path="/rotate" element={<PageTransition><RotateTool /></PageTransition>} />
        <Route path="/compress" element={<PageTransition><CompressTool /></PageTransition>} />
        <Route path="/pdf-to-image" element={<PageTransition><PDFToImageTool /></PageTransition>} />
        <Route path="/text-to-pdf" element={<PageTransition><TextToPDFTool /></PageTransition>} />
        <Route path="/png-to-pdf" element={<PageTransition><PNGToPDFTool /></PageTransition>} />
        <Route path="/add-watermark" element={<PageTransition><AddWatermarkTool /></PageTransition>} />
        <Route path="/add-page-numbers" element={<PageTransition><AddPageNumbersTool /></PageTransition>} />
        <Route path="/delete-pages" element={<PageTransition><DeletePagesTool /></PageTransition>} />
        <Route path="/reorder-pages" element={<PageTransition><ReorderPagesTool /></PageTransition>} />
        <Route path="/add-blank-pages" element={<PageTransition><AddBlankPagesTool /></PageTransition>} />
        <Route path="/edit-metadata" element={<PageTransition><EditMetadataTool /></PageTransition>} />
        <Route path="/flatten-pdf" element={<PageTransition><FlattenPDFTool /></PageTransition>} />
        <Route path="/saved-files" element={<PageTransition><SavedFiles /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><Dashboard /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const AndroidBackButtonHandler = () => {
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let backListenerUrl = location.pathname;

    const handleBackButton = async () => {
      if (backListenerUrl === '/' || backListenerUrl === '') {
        // If on the dashboard, exit the app
        await CapacitorApp.exitApp();
      } else {
        // If deeper in the app, navigate back one step like a browser
        window.history.back();
      }
    };

    const backButtonListener = CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      backButtonListener.then(listener => listener.remove());
    };
  }, [location.pathname]);

  return null; // This is a logic-only component
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    // Check local storage or default to dark mode
    const stored = localStorage.getItem('gravitypdf-theme');
    if (stored) return stored === 'dark';
    return true; // Default dark
  });

  // Apply theme class to HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('gravitypdf-theme', isDark ? 'dark' : 'light');

    // Apply native UI feeling class if running as Android/iOS App
    if (Capacitor.isNativePlatform()) {
      window.document.body.classList.add('capacitor-native');
    }
  }, [isDark]);

  const allTools = [
    { name: 'Merge PDF', path: '/merge' },
    { name: 'Split PDF', path: '/split' },
    { name: 'Rotate PDF', path: '/rotate' },
    { name: 'Compress PDF', path: '/compress' },
    { name: 'Delete Pages', path: '/delete-pages' },
    { name: 'Reorder Pages', path: '/reorder-pages' },
    { name: 'Add Blank Pages', path: '/add-blank-pages' },
    { name: 'Image to PDF', path: '/image-to-pdf' },
    { name: 'PDF to Image', path: '/pdf-to-image' },
    { name: 'Text to PDF', path: '/text-to-pdf' },
    { name: 'PNG to PDF', path: '/png-to-pdf' },
    { name: 'Add Watermark', path: '/add-watermark' },
    { name: 'Add Page Numbers', path: '/add-page-numbers' },
    { name: 'Edit Metadata', path: '/edit-metadata' },
    { name: 'Flatten PDF', path: '/flatten-pdf' },
  ];

  return (
    <Router>
      <AndroidBackButtonHandler />
      <Layout>
        {/* Responsive Navigation Bar */}
        <header className={`bg-background/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-white/10 ${Capacitor.isNativePlatform() ? 'border-b' : 'border-b shadow-sm'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  to="/"
                  className="text-xl md:text-2xl font-bold tracking-tight text-white hover:text-neon-cyan transition-colors text-glow-cyan flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Layers className="h-6 w-6 md:h-7 md:w-7 text-neon-cyan" />
                  <span className="flex items-center">Gravity<span className="text-neon-cyan">PDF</span></span>
                </Link>
              </div>

              {/* Desktop Search Bar */}
              <div className="hidden md:flex flex-1 max-w-md mx-6 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-neon-cyan transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (window.location.pathname !== '/') {
                      window.location.assign('/');
                    }
                  }}
                  placeholder="Search for tools..."
                  className="w-full bg-white/10 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-full py-1.5 pl-10 pr-4 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-sm placeholder:text-gray-500 shadow-sm dark:shadow-none"
                />
              </div>

              {/* Download App for Android Button */}
              {!Capacitor.isNativePlatform() && (
                <a
                  href="/downloads/GravityPDF.apk"
                  download="GravityPDF.apk"
                  className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-bold px-4 py-1.5 rounded-full text-sm hover:opacity-90 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] mr-4 whitespace-nowrap"
                >
                  <Smartphone className="w-4 h-4" />
                  Download App for Android
                </a>
              )}

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center space-x-8 z-50">
                <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-neon-cyan transition-colors">
                  About
                </Link>
                <div className="group flex items-center h-16">
                  <button className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-neon-cyan transition-colors focus:outline-none h-full">
                    All Tools <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="fixed top-16 left-1/2 -translate-x-1/2 w-[800px] max-w-[95vw] bg-black/95 backdrop-blur-2xl border border-white/10 rounded-b-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 p-8 border-t-0 z-50">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-b-2xl pointer-events-none" />
                    {allTools.map(tool => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="relative z-10 block px-4 py-3 text-sm font-bold text-gray-300 hover:text-neon-cyan bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-neon-cyan/30 hover:shadow-[0_0_15px_rgba(0,243,255,0.15)] text-center"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Desktop Theme Toggle Switch */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:ring-offset-2 focus:ring-offset-background ${isDark ? 'bg-white/10 border border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]' : 'bg-gray-200 border border-gray-300 shadow-inner'}`}
                  aria-label="Toggle theme"
                  title="Toggle Light/Dark Mode"
                >
                  <span className="sr-only">Toggle theme</span>
                  <span className="absolute inset-x-0 flex justify-between px-2 w-full pointer-events-none text-xs z-0">
                    <Moon className={`w-3.5 h-3.5 transition-opacity ${isDark ? 'text-white' : 'text-gray-400 opacity-50'}`} />
                    <Sun className={`w-3.5 h-3.5 transition-opacity ${isDark ? 'text-gray-500 opacity-50' : 'text-orange-500'}`} />
                  </span>
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out z-10 ${isDark ? 'translate-x-1 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'translate-x-8 shadow-md'}`}
                  />
                </button>
              </nav>

              {/* Native App Saved Files Icon */}
              {Capacitor.isNativePlatform() && (
                <div className="flex items-center ml-2 mr-2">
                  <Link
                    to="/saved-files"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none flex items-center justify-center relative group"
                    title="View Saved PDFs"
                  >
                    <FolderOpen className="w-6 h-6" />
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-cyan"></span>
                    </span>
                  </Link>
                </div>
              )}

              {/* Mobile Actions Container */}
              <div className="lg:hidden flex items-center gap-3 sm:gap-4 flex-1 justify-end">
                {/* Mobile Download APK Button */}
                {!Capacitor.isNativePlatform() && (
                  <a
                    href="/downloads/GravityPDF.apk"
                    download="GravityPDF.apk"
                    className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-bold px-3 py-1.5 rounded-full text-[10px] sm:text-xs hover:opacity-90 transition-all shadow-md mr-1"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Get App</span>
                    <span className="sm:hidden">App</span>
                  </a>
                )}

                {/* Mobile Theme Toggle Switch */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${isDark ? Capacitor.isNativePlatform() ? 'bg-white/10 border border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]' : 'bg-white/10 border border-white/20' : 'bg-gray-200 border border-gray-300 shadow-inner'}`}
                  aria-label="Toggle theme"
                >
                  <span className="sr-only">Toggle theme</span>
                  <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isDark ? 'bg-black/40' : 'bg-gray-300'}`}></div>
                  <span className="absolute inset-x-0 flex justify-between px-2 w-full pointer-events-none text-xs z-0">
                    <Moon className={`w-3.5 h-3.5 transition-opacity ${isDark ? 'text-white' : 'text-gray-400 opacity-0'}`} />
                    <Sun className={`w-3.5 h-3.5 transition-opacity ${isDark ? 'opacity-0' : 'text-orange-500'}`} />
                  </span>
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out z-10 ${isDark ? Capacitor.isNativePlatform() ? 'translate-x-1 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'translate-x-[4px]' : Capacitor.isNativePlatform() ? 'translate-x-8 shadow-md' : 'translate-x-[32px]'}`}
                  />
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <MoreVertical className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Overlay Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden border-t border-gray-200 dark:border-white/5 bg-white dark:bg-background overflow-hidden"
              >
                <div className="px-4 py-6 max-h-[75vh] overflow-y-auto space-y-4">
                  {/* Mobile Search Bar - Hidden Natively */}
                  {!Capacitor.isNativePlatform() && (
                    <div className="relative mb-6">
                      <input
                        type="text"
                        placeholder="Search tools..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (window.location.pathname !== '/') {
                            window.location.assign('/');
                          }
                        }}
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan transition-all"
                      />
                      <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  {/* Mobile Download App Button */}
                  {!Capacitor.isNativePlatform() && (
                    <a
                      href="/downloads/GravityPDF.apk"
                      download="GravityPDF.apk"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-bold px-4 py-3 rounded-xl text-sm hover:opacity-90 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] mb-4"
                    >
                      <Smartphone className="w-5 h-5" />
                      Download Android App
                    </a>
                  )}

                  {/* Native Mobile Saved Files Button inside Hamburger */}
                  {Capacitor.isNativePlatform() && (
                    <Link
                      to="/saved-files"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 w-full bg-white/5 border border-white/10 text-white font-bold px-4 py-3 rounded-xl text-sm hover:bg-white/10 transition-all mb-4"
                    >
                      <FolderOpen className="w-5 h-5 text-neon-cyan" />
                      Saved PDFs
                    </Link>
                  )}

                  {/* About Page */}
                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center text-lg font-bold text-gray-900 dark:text-white hover:text-neon-cyan transition-colors px-2 py-4 border-b border-gray-200 dark:border-white/10"
                  >
                    About GravityPDF
                  </Link>

                  {/* Developer / Tools Lists - Hidden Natively */}
                  {!Capacitor.isNativePlatform() && (
                    <div className="space-y-1 pt-2">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-3">All Tools</div>
                      {allTools.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-neon-cyan transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main Content Area */}
        <div className="pt-16 min-h-[calc(100vh-64px)] overflow-x-hidden w-full max-w-[100vw]">
          <AnimatedRoutes searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </Layout>
    </Router >
  );
}

export default App;
