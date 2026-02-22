import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layers, MoreVertical, X, ChevronDown, Sun, Moon, Search, Smartphone } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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
        <Route path="*" element={<PageTransition><Dashboard /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
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
      <Layout>
        {/* Responsive Navigation Bar */}
        <header className="border-b border-white/10 bg-background/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  to="/"
                  className="text-xl md:text-2xl font-bold tracking-tight text-white hover:text-neon-cyan transition-colors text-glow-cyan flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Layers className="h-6 w-6 md:h-7 md:w-7 text-neon-cyan" />
                  <span>Gravity<span className="text-neon-cyan">PDF</span></span>
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
                  className="w-full bg-white/10 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white rounded-full py-1.5 pl-10 pr-4 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-sm placeholder:text-gray-500 shadow-inner dark:shadow-none"
                />
              </div>

              {/* Download App for Android Button */}
              <a
                href="/#android-app"
                className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-bold px-4 py-1.5 rounded-full text-sm hover:opacity-90 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] mr-4 whitespace-nowrap"
              >
                <Smartphone className="w-4 h-4" />
                Download App for Android
              </a>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center space-x-8 z-50">
                <Link to="/" className="text-sm font-medium text-gray-300 hover:text-neon-cyan transition-colors">
                  Dashboard
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

              {/* Mobile Actions Container */}
              <div className="lg:hidden flex items-center gap-4">
                {/* Mobile Theme Toggle Switch */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${isDark ? 'bg-white/10 border border-white/20' : 'bg-gray-200 border border-gray-300 shadow-inner'}`}
                  aria-label="Toggle theme"
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
                className="lg:hidden border-t border-white/5 bg-background overflow-hidden"
              >
                <div className="px-4 py-6 max-h-[75vh] overflow-y-auto space-y-4">
                  <Link to="/" className="block text-lg font-bold text-white hover:text-neon-cyan transition-colors px-2 py-1 border-b border-white/10 pb-4" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <div className="space-y-1 pt-2">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-3">All Tools</div>
                    {allTools.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="block text-sm font-medium text-gray-300 hover:text-neon-cyan transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
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
    </Router>
  );
}

export default App;
