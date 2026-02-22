import fs from 'fs';
import path from 'path';

const pagesDir = './src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes("document.createElement('a')")) {
        // Add import if missing
        if (!content.includes("import { downloadFile }")) {
            content = content.replace("import toast from 'react-hot-toast';", "import toast from 'react-hot-toast';\nimport { downloadFile } from '../lib/utils';");
        }

        // Replace exact download pattern:
        // const url = URL.createObjectURL(mergedBlob as Blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'merged_gravitypdf.pdf';
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
        // URL.revokeObjectURL(url);
        // Sometimes it's `blob as Blob`, `blob`, etc. So regex handles it.
        const downloadRegex = /const\s+url\s*=\s*URL\.createObjectURL\(\s*(.*?)\s*\);\s*const\s+a\s*=\s*document\.createElement\('a'\);\s*a\.href\s*=\s*url;\s*a\.download\s*=\s*(.*?);\s*document\.body\.appendChild\(a\);\s*a\.click\(\);\s*document\.body\.removeChild\(a\);\s*URL\.revokeObjectURL\(url\);/gs;

        content = content.replace(downloadRegex, (match, blobName, fileName) => {
            // Provide safe await implementation
            const cleanBlobName = blobName.replace(/\s+as\s+Blob$/, '').trim();
            return `await downloadFile(${cleanBlobName} as Blob, ${fileName});`;
        });

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}
