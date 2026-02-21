import { useState, useCallback } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import { PagePreview } from '../components/PagePreview';
import { pdfjsLib } from '../lib/pdfjs-setup';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, FileArchive } from 'lucide-react';
import JSZip from 'jszip';

export default function PDFToImageTool() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [numPages, setNumPages] = useState<number>(0);
    const [format, setFormat] = useState<'png' | 'jpeg'>('png');
    const [quality, setQuality] = useState(0.92);

    const handleFilesAccepted = useCallback(async (newFiles: File[]) => {
        if (newFiles.length > 0) {
            const selectedFile = newFiles[0];
            setFile(selectedFile);
            setProgress(0);

            try {
                const arrayBuffer = await selectedFile.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                setNumPages(pdf.numPages);
            } catch (err) {
                console.error("Error loading PDF info:", err);
                toast.error("Failed to load PDF information.");
            }
        }
    }, []);

    const removeFile = useCallback(() => {
        setFile(null);
        setNumPages(0);
        setProgress(0);
    }, []);

    const convertToImage = async () => {
        if (!file) return;

        setIsProcessing(true);
        setProgress(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            const zip = new JSZip();
            const total = pdf.numPages;

            for (let i = 1; i <= total; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // High quality scale

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (!context) throw new Error("Canvas context failed");

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                } as any).promise;

                const dataUrl = canvas.toDataURL(`image/${format}`, quality);
                const base64Data = dataUrl.split(',')[1];

                zip.file(`page-${i}.${format}`, base64Data, { base64: true });
                setProgress(Math.round((i / total) * 100));
            }

            const content = await zip.generateAsync({ type: 'blob' });

            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace('.pdf', '')}_images.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success("All pages converted and downloaded!");
        } catch (err) {
            console.error("Conversion error:", err);
            toast.error("Failed to convert PDF to images.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8 md:mb-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 pb-2 text-gradient-primary">
                    PDF to Image
                </h1>
                <p className="text-gray-400 font-mono text-sm md:text-base">
                    Convert every PDF page into a high-quality {format.toUpperCase()} image.
                </p>
            </div>

            <div className="space-y-8">
                <FileDropzone
                    onFilesAccepted={handleFilesAccepted}
                    title="Select PDF to convert"
                    subtitle="Supports single multi-page PDF files."
                    accept={{ 'application/pdf': ['.pdf'] }}
                    maxFiles={1}
                />

                <AnimatePresence>
                    {file && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-8 rounded-3xl glass-panel relative overflow-hidden"
                        >
                            <div className="flex flex-col lg:flex-row gap-12">
                                <div className="mx-auto lg:mx-0">
                                    <PagePreview
                                        file={file}
                                        width={240}
                                        onRemove={removeFile}
                                    />
                                    <div className="mt-4 text-center text-sm font-mono text-gray-400">
                                        {numPages} Pages Detected
                                    </div>
                                </div>

                                <div className="flex-1 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-neon-cyan" />
                                                Output Format
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {(['png', 'jpeg'] as const).map((f) => (
                                                    <button
                                                        key={f}
                                                        onClick={() => setFormat(f)}
                                                        className={`py-3 rounded-xl border font-bold transition-all ${format === f
                                                            ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                                                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                                                            }`}
                                                    >
                                                        {f.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-neon-magenta" />
                                                Quality ({Math.round(quality * 100)}%)
                                            </h3>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="1.0"
                                                step="0.05"
                                                value={quality}
                                                onChange={(e) => setQuality(parseFloat(e.target.value))}
                                                className="w-full accent-neon-magenta bg-white/10 rounded-lg h-2"
                                            />
                                            <div className="flex justify-between text-[10px] font-mono text-gray-500">
                                                <span>Fast</span>
                                                <span>High Fidelity</span>
                                            </div>
                                        </div>
                                    </div>

                                    {isProcessing && (
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs text-neon-cyan font-mono">
                                                <span>Rendering pages...</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-inner">
                                                <motion.div
                                                    className="bg-gradient-to-r from-neon-cyan to-electric-blue h-full shadow-[0_0_15px_rgba(0,243,255,0.5)]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <button
                                            onClick={convertToImage}
                                            disabled={isProcessing}
                                            className={`w-full group flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-lg transition-all duration-500 ${isProcessing
                                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                : 'bg-white/10 text-white hover:bg-neon-cyan hover:text-black border border-neon-cyan/50 hover:border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.1)] hover:shadow-[0_0_50px_rgba(0,243,255,0.4)]'
                                                }`}
                                        >
                                            {isProcessing ? (
                                                <div className="w-6 h-6 border-3 border-neon-cyan border-t-transparent animate-spin rounded-full" />
                                            ) : (
                                                <>
                                                    <FileArchive className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                                    Convert to {format.toUpperCase()} ZIP
                                                </>
                                            )}
                                        </button>
                                        <p className="mt-4 text-center text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                                            Processed locally in your browser
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
