import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FileDropzone } from '../components/FileDropzone';
import { PagePreview } from '../components/PagePreview';
import { usePDFWorker } from '../hooks/usePDFWorker';
import toast from 'react-hot-toast';
import { downloadFile } from '../lib/utils';
import { motion } from 'framer-motion';

export default function MergeTool() {
    const [files, setFiles] = useState<File[]>([]);
    const { status, progress, error, processJob, reset, isProcessing } = usePDFWorker();

    // Handle files dropped or selected
    const handleFilesAccepted = useCallback((newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    // Remove a specific file
    const removeFile = useCallback((indexToRemove: number) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    }, []);

    // Handle drag and drop reordering
    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(files);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFiles(items);
    };

    const handleMerge = async () => {
        if (files.length < 2) return;

        try {
            const result = await processJob('merge', files);
            if (result) {
                // Create download link
                await downloadFile(result as Blob, 'merged_gravitypdf.pdf');

                toast.success("PDF merged successfully!");
            }
        } catch (err) {
            toast.error("Failed to merge PDFs. Please try again.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8 md:mb-12 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 pb-2 text-gradient-primary">
                    Merge PDF Files
                </h1>
                <p className="text-gray-400 font-mono text-sm md:text-base">
                    Drag and drop to combine PDFs in the exact order you want.
                </p>
            </div>

            <div className="space-y-8">
                <FileDropzone
                    onFilesAccepted={handleFilesAccepted}
                    title="Add PDFs to merge"
                    subtitle="Supports multiple files. Drop them here."
                    accept={{ 'application/pdf': ['.pdf'] }}
                />

                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-2xl glass-panel relative"
                    >
                        <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">
                            Arrange Files ({files.length})
                        </h3>

                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="pdf-list" direction="horizontal">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex flex-wrap gap-6 items-center min-h-[220px]"
                                    >
                                        {files.map((file, index) => (
                                            <Draggable key={`${file.name}-${index}`} draggableId={`${file.name}-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            zIndex: snapshot.isDragging ? 50 : 'auto',
                                                        }}
                                                    >
                                                        <PagePreview
                                                            file={file}
                                                            onRemove={() => removeFile(index)}
                                                            width={140}
                                                            isSelected={snapshot.isDragging}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        {/* Error Message */}
                        {status === 'error' && (
                            <div className="mt-6 p-4 bg-red-900/40 border border-red-500 rounded text-red-200">
                                {error || "An error occurred during processing."}
                                <button onClick={reset} className="ml-4 underline hover:text-white">Dismiss</button>
                            </div>
                        )}

                        {/* Progress Bar */}
                        {isProcessing && (
                            <div className="mt-8">
                                <div className="flex justify-between text-sm mb-2 text-neon-cyan font-mono">
                                    <span>Processing...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                                    <motion.div
                                        className="bg-neon-cyan h-2 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.8)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleMerge}
                                disabled={files.length < 2 || isProcessing}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${files.length < 2 || isProcessing
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                                    : 'bg-white/5 text-white hover:bg-neon-cyan hover:text-black border border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)]'
                                    }`}
                            >
                                {isProcessing ? 'Merging...' : 'Merge PDFs'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
