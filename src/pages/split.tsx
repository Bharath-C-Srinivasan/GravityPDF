import { useState, useCallback } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import { PagePreview } from '../components/PagePreview';
import { usePDFWorker } from '../hooks/usePDFWorker';
import toast from 'react-hot-toast';
import { downloadFile } from '../lib/utils';
import { motion } from 'framer-motion';
import { pdfjsLib } from '../lib/pdfjs-setup';

export default function SplitTool() {
    const [file, setFile] = useState<File | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
    const [pageRangeInput, setPageRangeInput] = useState<string>('');

    const parsePageRange = (input: string, maxPages: number): Set<number> => {
        const pages = new Set<number>();
        const parts = input.split(',').map(s => s.trim());
        for (const part of parts) {
            if (!part) continue;
            if (part.includes('-')) {
                const [startStr, endStr] = part.split('-');
                const startRange = parseInt(startStr);
                const endRange = parseInt(endStr);
                if (!isNaN(startRange) && !isNaN(endRange)) {
                    const start = Math.max(1, Math.min(startRange, endRange));
                    const end = Math.min(maxPages, Math.max(startRange, endRange));
                    for (let i = start; i <= end; i++) pages.add(i);
                }
            } else {
                const page = parseInt(part);
                if (!isNaN(page) && page >= 1 && page <= maxPages) pages.add(page);
            }
        }
        return pages;
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPageRangeInput(val);
        if (val.trim() !== '') {
            setSelectedPages(parsePageRange(val, numPages));
        } else {
            const allPages = new Set<number>();
            for (let i = 1; i <= numPages; i++) allPages.add(i);
            setSelectedPages(allPages);
        }
    };
    const { status, progress, error, processJob, reset, isProcessing } = usePDFWorker();

    // Handle file selection
    const handleFilesAccepted = useCallback(async (newFiles: File[]) => {
        if (newFiles.length > 0) {
            const selectedFile = newFiles[0];
            setFile(selectedFile);

            // Determine number of pages
            try {
                const arrayBuffer = await selectedFile.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                setNumPages(pdf.numPages);
                // By default select all pages
                const allPages = new Set<number>();
                for (let i = 1; i <= pdf.numPages; i++) {
                    allPages.add(i);
                }
                setSelectedPages(allPages);
                setPageRangeInput(`1-${pdf.numPages}`);
            } catch (err) {
                toast.error("Could not read PDF file.");
                setFile(null);
            }
        }
    }, []);

    const togglePageSelection = (pageNumber: number) => {
        setSelectedPages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(pageNumber)) {
                newSet.delete(pageNumber);
            } else {
                newSet.add(pageNumber);
            }
                const arr = Array.from(newSet).sort((a,b) => a-b);
            if (arr.length === numPages) setPageRangeInput(`1-${numPages}`);
            else setPageRangeInput(arr.join(', '));
            return newSet;
        });
    };

    const handleSplit = async () => {
        if (!file || selectedPages.size === 0) {
            toast.error("Please select at least one page to extract.");
            return;
        }

        try {
            const selectedArray = Array.from(selectedPages).sort((a, b) => a - b);
            console.log('SplitTool firing processJob with pages:', selectedArray);
            const results = await processJob('split', [file], { pages: selectedArray });
            console.log('SplitTool received results from worker:', results);

            if (results && Array.isArray(results) && results.length > 0) {
                // results[0] contains the extracted PDF blob
                const extractedBlob = results[0];
                await downloadFile(extractedBlob as Blob, `extracted_${file.name}`);

                toast.success("Pages extracted successfully!");
            }
        } catch (e) {
            toast.error("Failed to extract pages. Please try again.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8 md:mb-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 pb-2 text-gradient-primary">
                    Split / Extract PDF
                </h1>
                <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
                    Type a page range or select visually which pages you want to keep. The extracted document will be downloaded instantly.
                </p>
            </div>

            {!file ? (
                <FileDropzone
                    onFilesAccepted={handleFilesAccepted}
                    maxFiles={1}
                    title="Upload PDF to Split"
                    subtitle="One file at a time. Click or drag here."
                />
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                >
                    <div className="p-8 rounded-2xl glass-panel relative">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/10 pb-4 gap-4">
                            <h3 className="text-lg font-bold text-white whitespace-nowrap">
                                Select Pages ({selectedPages.size} / {numPages})
                            </h3>
                            <div className="flex-1 max-w-md w-full mx-auto md:mx-4">
                                <input type="text" value={pageRangeInput} onChange={handleRangeChange} placeholder={`e.g. 1-5, 8, 11-${Math.min(13, numPages)}`} className="w-full bg-black/40 border border-white/20 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all text-sm placeholder:text-gray-500" />
                            </div>
                            <div className="space-x-4">
                                <button
                                    onClick={() => {
                                        const all = new Set<number>();
                                        for (let i = 1; i <= numPages; i++) all.add(i);
                                        setSelectedPages(all);
                                        setPageRangeInput(`1-${numPages}`);
                                    }}
                                    className="text-sm text-gray-400 hover:text-neon-cyan transition-colors"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={() => { setSelectedPages(new Set()); setPageRangeInput(''); }}
                                    className="text-sm text-gray-400 hover:text-neon-cyan transition-colors"
                                >
                                    Deselect All
                                </button>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setNumPages(0);
                                        setSelectedPages(new Set());
                                        setPageRangeInput('');
                                        reset();
                                    }}
                                    className="text-sm text-red-400 hover:text-red-300 transition-colors ml-4"
                                >
                                    Clear File
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                            {Array.from({ length: numPages }).map((_, idx) => {
                                const pageNum = idx + 1;
                                const isSelected = selectedPages.has(pageNum);

                                return (
                                    <motion.div
                                        key={`page-${pageNum}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => togglePageSelection(pageNum)}
                                        className="cursor-pointer relative"
                                    >
                                        <PagePreview
                                            file={file}
                                            pageNumber={pageNum}
                                            width={120}
                                            isSelected={isSelected}
                                        />

                                        {/* Checkbox Indicator */}
                                        <div className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-md z-10 
                      ${isSelected ? 'bg-neon-gold border-neon-gold text-black shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'bg-black/50 border-white/30 text-transparent hover:border-white'}`}
                                        >
                                            {isSelected && (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

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
                                <div className="flex justify-between text-sm mb-2 text-neon-green font-mono">
                                    <span>Extracting Pages...</span>
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

                        {/* Actions */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSplit}
                                disabled={selectedPages.size === 0 || isProcessing}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${selectedPages.size === 0 || isProcessing
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                                    : 'bg-white/10 text-white hover:bg-neon-green hover:text-black border border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)]'
                                    }`}
                            >
                                {isProcessing ? 'Extracting...' : `Extract ${selectedPages.size} Page${selectedPages.size !== 1 ? 's' : ''}`}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
