import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FileDropzone } from '../components/FileDropzone';
import { PagePreview } from '../components/PagePreview';
import { usePDFWorker } from '../hooks/usePDFWorker';
import { pdfjsLib } from '../lib/pdfjs-setup';
import toast from 'react-hot-toast';
import { downloadFile } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, GripVertical } from 'lucide-react';

export default function ReorderPagesTool() {
    const [file, setFile] = useState<File | null>(null);
    const [pageOrder, setPageOrder] = useState<number[]>([]);
    const { status, progress, error, processJob, reset, isProcessing } = usePDFWorker();

    const handleFilesAccepted = useCallback(async (newFiles: File[]) => {
        if (newFiles.length > 0) {
            const selectedFile = newFiles[0];
            if (selectedFile.type !== 'application/pdf') {
                toast.error('Only PDF files are allowed.');
                return;
            }

            setFile(selectedFile);
            setPageOrder([]);
            reset();

            try {
                const arrayBuffer = await selectedFile.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                const total = pdf.numPages;
                const initialOrder = Array.from({ length: total }, (_, i) => i + 1);
                setPageOrder(initialOrder);
            } catch (err) {
                console.error("Error loading PDF info:", err);
                toast.error("Failed to load PDF information.");
                setFile(null);
            }
        }
    }, [reset]);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const items = Array.from(pageOrder);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPageOrder(items);
    };

    const handleReorder = async () => {
        if (!file || pageOrder.length === 0) return;

        try {
            const resultBlob = await processJob('reorder-pages', [file], { newOrder: pageOrder });

            if (resultBlob) {
                await downloadFile(resultBlob as Blob, `reordered_${file.name}`);
                toast.success('Pages reordered successfully!');
            }
        } catch (e: any) {
            toast.error(e.message || 'Failed to reorder pages.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8 md:mb-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 pb-2 text-gradient-primary">
                    Reorder PDF Pages
                </h1>
                <p className="text-gray-400 font-mono text-sm md:text-base">
                    Drag and drop page thumbnails to rearrange them in any order you like.
                </p>
            </div>

            {!file ? (
                <div className="mb-12">
                    <FileDropzone
                        onFilesAccepted={handleFilesAccepted}
                        accept={{ 'application/pdf': ['.pdf'] }}
                        title="Upload PDF"
                        subtitle="Drag & drop a single PDF here"
                        maxFiles={1}
                    />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-2xl glass-panel relative"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <ArrowUpDown className="w-5 h-5 text-neon-gold" />
                            Drag to Reorder
                        </h3>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setPageOrder([]);
                                    reset();
                                }}
                                className="text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>

                    <div className="bg-black/20 p-6 rounded-xl border border-white/5 mb-8">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="pages-grid" direction="horizontal">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex flex-wrap gap-6 justify-center"
                                    >
                                        <AnimatePresence>
                                            {pageOrder.map((pageNum, index) => (
                                                <Draggable key={`page-${pageNum}`} draggableId={`page-${pageNum}`} index={index}>
                                                    {(provided, snapshot) => (
                                                        <motion.div
                                                            ref={provided.innerRef}
                                                            {...(provided.draggableProps as any)}
                                                            {...provided.dragHandleProps}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className={`relative group cursor-grab active:cursor-grabbing
                                                            ${snapshot.isDragging ? 'z-50' : 'z-0'}`}
                                                        >
                                                            <div className="absolute -top-3 -left-3 z-10 bg-neon-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-black">
                                                                {index + 1}
                                                            </div>
                                                            <div className="absolute inset-0 bg-neon-gold/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none z-10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,215,0,0.4)]">
                                                                <GripVertical className="text-neon-gold w-8 h-8 drop-shadow-md" />
                                                            </div>

                                                            <PagePreview
                                                                file={file}
                                                                pageNumber={pageNum}
                                                                width={140}
                                                                className={snapshot.isDragging ? 'shadow-[0_10px_30px_rgba(255,215,0,0.5)] border-neon-gold rotate-3' : ''}
                                                            />
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
                    </div>

                    {isProcessing && (
                        <div className="mt-8 mb-6">
                            <div className="flex justify-between text-sm mb-2 text-neon-gold font-mono">
                                <span>Reordering Pages...</span>
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
                        <div className="mb-6 p-4 bg-red-900/40 border border-red-500 rounded text-red-200">
                            {error || "An error occurred during reordering."}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            onClick={handleReorder}
                            disabled={isProcessing}
                            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${isProcessing
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                                : 'bg-white/10 text-white hover:bg-neon-gold hover:text-black border border-neon-gold shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]'
                                }`}
                        >
                            <ArrowUpDown className="w-5 h-5" />
                            {isProcessing ? 'Processing Document...' : 'Apply New Order'}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
