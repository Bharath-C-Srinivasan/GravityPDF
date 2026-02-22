import { Layers, SplitSquareHorizontal, RotateCcw, Image as ImageIcon, Zap, FileImage, FileText, ImagePlus } from 'lucide-react';
import { DeveloperSection } from '../components/DeveloperSection';

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
    }
];

export default function Dashboard() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
            <div className="text-center mb-12 md:mb-16 px-2">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 pb-2 text-gradient-primary leading-[1.1]">
                    Welcome to GravityPDF
                </h1>
                <p className="max-w-2xl text-base md:text-xl text-gray-400 mx-auto leading-relaxed px-2">
                    Your ultimate companion for seamless PDF management. Fast, secure, and entirely browser-based. Zero uploads, zero servers, total control.
                </p>
            </div>

            <div className="mb-16 md:mb-24 px-2">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight border-b border-white/10 pb-4">
                    PDF Tools
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {pdfTools.map((tool) => (
                        <a
                            key={tool.title}
                            href={tool.href}
                            className="flex flex-col items-center p-4 sm:p-6 rounded-xl sm:rounded-2xl cursor-pointer glass-panel glass-panel-hover group"
                        >
                            <div className="p-2 sm:p-4 rounded-full mb-3 sm:mb-4 bg-black/40 border border-white/5 transition-colors shadow-lg">
                                <div className="scale-75 sm:scale-100">
                                    {tool.icon}
                                </div>
                            </div>
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2 transition-colors text-center leading-tight">{tool.title}</h3>
                            <p className="text-center text-[10px] sm:text-xs md:text-sm text-gray-400 line-clamp-2">{tool.description}</p>
                        </a>
                    ))}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 tracking-tight border-b border-white/10 pb-4">
                    Convert to PDF
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {convertTools.map((tool) => (
                        <a
                            key={tool.title}
                            href={tool.href}
                            className="flex flex-col items-center p-4 sm:p-6 rounded-xl sm:rounded-2xl cursor-pointer glass-panel glass-panel-hover group"
                        >
                            <div className="p-2 sm:p-4 rounded-full mb-3 sm:mb-4 bg-black/40 border border-white/5 transition-colors shadow-lg">
                                <div className="scale-75 sm:scale-100">
                                    {tool.icon}
                                </div>
                            </div>
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2 transition-colors text-center leading-tight">{tool.title}</h3>
                            <p className="text-center text-[10px] sm:text-xs md:text-sm text-gray-400 line-clamp-2">{tool.description}</p>
                        </a>
                    ))}
                </div>
            </div>

            <div className="px-2">
                <DeveloperSection />
            </div>
        </div>
    );
}
