import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function downloadFile(blob: Blob, filename: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
        try {
            // Convert Blob to base64 string for Capacitor
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            const base64Data = await new Promise<string>((resolve, reject) => {
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        resolve(reader.result.split(',')[1]);
                    } else {
                        reject('Failed to convert blob to base64');
                    }
                };
                reader.onerror = reject;
            });

            // Write the file to device Cache
            const savedFile = await Filesystem.writeFile({
                path: filename,
                data: base64Data,
                directory: Directory.Cache,
            });

            // Pop the native share sheet
            await Share.share({
                title: 'Save or Share File',
                text: `Here is your gravityPDF file: ${filename}`,
                url: savedFile.uri,
                dialogTitle: 'Save ' + filename
            });

        } catch (e) {
            console.error("Native download failed", e);
            throw e;
        }
    } else {
        // Standard Web Download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
