import { useState, useCallback } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import { usePDFWorker } from '../hooks/usePDFWorker';
import toast from 'react-hot-toast';
import { downloadFile } from '../lib/utils';
import { motion } from 'framer-motion';
import { Hash, Trash2 } from 'lucide-react';

export default function AddPageNumbersTool() {
    const [files, setFiles] = useState<File[]>([]);
    const [position, setPosition] = useState('bottom-center');
    const { status, progress, error, processJob, reset, isProcessing } = usePDFWorker();

    const handleFilesAccepted = useCallback((newFiles: File[]) => {
        const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
        if (pdfFiles.length < newFiles.length) {
            toast.error('Only PDF files are allowed.');
        }
        if (files.length === 0 && pdfFiles.length > 0) {
            setFiles([pdfFiles[0]]);
        } else if (pdfFiles.length > 0) {
            toast.error('Please process one PDF at a time.');
        }
    }, [files]);

    const removeFile = () => {
        setFiles([]);
        reset();
    };

    const handleAddNumbers = async () => {
        if (files.length === 0) return;

        try {
            const resultBlob = await processJob('add-page-numbers', files, { position });

            if (resultBlob) {
                await downloadFile(resultBlob as Blob, `numbered_${files[0].name}`);
                toast.success('Page numbers added successfully!');
            }
        } catch (e: any) {
            toast.error(e.message || 'Failed to add page numbers.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8 md:mb-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 pb-2 text-gradient-primary">
                    Add Page Numbers
                </h1>
                <p className="text-gray-400 font-mono text-sm md:text-base">
                    Stamp page numbers automatically. Choose typography and position.
                </p>
            </div>

            <div className="mb-12">
                {files.length === 0 ? (
                    <FileDropzone
                        onFilesAccepted={handleFilesAccepted}
                        accept={{ 'application/pdf': ['.pdf'] }}
                        title="Upload PDF"
                        subtitle="Drag & drop a PDF here"
                    />
                ) : null}
            </div>

            {files.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-2xl glass-panel relative"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Hash className="w-5 h-5 text-neon-gold" />
                            File to Modify
                        </h3>
                        <button
                            onClick={removeFile}
                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                            Start Over
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <div className="flex items-center justify-between p-4 rounded-xl glass-panel border border-white/10">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="p-3 bg-neon-gold/20 rounded-lg">
                                        <Hash className="w-6 h-6 text-neon-gold" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-white font-medium truncate" title={files[0].name}>{files[0].name}</p>
                                        <p className="text-gray-400 text-sm">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={removeFile}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="md:w-72 space-y-4">
                            <div className="glass-panel p-6 rounded-xl border border-white/10">
                                <h4 className="text-white font-medium mb-4">Position</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'bottom-center'] as const).map((pos) => (
                                        <button
                                            key={pos}
                                            onClick={() => setPosition(pos)}
                                            className={`py-2 px-3 text-xs rounded-xl border font-bold transition-all capitalize ${position === pos
                                                ? 'bg-neon-gold/10 border-neon-gold text-neon-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                                                } ${pos === 'bottom-center' ? 'col-span-2' : ''}`}
                                        >
                                            {pos.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isProcessing && (
                        <div className="mt-8">
                            <div className="flex justify-between text-sm mb-2 text-neon-gold font-mono">
                                <span>Adding Numbers...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                                <motion.div
                                    className="bg-neon-gold h-2 rounded-full shadow-[0_0_10px_rgba(255,215,0,0.8)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="mt-6 p-4 bg-red-900/40 border border-red-500 rounded text-red-200">
                            {error || "An error occurred during process."}
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleAddNumbers}
                            disabled={isProcessing}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${isProcessing
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                                : 'bg-white/10 text-white hover:bg-neon-gold hover:text-black border border-neon-gold shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]'
                                }`}
                        >
                            <Hash className="w-5 h-5" />
                            {isProcessing ? 'Processing...' : 'Add Numbers'}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
