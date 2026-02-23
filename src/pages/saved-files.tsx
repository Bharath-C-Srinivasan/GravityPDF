import { useState, useEffect } from 'react';
import { Filesystem, Directory, type FileInfo } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { FileText, Share2, Trash2, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function SavedFiles() {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadFiles = async () => {
        if (!Capacitor.isNativePlatform()) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Read the Documents directory
            const result = await Filesystem.readdir({
                path: '',
                directory: Directory.Documents,
            });

            // Filter for PDF files and sort by modification time (newest first)
            const pdfFiles = result.files
                .filter(file => file.name.endsWith('.pdf'))
                .sort((a, b) => {
                    const timeA = a.mtime || 0;
                    const timeB = b.mtime || 0;
                    return timeB - timeA;
                });

            setFiles(pdfFiles);
        } catch (e: any) {
            console.error('Error loading files:', e);
            setError(e.message || 'Failed to access device storage.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const formatBytes = (bytes?: number) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return 'Unknown date';
        return new Date(timestamp).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleShare = async (file: FileInfo) => {
        try {
            await Share.share({
                title: 'Share PDF',
                text: 'Sharing from GravityPDF',
                url: file.uri,
                dialogTitle: 'Share ' + file.name,
            });
        } catch (e) {
            console.error('Error sharing file:', e);
            toast.error('Could not share file.');
        }
    };

    const handleDelete = async (file: FileInfo) => {
        try {
            await Filesystem.deleteFile({
                path: file.name,
                directory: Directory.Documents,
            });
            toast.success(`${file.name} deleted`);
            // Remove from local state
            setFiles(files.filter(f => f.name !== file.name));
        } catch (e) {
            console.error('Error deleting file:', e);
            toast.error('Failed to delete file.');
        }
    };

    if (!Capacitor.isNativePlatform()) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <div className="glass-panel p-8 rounded-2xl">
                    <AlertCircle className="w-12 h-12 text-neon-orange mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Native App Feature</h2>
                    <p className="text-gray-400">
                        The Saved Files viewer is only available when using the GravityPDF Android App.
                        On the web, your browser downloads files directly to your system's download folder.
                    </p>
                    <Link to="/" className="inline-block mt-6 text-neon-cyan hover:underline">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                        <FileText className="w-8 h-8 text-neon-cyan" />
                        Saved PDFs
                    </h1>
                </div>
                <button
                    onClick={loadFiles}
                    disabled={loading}
                    className="p-2 text-gray-400 hover:text-neon-cyan transition-colors focus:outline-none"
                    title="Refresh List"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-neon-cyan' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold mb-1">Could not load files</p>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12 text-gray-500"
                        >
                            Scanning device storage...
                        </motion.div>
                    ) : files.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16 glass-panel rounded-2xl"
                        >
                            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-gray-300 mb-2">No Saved PDFs Found</h3>
                            <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                Files you process and save in the app will appear here automatically.
                            </p>
                        </motion.div>
                    ) : (
                        files.map((file, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                key={file.name}
                                className="glass-panel p-4 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all"
                            >
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5 text-neon-cyan" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-white truncate mb-1">
                                            {file.name}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                                            <span>{formatBytes(file.size)}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                                            <span>{formatDate(file.mtime)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pl-4 shrink-0">
                                    <button
                                        onClick={() => handleShare(file)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                        title="Share File"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                        title="Delete File"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
