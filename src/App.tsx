import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layers, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';
import Dashboard from './pages/index';
import MergeTool from './pages/merge';
import SplitTool from './pages/split';
import ImageToPDFTool from './pages/image-to-pdf';
import RotateTool from './pages/rotate';
import CompressTool from './pages/compress';
import PDFToImageTool from './pages/pdf-to-image';
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

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/merge" element={<PageTransition><MergeTool /></PageTransition>} />
        <Route path="/split" element={<PageTransition><SplitTool /></PageTransition>} />
        <Route path="/image-to-pdf" element={<PageTransition><ImageToPDFTool /></PageTransition>} />
        <Route path="/rotate" element={<PageTransition><RotateTool /></PageTransition>} />
        <Route path="/compress" element={<PageTransition><CompressTool /></PageTransition>} />
        <Route path="/pdf-to-image" element={<PageTransition><PDFToImageTool /></PageTransition>} />
        <Route path="*" element={<PageTransition><Dashboard /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Merge PDF', path: '/merge' },
    { name: 'Split PDF', path: '/split' },
    { name: 'Rotate PDF', path: '/rotate' },
    { name: 'Image to PDF', path: '/image-to-pdf' },
    { name: 'Compress PDF', path: '/compress' },
    { name: 'PDF to Image', path: '/pdf-to-image' },
  ];

  return (
    <Router>
      <Layout>
        {/* Responsive Navigation Bar */}
        <header className="border-b border-white/10 bg-background/80 backdrop-blur-md fixed top-0 w-full z-50">
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

              {/* Desktop Nav */}
              <nav className="hidden lg:flex space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm font-medium text-gray-300 hover:text-neon-cyan transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                <div className="px-4 py-6 space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block text-lg font-medium text-gray-300 hover:text-neon-cyan transition-colors px-2 py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main Content Area */}
        <div className="pt-16 min-h-[calc(100vh-64px)] overflow-x-hidden">
          <AnimatedRoutes />
        </div>
      </Layout>
    </Router>
  );
}

export default App;
