import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
    onFilesAccepted: (files: File[]) => void;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    className?: string;
    title?: string;
    subtitle?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
    onFilesAccepted,
    accept = {
        'application/pdf': ['.pdf'],
    },
    maxFiles = 0, // 0 means unlimited
    className,
    title = "Choose Files",
    subtitle = "or drop files here"
}) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFilesAccepted(acceptedFiles);
        }
    }, [onFilesAccepted]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: maxFiles > 0 ? maxFiles : undefined,
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "flex flex-col items-center justify-center w-full max-w-3xl p-16 mx-auto",
                "border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden group glass-panel",
                isDragActive
                    ? "border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.4)] bg-white/10"
                    : "border-white/20 hover:border-white/50 hover:bg-white/10",
                className
            )}
        >
            <input {...getInputProps()} />

            {/* Background glow effect on drag */}
            <div className={cn(
                "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-cyan/20 to-transparent opacity-0 transition-opacity duration-500 pointer-events-none",
                isDragActive && "opacity-100"
            )} />

            <div className="flex flex-col items-center justify-center space-y-6 text-center relative z-10 transition-transform duration-300 group-hover:scale-105">
                <div className={cn(
                    "p-5 rounded-full backdrop-blur-md transition-all duration-300 border",
                    isDragActive
                        ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50 shadow-[0_0_20px_rgba(0,243,255,0.5)]"
                        : "bg-white/5 text-gray-400 border-white/10 group-hover:bg-white/10 group-hover:text-white"
                )}>
                    <Upload className="w-10 h-10" />
                </div>

                <div>
                    <p className={cn(
                        "text-2xl font-bold tracking-tight transition-colors",
                        isDragActive ? "text-neon-cyan text-glow-cyan" : "text-white group-hover:text-glow-cyan group-hover:text-white"
                    )}>
                        {title}
                    </p>
                    <p className="text-base text-gray-400 mt-2 font-mono">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
};
