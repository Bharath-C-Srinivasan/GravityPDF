import {
    Layers, SplitSquareHorizontal, RotateCcw, Image as ImageIcon, Zap,
    FileImage, FileText, ImagePlus, Droplets, Hash, Download, ShieldCheck,
    FileMinus, ArrowUpDown, FilePlus, Tags, Minimize
} from 'lucide-react';
import { DeveloperSection } from '../components/DeveloperSection';
import { motion, AnimatePresence } from 'framer-motion';

const pdfTools = [
    {
        icon: <Layers className="h-8 w-8 text-neon-cyan" />,
        title: 'Merge PDF',
        description: 'Combine multiple PDFs into one unified document.',
        href: '/merge',
        color: 'neon-cyan'
    },
    {
        icon: <SplitSquareHorizontal className="h-8 w-8 text-neon-magenta" />,
        title: 'Split PDF',
        description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
        href: '/split',
        color: 'neon-magenta'
    },
    {
        icon: <RotateCcw className="h-8 w-8 text-neon-orange" />,
        title: 'Rotate PDF',
        description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
        href: '/rotate',
        color: 'neon-orange'
    },
    {
        icon: <Zap className="h-8 w-8 text-neon-cyan" />,
        title: 'Compress PDF',
        description: 'Reduce file size while maintaining quality. Fast and secure.',
        href: '/compress',
        color: 'neon-cyan'
    },
    {
        icon: <FileMinus className="h-8 w-8 text-red-500" />,
        title: 'Delete Pages',
        description: 'Remove unwanted pages from a PDF document.',
        href: '/delete-pages',
        color: 'red-500'
    },
    {
        icon: <ArrowUpDown className="h-8 w-8 text-neon-gold" />,
        title: 'Reorder Pages',
        description: 'Rearrange the pages of your PDF in any order.',
        href: '/reorder-pages',
        color: 'neon-gold'
    },
    {
        icon: <FilePlus className="h-8 w-8 text-neon-green" />,
        title: 'Add Blank Pages',
        description: 'Insert empty pages perfectly where you need them.',
        href: '/add-blank-pages',
        color: 'neon-green'
    }
];

const convertTools = [
    {
        icon: <ImageIcon className="h-8 w-8 text-neon-gold" />,
        title: 'Image to PDF',
        description: 'Convert JPG, PNG, or TIFF images into a single PDF document.',
        href: '/image-to-pdf',
        color: 'neon-gold'
    },
    {
        icon: <FileImage className="h-8 w-8 text-neon-magenta" />,
        title: 'PDF to Image',
        description: 'Convert every PDF page into a high-quality PNG or JPG image.',
        href: '/pdf-to-image',
        color: 'neon-magenta'
    },
    {
        icon: <FileText className="h-8 w-8 text-white" />,
        title: 'Text to PDF',
        description: 'Convert plain text (.txt) files into a single PDF document.',
        href: '/text-to-pdf',
        color: 'white'
    },
    {
        icon: <ImagePlus className="h-8 w-8 text-neon-green" />,
        title: 'PNG to PDF',
        description: 'Convert PNG images specifically into a PDF document.',
        href: '/png-to-pdf',
        color: 'neon-green'
    },
    {
        icon: <Minimize className="h-8 w-8 text-neon-orange" />,
        title: 'Flatten PDF',
        description: 'Flatten form fields so they become un-editable elements.',
        href: '/flatten-pdf',
        color: 'neon-orange'
    }
];

const securityTools = [
    {
        icon: <Droplets className="h-8 w-8 text-neon-magenta" />,
        title: 'Add Watermark',
        description: 'Stamp an image or text over your PDF in seconds.',
        href: '/add-watermark',
        color: 'neon-magenta'
    },
    {
        icon: <Hash className="h-8 w-8 text-neon-gold" />,
        title: 'Add Page Numbers',
        description: 'Add page numbers into PDFs with ease. Choose your positions and typography.',
        href: '/add-page-numbers',
        color: 'neon-gold'
    },
    {
        icon: <Tags className="h-8 w-8 text-white" />,
        title: 'Edit Metadata',
        description: 'Change the Title, Author, and Subject attributes of your PDF.',
        href: '/edit-metadata',
        color: 'white'
    }
];

const Section = ({ title, tools }: { title: string, tools: any[] }) => {
    if (tools.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12"
        >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight border-b border-white/10 pb-4">
                {title}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <AnimatePresence>
                    {tools.map((tool) => (
                        <motion.a
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            key={tool.title}
                            href={tool.href}
                            className="flex flex-col items-center p-4 sm:p-6 rounded-xl sm:rounded-2xl cursor-pointer glass-panel glass-panel-hover group h-full"
                        >
                            <div className="p-2 sm:p-4 rounded-full mb-3 sm:mb-4 bg-black/40 border border-white/5 transition-colors shadow-lg">
                                <div className="scale-75 sm:scale-100">
                                    {tool.icon}
                                </div>
                            </div>
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2 transition-colors text-center leading-tight">{tool.title}</h3>
                            <p className="text-center text-[10px] sm:text-xs md:text-sm text-gray-400 line-clamp-2 mt-auto">{tool.description}</p>
                        </motion.a>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default function Dashboard({ searchQuery = '', setSearchQuery }: { searchQuery?: string, setSearchQuery?: (q: string) => void }) {

    const filterTools = (tools: any[]) => {
        if (!searchQuery.trim()) return tools;
        const query = searchQuery.toLowerCase();
        return tools.filter(tool =>
            tool.title.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query)
        );
    };

    const filteredPdfTools = filterTools(pdfTools);
    const filteredConvertTools = filterTools(convertTools);
    const filteredSecurityTools = filterTools(securityTools);

    const totalResults = filteredPdfTools.length + filteredConvertTools.length + filteredSecurityTools.length;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
            <div className="text-center mb-8 md:mb-12 px-2">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 pb-2 text-gradient-primary leading-[1.1]">
                    Welcome to GravityPDF
                </h1>
                <p className="max-w-2xl text-base md:text-xl text-gray-400 mx-auto leading-relaxed px-2 mb-8">
                    Your ultimate companion for seamless PDF management. Fast, secure, and entirely browser-based. Zero uploads, zero servers, total control.
                </p>
            </div> {/* This closes the div with className="text-center mb-8 md:mb-12 px-2" */}

            <div className="mb-16 md:mb-24 px-2 min-h-[50vh]">
                <AnimatePresence mode="popLayout">
                    {totalResults === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <p className="text-gray-400 text-lg">No tools found matching "{searchQuery}".</p>
                            <button
                                onClick={() => setSearchQuery?.('')}
                                className="mt-4 text-neon-cyan hover:underline"
                            >
                                Clear search
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            <Section title="PDF Tools" tools={filteredPdfTools} />
                            <Section title="Convert to PDF" tools={filteredConvertTools} />
                            <Section title="Security & Utilities" tools={filteredSecurityTools} />
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Android App Download Section (Moved Below Security & Utilities) */}
            <div className="px-2">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-3xl mx-auto mb-16 md:mb-24 p-1 rounded-2xl bg-gradient-to-r from-neon-cyan/20 via-neon-magenta/20 to-neon-cyan/20 p-[1px]"
                >
                    <div className="bg-white/90 dark:bg-background/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>

                        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
                            <div className="flex-shrink-0 bg-gray-50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-black p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_30px_rgba(34,211,238,0.15)] flex items-center justify-center">
                                <img src="/vite.svg" alt="GravityPDF App Logo" className="w-16 h-16 object-contain drop-shadow-lg" />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2">
                                    Get the GravityPDF Android App
                                    <span className="bg-neon-cyan/10 text-neon-cyan text-xs px-2 py-1 rounded-full border border-neon-cyan/20">Free</span>
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                    Process PDFs offline directly on your phone. Fast, secure, and zero data usage.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
                                    <a
                                        href="/downloads/GravityPDF.apk"
                                        download="GravityPDF.apk"
                                        style={{ color: '#ffffff', textDecoration: 'none' }}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-neon-cyan to-neon-magenta px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                    >
                                        <Download className="w-5 h-5" style={{ color: '#ffffff' }} />
                                        <span style={{ color: '#ffffff' }}>Download APK</span>
                                    </a>

                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-2 sm:mt-0">
                                        <ShieldCheck className="w-4 h-4 text-neon-green" />
                                        <span>100% Safe & Private</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Installation Instructions */}
                        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-white/10 text-left">
                            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                <span className="text-neon-cyan shrink-0">💡 Install Note:</span>
                                <span>
                                    Since you are downloading outside the Play Store, your phone may say "File might be harmful". This is standard for direct APK downloads. Tap <strong>Download anyway</strong>, open the file, and tap <strong>Install</strong>.
                                </span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="px-2">
                <DeveloperSection />
            </div>
        </div>
    );
}
