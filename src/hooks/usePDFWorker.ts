import { useState, useCallback, useRef, useEffect } from 'react';

type JobType = 'merge' | 'split' | 'compress' | 'convert' | 'image-to-pdf' | 'rotate' | 'text-to-pdf' | 'add-watermark' | 'add-page-numbers' | 'delete-pages' | 'reorder-pages' | 'add-blank-pages' | 'grayscale' | 'edit-metadata' | 'flatten';
type JobStatus = 'idle' | 'processing' | 'success' | 'error';

import PdfWorker from '../workers/pdf.worker?worker&inline';

export function usePDFWorker() {
    const [status, setStatus] = useState<JobStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const workerRef = useRef<Worker | null>(null);

    // Initialize worker
    useEffect(() => {
        workerRef.current = new PdfWorker();

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const processJob = useCallback((type: JobType, files: File[], options?: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            setStatus('processing');
            setProgress(0);
            setError(null);

            if (!workerRef.current) {
                const err = new Error("Worker not initialized");
                setStatus('error');
                setError(err.message);
                reject(err);
                return;
            }

            const jobId = Math.random().toString(36).substring(7);

            const messageHandler = (e: MessageEvent) => {
                const { id, status: jobStatus, progress: jobProgress, data, error: jobError } = e.data;

                if (id !== jobId) return;

                if (jobStatus === 'progress') {
                    setProgress(jobProgress);
                } else if (jobStatus === 'success') {
                    setStatus('success');
                    workerRef.current?.removeEventListener('message', messageHandler);
                    resolve(data);
                } else if (jobStatus === 'error') {
                    setStatus('error');
                    setError(jobError);
                    workerRef.current?.removeEventListener('message', messageHandler);
                    reject(new Error(jobError));
                }
            };

            workerRef.current.addEventListener('message', messageHandler);

            workerRef.current.postMessage({
                id: jobId,
                type,
                files,
                options
            });
        });
    }, []);

    const reset = useCallback(() => {
        setStatus('idle');
        setProgress(0);
        setError(null);
    }, []);

    return {
        status,
        progress,
        error,
        processJob,
        reset,
        isProcessing: status === 'processing'
    };
}
