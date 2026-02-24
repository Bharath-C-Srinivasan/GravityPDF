import { useState, useCallback } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import { usePDFWorker } from '../hooks/usePDFWorker';
import toast from 'react-hot-toast';
import { downloadFile } from '../lib/utils';
import { motion } from 'framer-motion';
import { FilePlus, Trash2 } from 'lucide-react';

export default function AddBlankPagesTool() {
    const [files, setFiles] = useState<File[]>([]);
    const [insertions, setInsertions] = useState('');
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
        setInsertions('');
        reset();
    };

    const handleAddBlankPages = async () => {
        if (files.length === 0) return;
        if (!insertions.trim()) {
            toast.error('Please enter the insertion points.');
            return;
        }

        try {
            const result = await processJob('add-blank-pages', files, { insertions });

            if (result && result[0]) {
                await downloadFile(result[0] as Blob, `with_blanks_${files[0].name}`);
                toast.success('Blank pages added successfully!');
            }
        } catch (e: any) {
            toast.error(e.message || 'Failed to add blank pages.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8 md:mb-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 pb-2 text-gradient-primary">
                    Add Blank Pages
                </h1>
                <p className="text-gray-400 font-mono text-sm md:text-base">
                    Insert empty pages exactly where you need them.
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
                            <FilePlus className="w-5 h-5 text-neon-green" />
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
                                    <div className="p-3 bg-neon-green/20 rounded-lg">
                                        <FilePlus className="w-6 h-6 text-neon-green" />
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
                                <h4 className="text-white font-medium mb-4">Insert Locations</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">After pages (comma-separated):</label>
                                        <input
                                            type="text"
                                            value={insertions}
                                            onChange={(e) => setInsertions(e.target.value)}
                                            placeholder="E.g. 0, 2, 5"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-green transition-colors"
                                        />
                                        <p className="text-xs text-gray-500 mt-2 mt-2 leading-relaxed">
                                            Enter <code className="bg-black/50 px-1 py-0.5 rounded">0</code> to insert a blank page at the very beginning.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isProcessing && (
                        <div className="mt-8">
                            <div className="flex justify-between text-sm mb-2 text-neon-green font-mono">
                                <span>Adding Pages...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                                <motion.div
                                    className="bg-neon-green h-2 rounded-full shadow-[0_0_10px_rgba(57,255,20,0.8)]"
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
                            onClick={handleAddBlankPages}
                            disabled={isProcessing || !insertions.trim()}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${isProcessing || !insertions.trim()
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                                : 'bg-white/10 text-white hover:bg-neon-green hover:text-black border border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)]'
                                }`}
                        >
                            <FilePlus className="w-5 h-5" />
                            {isProcessing ? 'Processing...' : 'Add Blank Pages'}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
