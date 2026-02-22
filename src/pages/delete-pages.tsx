import { useState, useCallback } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import { usePDFWorker } from '../hooks/usePDFWorker';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Trash2, FileMinus } from 'lucide-react';

export default function DeletePagesTool() {
    const [files, setFiles] = useState<File[]>([]);
    const [pagesToDelete, setPagesToDelete] = useState('');
    const { status, progress, error, processJob, reset, isProcessing } = usePDFWorker();

    const handleFilesAccepted = useCallback((newFiles: File[]) => {
        const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
        if (pdfFiles.length < newFiles.length) {
            toast.error('Only PDF files are allowed.');
        }
        // Only allow one file for this specific tool for simplicity of UX
        if (files.length === 0 && pdfFiles.length > 0) {
            setFiles([pdfFiles[0]]);
        } else if (pdfFiles.length > 0) {
            toast.error('Please process one PDF at a time for deleting pages.');
        }
    }, [files]);

    const removeFile = () => {
        setFiles([]);
        setPagesToDelete('');
        reset();
    };

    const handleDeletePages = async () => {
        if (files.length === 0) return;
        if (!pagesToDelete.trim()) {
            toast.error('Please enter the pages you want to delete.');
            return;
        }

        try {
            const resultBlob = await processJob('delete-pages', files, { pagesToDelete });

            if (resultBlob) {
                const url = URL.createObjectURL(resultBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `updated_${files[0].name}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('Pages deleted successfully!');
            }
        } catch (e: any) {
            toast.error(e.message || 'Failed to delete pages. Please check the page numbers.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8 md:mb-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 pb-2 text-gradient-primary">
                    Delete PDF Pages
                </h1>
                <p className="text-gray-400 font-mono text-sm md:text-base">
                    Remove unwanted pages from your document. Just type the page numbers or ranges.
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
                            <FileMinus className="w-5 h-5 text-red-500" />
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
                                    <div className="p-3 bg-red-500/20 rounded-lg">
                                        <FileMinus className="w-6 h-6 text-red-500" />
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
                                <h4 className="text-white font-medium mb-4">Pages to Delete</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">E.g., 1, 3, 5-8</label>
                                        <input
                                            type="text"
                                            value={pagesToDelete}
                                            onChange={(e) => setPagesToDelete(e.target.value)}
                                            placeholder="1, 3-5"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isProcessing && (
                        <div className="mt-8">
                            <div className="flex justify-between text-sm mb-2 text-red-500 font-mono">
                                <span>Deleting Pages...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                                <motion.div
                                    className="bg-red-500 h-2 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="mt-6 p-4 bg-red-900/40 border border-red-500 rounded text-red-200">
                            {error || "An error occurred during deletion."}
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleDeletePages}
                            disabled={isProcessing || !pagesToDelete.trim()}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${isProcessing || !pagesToDelete.trim()
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                                : 'bg-white/10 text-white hover:bg-red-500 hover:text-white border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]'
                                }`}
                        >
                            <Trash2 className="w-5 h-5" />
                            {isProcessing ? 'Processing...' : 'Delete Pages'}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
