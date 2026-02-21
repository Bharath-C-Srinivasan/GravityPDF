import { useState, useCallback } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import { PagePreview } from '../components/PagePreview';
import { usePDFWorker } from '../hooks/usePDFWorker';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, RotateCcw } from 'lucide-react';
import { pdfjsLib } from '../lib/pdfjs-setup';

export default function RotateTool() {
    const [file, setFile] = useState<File | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    // Map of zero-indexed page numbers to rotation values (0, 90, 180, 270)
    const [rotations, setRotations] = useState<{ [key: number]: number }>({});

    const { status, progress, error, processJob, reset, isProcessing } = usePDFWorker();

    const handleFilesAccepted = useCallback(async (files: File[]) => {
        const selectedFile = files[0];
        setFile(selectedFile);
        setRotations({});
        reset();

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            setNumPages(pdf.numPages);

            // initialize all pages to 0 rotation
            const initialRots: { [key: number]: number } = {};
            for (let i = 0; i < pdf.numPages; i++) {
                initialRots[i] = 0;
            }
            setRotations(initialRots);

        } catch (err) {
            console.error("Failed to parse PDF for rotation:", err);
            toast.error("Could not read PDF file.");
            setFile(null);
        }
    }, [reset]);

    const rotatePage = (pageIndex: number, direction: 'cw' | 'ccw') => {
        setRotations(prev => {
            const currentObj = prev[pageIndex] || 0;
            let nextObj = currentObj + (direction === 'cw' ? 90 : -90);

            // Normalize to 0, 90, 180, 270
            if (nextObj >= 360) nextObj -= 360;
            if (nextObj < 0) nextObj += 360;

            return {
                ...prev,
                [pageIndex]: nextObj
            };
        });
    };

    const handleApplyRotation = async () => {
        if (!file) return;

        try {
            // Options: { rotations: { 0: 90, 1: 180, ... } }
            const resultBlob = await processJob('rotate', [file], { rotations });

            if (resultBlob && Array.isArray(resultBlob)) {
                // Return single blob if its just one document
                const finalBlob = resultBlob[0];
                const url = URL.createObjectURL(finalBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rotated_${file.name}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('Successfully rotated PDF pages!');
            } else if (resultBlob) {
                // Fallback if worker returns generic non-array
                const url = URL.createObjectURL(resultBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rotated_${file.name}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('Successfully rotated PDF pages!');
            }
        } catch (e) {
            toast.error('Rotation failed. Please try again.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-8 md:mb-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 pb-2 text-gradient-primary">
                    Rotate PDF
                </h1>
                <p className="text-gray-400 font-mono text-xs md:text-sm max-w-2xl mx-auto">
                    Hover over any page and click the rotate icons to orient them correctly.
                    Changes are instantly applied directly within your browser.
                </p>
            </div>

            {!file ? (
                <div className="max-w-2xl mx-auto">
                    <FileDropzone
                        onFilesAccepted={handleFilesAccepted}
                        accept={{ 'application/pdf': ['.pdf'] }}
                        maxFiles={1}
                        title="Upload PDF to Rotate"
                    />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col h-full"
                >
                    <div className="glass-panel p-6 rounded-2xl mb-8 flex justify-between items-center sticky top-20 z-40 bg-background/80 backdrop-blur-xl border-x-0 border-t-0 rounded-t-none border-white/10">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <RotateCw className="w-5 h-5 text-neon-purple" />
                                Interactive Rotation
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">{file.name} • {numPages} Pages</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setNumPages(0);
                                    setRotations({});
                                    reset();
                                }}
                                className="px-5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApplyRotation}
                                disabled={isProcessing}
                                className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 ${isProcessing
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                                    : 'bg-purple-900/40 text-purple-100 hover:bg-purple-800/60 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                                    }`}
                            >
                                {isProcessing ? 'Applying...' : 'Apply Rotations'}
                            </button>
                        </div>
                    </div>

                    {/* Progress indicator */}
                    {isProcessing && (
                        <div className="mb-8 px-6">
                            <div className="flex justify-between text-sm mb-2 text-neon-purple font-mono">
                                <span>Rotating document...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                                <motion.div
                                    className="bg-neon-purple h-2 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="mb-8 p-4 bg-red-900/40 border border-red-500 rounded text-red-200 mx-6">
                            {error || "An error occurred during rotation."}
                        </div>
                    )}

                    {/* Grid of Pages */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-6 pb-20">
                        <AnimatePresence>
                            {Array.from({ length: numPages }).map((_, i) => (
                                <motion.div
                                    key={`page-${i}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="relative group flex flex-col items-center"
                                >
                                    <div
                                        className="relative transition-transform duration-300 ease-in-out origin-center"
                                        style={{ transform: `rotate(${rotations[i] || 0}deg)` }}
                                    >
                                        <PagePreview
                                            file={file}
                                            pageNumber={i + 1}
                                            width={140}
                                            className="pointer-events-none"
                                        />
                                    </div>

                                    {/* Overlay UI mapping relative to the grid item, not the rotated preview */}
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-4 z-10 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                        <button
                                            onClick={() => rotatePage(i, 'ccw')}
                                            className="p-3 bg-white/10 hover:bg-purple-600 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 shadow-lg"
                                            title="Rotate left"
                                        >
                                            <RotateCcw className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => rotatePage(i, 'cw')}
                                            className="p-3 bg-white/10 hover:bg-purple-600 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 shadow-lg"
                                            title="Rotate right"
                                        >
                                            <RotateCw className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Page indicator (fixed orientation) */}
                                    <div className="absolute -bottom-3 bg-background border border-white/20 px-3 py-1 rounded-full text-xs font-mono text-gray-300 shadow-xl z-20">
                                        Pg {i + 1} {(rotations[i] > 0) ? `(${rotations[i]}°)` : ''}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
