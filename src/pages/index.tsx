import { Layers, SplitSquareHorizontal, RotateCcw, Image as ImageIcon, Zap, FileImage } from 'lucide-react';
import { DeveloperSection } from '../components/DeveloperSection';

const tools = [
    // ...
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
        icon: <ImageIcon className="h-8 w-8 text-neon-gold" />,
        title: 'Image to PDF',
        description: 'Convert JPG, PNG, or TIFF images into a single PDF document.',
        href: '/image-to-pdf',
        color: 'neon-gold'
    },
    {
        icon: <Zap className="h-8 w-8 text-neon-cyan" />,
        title: 'Compress PDF',
        description: 'Reduce file size while maintaining quality. Fast and secure.',
        href: '/compress',
        color: 'neon-cyan'
    },
    {
        icon: <FileImage className="h-8 w-8 text-neon-magenta" />,
        title: 'PDF to Image',
        description: 'Convert every PDF page into a high-quality PNG or JPG image.',
        href: '/pdf-to-image',
        color: 'neon-magenta'
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

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-16 md:mb-24 px-2">
                {tools.map((tool) => (
                    <a
                        key={tool.title}
                        href={tool.href}
                        className="flex flex-col items-center p-4 sm:p-8 rounded-xl sm:rounded-2xl cursor-pointer glass-panel glass-panel-hover group"
                    >
                        <div className="p-2 sm:p-4 rounded-full mb-3 sm:mb-4 bg-black/40 border border-white/5 transition-colors shadow-lg">
                            <div className="scale-75 sm:scale-100">
                                {tool.icon}
                            </div>
                        </div>
                        <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 transition-colors text-center leading-tight">{tool.title}</h3>
                        <p className="text-center text-[10px] sm:text-sm md:text-base text-gray-400 line-clamp-2">{tool.description}</p>
                    </a>
                ))}
            </div>

            <div className="px-2">
                <DeveloperSection />
            </div>
        </div>
    );
}
