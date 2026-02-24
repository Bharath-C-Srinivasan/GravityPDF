import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FileDropzone } from '../components/FileDropzone';
import { usePDFWorker } from '../hooks/usePDFWorker';
import toast from 'react-hot-toast';
import { downloadFile } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2 } from 'lucide-react';

export default function TextToPDFTool() {
    const [files, setFiles] = useState<File[]>([]);
    const { status, progress, error, processJob, reset, isProcessing } = usePDFWorker();

    const handleFilesAccepted = useCallback((newFiles: File[]) => {
        // Only accept text files
        const textFiles = newFiles.filter(file => file.type === 'text/plain' || file.name.endsWith('.txt'));
        if (textFiles.length < newFiles.length) {
            toast.error('Only text files are allowed (.txt)');
        }
        setFiles(prev => [...prev, ...textFiles]);
    }, []);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const items = Array.from(files);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFiles(items);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        try {
            const result = await processJob('text-to-pdf', files);

            if (result && result[0]) {
                await downloadFile(result[0] as Blob, `converted_text.pdf`);
                toast.success('Text files successfully converted to PDF!');
            }
        } catch (e) {
            toast.error('Conversion failed. Please try again.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8 md:mb-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 pb-2 text-gradient-primary">
                    Text to PDF
                </h1>
                <p className="text-gray-400 font-mono text-sm md:text-base">
                    Convert plain text (.txt) files to PDF documents. Rearrange them instantly via drag & drop.
                </p>
            </div>

            <div className="mb-12">
                <FileDropzone
                    onFilesAccepted={handleFilesAccepted}
                    accept={{ 'text/plain': ['.txt'] }}
                    title="Upload Text Files"
                    subtitle="Drag & drop TXT files here"
                />
            </div>

            {
                files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-2xl glass-panel relative"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-white" />
                                Conversion Order ({files.length})
                            </h3>
                            <button
                                onClick={() => {
                                    setFiles([]);
                                    reset();
                                }}
                                className="text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="text-list" direction="horizontal">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex gap-4 overflow-x-auto pb-6 pt-2 custom-scrollbar min-h-[140px]"
                                    >
                                        <AnimatePresence>
                                            {files.map((file, index) => (
                                                <Draggable key={`${file.name}-${index}`} draggableId={`${file.name}-${index}`} index={index}>
                                                    {(provided, snapshot) => (
                                                        <motion.div
                                                            ref={provided.innerRef}
                                                            {...(provided.draggableProps as any)}
                                                            {...(provided.dragHandleProps as any)}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.8 }}
                                                            className={`relative flex-shrink-0 w-48 h-24 rounded-xl overflow-hidden glass-panel group transition-all duration-300 flex items-center justify-center p-4
                                                        ${snapshot.isDragging ? 'shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105 z-50 border-white' : 'border-white/10 hover:border-white/30'}`}
                                                        >
                                                            <FileText className="w-8 h-8 text-gray-400 mr-2" />
                                                            <div className="flex-1 overflow-hidden">
                                                                <p className="text-sm font-bold text-white truncate" title={file.name}>{file.name}</p>
                                                                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                                            </div>

                                                            {/* Remove Button */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeFile(index);
                                                                }}
                                                                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </AnimatePresence>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        {/* Progress indicator */}
                        {isProcessing && (
                            <div className="mt-8">
                                <div className="flex justify-between text-sm mb-2 text-neon-green font-mono">
                                    <span>Generating PDF...</span>
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

                        {/* Error Handling */}
                        {status === 'error' && (
                            <div className="mt-6 p-4 bg-red-900/40 border border-red-500 rounded text-red-200">
                                {error || "An error occurred during conversion."}
                            </div>
                        )}

                        {/* Convert Action */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleConvert}
                                disabled={isProcessing}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${isProcessing
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                                    : 'bg-white/10 text-white hover:bg-white hover:text-black border border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]'
                                    }`}
                            >
                                {isProcessing ? 'Converting...' : 'Generate PDF'}
                            </button>
                        </div>
                    </motion.div>
                )
            }
        </div >
    );
}
