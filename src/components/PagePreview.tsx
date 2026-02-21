import React, { useEffect, useRef, useState } from 'react';
import { pdfjsLib } from '../lib/pdfjs-setup';

interface PagePreviewProps {
    file: File;
    pageNumber?: number; // 1-indexed, default is 1
    width?: number; // target render width
    onRemove?: () => void;
    className?: string;
    isSelected?: boolean;
}

export const PagePreview: React.FC<PagePreviewProps> = ({
    file,
    pageNumber = 1,
    width = 150,
    onRemove,
    className = '',
    isSelected = false
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;
        let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;
        let renderTask: pdfjsLib.RenderTask | null = null;

        const renderPage = async () => {
            if (!canvasRef.current) return;

            try {
                setIsLoading(true);
                const arrayBuffer = await file.arrayBuffer();

                if (!active) return;

                loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;

                // Ensure requested page exists, fallback to 1
                const targetPage = Math.min(Math.max(1, pageNumber), pdf.numPages);
                const page = await pdf.getPage(targetPage);

                if (!active) return;

                const viewport = page.getViewport({ scale: 1.0 });
                const scale = width / viewport.width;
                const scaledViewport = page.getViewport({ scale });

                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                if (!context) {
                    throw new Error("Could not get 2d context for canvas");
                }

                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport,
                };

                renderTask = page.render(renderContext as any);
                await renderTask.promise;

                if (active) setError(null);

            } catch (err: any) {
                if (active) {
                    console.error('Error rendering PDF preview:', err);
                    setError(err.message || 'Failed to render preview');
                }
            } finally {
                if (active) setIsLoading(false);
            }
        };

        renderPage();

        return () => {
            active = false;
            if (renderTask) renderTask.cancel();
            if (loadingTask && loadingTask.destroyed === false) loadingTask.destroy();
        };
    }, [file, pageNumber, width]);

    return (
        <div className={`relative group flex flex-col items-center bg-white/5 backdrop-blur-md border rounded-lg overflow-hidden transition-all duration-300
      ${isSelected ? 'border-neon-gold shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'border-white/10 hover:border-white/30 hover:shadow-lg'} 
      ${className}`}
            style={{ width: width + 20 }}
        >
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="absolute -top-3 -right-3 z-20 bg-red-500/80 backdrop-blur border border-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    title="Remove file"
                >
                    ×
                </button>
            )}

            <div className="w-full flex items-center justify-center bg-black/20 relative" style={{ minHeight: width * 1.4 }}>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {error ? (
                    <div className="p-4 text-xs text-red-400 text-center w-full break-words">
                        Preview unavailable
                    </div>
                ) : (
                    <canvas
                        ref={canvasRef}
                        className={`shadow-md transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    />
                )}
            </div>

            <div className="w-full p-2 text-center bg-black/40 border-t border-white/5">
                <p className="text-xs font-medium text-gray-300 truncate w-full" title={file.name}>
                    {file.name}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Pg {pageNumber}
                </p>
            </div>
        </div>
    );
};
