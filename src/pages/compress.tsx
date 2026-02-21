import { useState, useCallback } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import { PagePreview } from '../components/PagePreview';
import { usePDFWorker } from '../hooks/usePDFWorker';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function CompressTool() {
    const [file, setFile] = useState<File | null>(null);
    const [compressedSize, setCompressedSize] = useState<number | null>(null);
    const [compressionLevel, setCompressionLevel] = useState<'low' | 'recommended' | 'extreme'>('recommended');
    const { status, progress, error, processJob, reset, isProcessing } = usePDFWorker();

    const handleFilesAccepted = useCallback((newFiles: File[]) => {
        if (newFiles.length > 0) {
            setFile(newFiles[0]);
            setCompressedSize(null);
            reset();
        }
    }, [reset]);

    const removeFile = useCallback(() => {
        setFile(null);
        setCompressedSize(null);
        reset();
    }, [reset]);

    const handleCompress = async () => {
        if (!file) return;

        try {
            const compressedBlob = await processJob('compress', [file], { level: compressionLevel });
            if (compressedBlob) {
                setCompressedSize(compressedBlob.size);

                const url = URL.createObjectURL(compressedBlob as Blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `compressed_${file.name}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                toast.success("PDF compressed successfully!");
            }
        } catch (err) {
            toast.error("Failed to compress PDF. Please try again.");
        }
    };

    const levels = [
        { id: 'low', name: 'Low', description: 'Basic optimization. Fast & safe.', color: 'text-blue-400' },
        { id: 'recommended', name: 'Standard', description: 'Balanced quality & size.', color: 'text-neon-cyan' },
        { id: 'extreme', name: 'Extreme', description: 'Max reduction. Removes metadata.', color: 'text-neon-magenta' },
    ] as const;

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-8 md:mb-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 pb-2 text-gradient-primary leading-tight">
                    Compress PDF
                </h1>
                <p className="text-gray-400 font-mono text-sm md:text-base">
                    Choose a compression level and reduce file size efficiently.
                </p>
            </div>

            <div className="space-y-8">
                <FileDropzone
                    onFilesAccepted={handleFilesAccepted}
                    title="Select PDF to compress"
                    subtitle="Select one PDF file at a time."
                    accept={{ 'application/pdf': ['.pdf'] }}
                    maxFiles={1}
                />

                <AnimatePresence>
                    {file && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-8 rounded-2xl glass-panel relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row items-start gap-8">
                                <div className="mx-auto md:mx-0">
                                    <PagePreview
                                        file={file}
                                        onRemove={removeFile}
                                        width={160}
                                    />
                                </div>

                                <div className="flex-1 space-y-6 w-full">
                                    {/* Level Selector */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-1">Compression Level</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {levels.map((level) => (
                                                <button
                                                    key={level.id}
                                                    onClick={() => setCompressionLevel(level.id)}
                                                    disabled={isProcessing}
                                                    className={`p-4 rounded-xl border text-left transition-all duration-300 ${compressionLevel === level.id
                                                        ? 'bg-white/10 border-white/30 shadow-lg scale-[1.02]'
                                                        : 'bg-black/20 border-white/5 hover:bg-white/5 opacity-60'
                                                        }`}
                                                >
                                                    <div className={`font-bold mb-1 ${compressionLevel === level.id ? level.color : 'text-white'}`}>
                                                        {level.name}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 leading-tight">
                                                        {level.description}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                            <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Original Size</div>
                                            <div className="text-xl font-bold text-white">{formatSize(file.size)}</div>
                                        </div>
                                        <div className={`p-4 rounded-xl border transition-all duration-500 text-center ${compressedSize ? 'bg-neon-cyan/10 border-neon-cyan/30' : 'bg-white/5 border-white/10'}`}>
                                            <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Compressed Size</div>
                                            <div className="text-xl font-bold text-white">
                                                {compressedSize ? formatSize(compressedSize) : '---'}
                                            </div>
                                        </div>
                                    </div>

                                    {compressedSize && (
                                        <div className="text-center p-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold">
                                            Reduced by {Math.round((1 - compressedSize / file.size) * 100)}%
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {status === 'error' && (
                                        <div className="p-4 bg-red-900/40 border border-red-500 rounded text-red-200 text-sm">
                                            {error || "An error occurred during processing."}
                                            <button onClick={reset} className="ml-4 underline hover:text-white">Dismiss</button>
                                        </div>
                                    )}

                                    {/* Progress Bar */}
                                    {isProcessing && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-neon-cyan font-mono">
                                                <span>{compressionLevel === 'extreme' ? 'Rebuilding document structure...' : 'Optimizing layout...'}</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${compressionLevel === 'extreme' ? 'bg-neon-magenta shadow-[0_0_10px_rgba(255,0,234,0.5)]' : 'bg-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.5)]'}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <button
                                            onClick={handleCompress}
                                            disabled={isProcessing}
                                            className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${isProcessing
                                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                                                : 'bg-white/5 text-white hover:bg-neon-cyan hover:text-black border border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]'
                                                }`}
                                        >
                                            {isProcessing ? (
                                                <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent animate-spin rounded-full" />
                                            ) : (
                                                <>
                                                    <Zap className="w-5 h-5" />
                                                    Compress PDF ({compressionLevel.charAt(0).toUpperCase() + compressionLevel.slice(1)})
                                                </>
                                            )}
                                        </button>
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
