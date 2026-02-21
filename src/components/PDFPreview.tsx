import React from 'react';
import { FileText } from 'lucide-react';

interface PDFPreviewProps {
    file: File;
    onRemove?: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ file, onRemove }) => {
    // In a real implementation, this would use pdf.js to render a canvas thumbnail
    // For the framework, we'll build the UI shell first

    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);

    return (
        <div className="relative group flex flex-col items-center p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow w-48">
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    ×
                </button>
            )}

            <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-3">
                <FileText className="w-12 h-12 text-gray-400" />
            </div>

            <div className="w-full text-center">
                <p className="text-sm font-medium text-gray-700 truncate w-full" title={file.name}>
                    {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {fileSizeInMB} MB
                </p>
            </div>
        </div>
    );
};
