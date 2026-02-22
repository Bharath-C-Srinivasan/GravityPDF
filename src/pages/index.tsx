import {
    Layers, SplitSquareHorizontal, RotateCcw, Image as ImageIcon, Zap,
    FileImage, FileText, ImagePlus, Droplets, Hash,
    FileMinus, ArrowUpDown, FilePlus, Tags, Minimize, Search
} from 'lucide-react';
import { DeveloperSection } from '../components/DeveloperSection';
import { useState } from 'react';
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

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');

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
                <p className="max-w-2xl text-base md:text-xl text-gray-400 mx-auto leading-relaxed px-2 mb-8 md:mb-12">
                    Your ultimate companion for seamless PDF management. Fast, secure, and entirely browser-based. Zero uploads, zero servers, total control.
                </p>

                {/* Animated Search Bar */}
                <div className="max-w-xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-neon-cyan transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for tools (e.g. Merge, Split, Watermark)..."
                        className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)] group-focus-within:shadow-[0_0_30px_rgba(34,211,238,0.15)] placeholder:text-gray-500"
                    />
                    {searchQuery && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-neon-cyan">
                            {totalResults} found
                        </div>
                    )}
                </div>
            </div>

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
                                onClick={() => setSearchQuery('')}
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

            <div className="px-2">
                <DeveloperSection />
            </div>
        </div>
    );
}
