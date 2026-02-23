import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import toast from 'react-hot-toast';

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

            // Write the file to device Documents
            const savedFile = await Filesystem.writeFile({
                path: filename,
                data: base64Data,
                directory: Directory.Documents,
            });

            // Prompt the user with a custom Toast instead of aggressive sharing
            toast((t) => (
                <div className="flex flex-col gap-3 w-[80vw] max-w-sm bg-gray-900 border border-white/10 p-5 rounded-2xl shadow-2xl mx-auto">
                    <p className="text-white text-base font-medium text-center">Successfully saved <strong>{filename}</strong></p>
                    <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                import('@capawesome-team/capacitor-file-opener').then(({ FileOpener }) => {
                                    FileOpener.openFile({ path: savedFile.uri }).catch(err => {
                                        console.error("Failed to open file", err);
                                        toast.error("No default PDF viewer found.");
                                    });
                                });
                            }}
                            className="w-full bg-neon-cyan/20 hover:bg-neon-cyan text-neon-cyan hover:text-black transition-colors px-4 py-3 rounded-xl text-sm font-bold text-center active:scale-95"
                        >
                            Open File
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                Share.share({
                                    title: 'Share PDF',
                                    text: `Sharing ${filename}`,
                                    url: savedFile.uri,
                                    dialogTitle: 'Share ' + filename
                                }).catch(console.error);
                            }}
                            className="w-full bg-neon-magenta/20 hover:bg-neon-magenta text-neon-magenta hover:text-white transition-colors px-4 py-3 rounded-xl text-sm font-bold text-center active:scale-95"
                        >
                            Share File
                        </button>
                    </div>
                </div>
            ), {
                duration: 6000,
                position: 'top-center',
                style: {
                    marginTop: '25vh',
                    minWidth: '80vw',
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0
                }
            });

        } catch (e) {
            console.error("Native download failed", e);
            toast.error("Failed to save file.");
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
