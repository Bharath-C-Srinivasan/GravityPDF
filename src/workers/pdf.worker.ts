import { PDFDocument, degrees, StandardFonts, rgb } from 'pdf-lib';

self.onmessage = async (e: MessageEvent) => {
    const { id, type, files, options } = e.data;

    try {
        self.postMessage({ id, status: 'progress', progress: 0 });

        switch (type) {
            case 'merge': {
                const mergedPdf = await PDFDocument.create();

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const arrayBuffer = await file.arrayBuffer();
                    const pdfDoc = await PDFDocument.load(arrayBuffer);

                    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                    copiedPages.forEach((page) => mergedPdf.addPage(page));

                    self.postMessage({ id, status: 'progress', progress: Math.round(((i + 1) / files.length) * 100) });
                }

                const mergedPdfBytes = await mergedPdf.save();
                self.postMessage({
                    id,
                    status: 'success',
                    data: [new Blob([mergedPdfBytes as any], { type: 'application/pdf' })]
                });
                break;
            }

            case 'split': {
                console.log('Worker received split command. Options:', options);
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const srcDoc = await PDFDocument.load(arrayBuffer);

                const selectedPages: number[] = options?.pages || srcDoc.getPageIndices();
                console.log('Worker selected pages to extract:', selectedPages);

                const newPdf = await PDFDocument.create();

                self.postMessage({ id, status: 'progress', progress: 30 });

                // pdf-lib uses 0-indexed pages internally but UI might provide 1-indexed. Ensure 0-indexed passed to copyPages
                const indicesToCopy = selectedPages.map(p => p - 1);
                console.log('Worker mapped indices to copy:', indicesToCopy);

                const copiedPages = await newPdf.copyPages(srcDoc, indicesToCopy);
                copiedPages.forEach(page => newPdf.addPage(page));

                self.postMessage({ id, status: 'progress', progress: 80 });

                const newPdfBytes = await newPdf.save();
                self.postMessage({
                    id,
                    status: 'success',
                    data: [new Blob([newPdfBytes as any], { type: 'application/pdf' })]
                });
                break;
            }

            case 'image-to-pdf': {
                const newPdf = await PDFDocument.create();

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const arrayBuffer = await file.arrayBuffer();

                    let image;
                    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                        image = await newPdf.embedJpg(arrayBuffer);
                    } else if (file.type === 'image/png') {
                        image = await newPdf.embedPng(arrayBuffer);
                    } else {
                        throw new Error(`Unsupported image type: ${file.type}`);
                    }

                    const page = newPdf.addPage([image.width, image.height]);
                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: image.width,
                        height: image.height,
                    });

                    self.postMessage({ id, status: 'progress', progress: Math.round(((i + 1) / files.length) * 100) });
                }

                const newPdfBytes = await newPdf.save();
                self.postMessage({
                    id,
                    status: 'success',
                    data: new Blob([newPdfBytes as any], { type: 'application/pdf' })
                });
                break;
            }

            case 'text-to-pdf': {
                const newPdf = await PDFDocument.create();
                const font = await newPdf.embedFont(StandardFonts.Helvetica);
                const fontSize = 12;
                const margin = 50;
                const lineHeight = font.heightAtSize(fontSize) + 4;
                const pageWidth = 595.28; // A4 width
                const pageHeight = 841.89; // A4 height
                const txtWidth = pageWidth - 2 * margin;

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const text = await file.text();
                    const rawLines = text.split(/\r?\n/);
                    const displayLines: string[] = [];

                    // Basic text wrapping
                    for (const line of rawLines) {
                        let currentLine = '';
                        const words = line.split(' ');
                        for (const word of words) {
                            const testLine = currentLine ? `${currentLine} ${word}` : word;
                            const textWidth = font.widthOfTextAtSize(testLine, fontSize);
                            if (textWidth > txtWidth && currentLine !== '') {
                                displayLines.push(currentLine);
                                currentLine = word;
                            } else {
                                currentLine = testLine;
                            }
                        }
                        if (currentLine !== '') {
                            displayLines.push(currentLine);
                        } else if (words.length === 1 && words[0] === '') {
                            displayLines.push('');
                        }
                    }

                    let page = newPdf.addPage([pageWidth, pageHeight]);
                    let currentY = pageHeight - margin;

                    for (const line of displayLines) {
                        if (currentY < margin + lineHeight) {
                            page = newPdf.addPage([pageWidth, pageHeight]);
                            currentY = pageHeight - margin;
                        }
                        page.drawText(line, {
                            x: margin,
                            y: currentY - fontSize,
                            size: fontSize,
                            font: font,
                            color: rgb(0, 0, 0),
                        });
                        currentY -= lineHeight;
                    }

                    self.postMessage({ id, status: 'progress', progress: Math.round(((i + 1) / files.length) * 100) });
                }

                const newPdfBytes = await newPdf.save();
                self.postMessage({
                    id,
                    status: 'success',
                    data: new Blob([newPdfBytes as any], { type: 'application/pdf' })
                });
                break;
            }

            case 'rotate': {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const rotations = options?.rotations || {};

                self.postMessage({ id, status: 'progress', progress: 20 });

                const pages = pdfDoc.getPages();
                for (let i = 0; i < pages.length; i++) {
                    const page = pages[i];
                    const rotationToAdd = rotations[i] || 0;

                    if (rotationToAdd !== 0) {
                        const currentRotation = page.getRotation().angle;
                        let newRotation = currentRotation + rotationToAdd;
                        if (newRotation >= 360) newRotation -= 360;
                        if (newRotation < 0) newRotation += 360;

                        page.setRotation(degrees(newRotation));
                    }

                    self.postMessage({ id, status: 'progress', progress: 20 + Math.round(((i + 1) / pages.length) * 60) });
                }

                const rotatedPdfBytes = await pdfDoc.save();
                self.postMessage({ id, status: 'progress', progress: 95 });

                self.postMessage({
                    id,
                    status: 'success',
                    data: [new Blob([rotatedPdfBytes as any], { type: 'application/pdf' })]
                });
                break;
            }

            case 'compress': {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const level = options?.level || 'recommended'; // 'low' | 'recommended' | 'extreme'

                self.postMessage({ id, status: 'progress', progress: 10 });

                let pdfDoc = await PDFDocument.load(arrayBuffer);
                let finalPdfDoc = pdfDoc;

                if (level === 'extreme') {
                    // Extreme: Create a brand new document and copy pages to force resource deduplication
                    self.postMessage({ id, status: 'progress', progress: 30 });
                    const newPdf = await PDFDocument.create();
                    const indices = pdfDoc.getPageIndices();
                    const copiedPages = await newPdf.copyPages(pdfDoc, indices);
                    copiedPages.forEach(page => newPdf.addPage(page));
                    finalPdfDoc = newPdf;
                    self.postMessage({ id, status: 'progress', progress: 60 });
                }

                // Cleanup metadata based on level
                if (level === 'recommended' || level === 'extreme') {
                    finalPdfDoc.setProducer('GravityPDF');
                    finalPdfDoc.setCreator('GravityPDF');
                }

                if (level === 'extreme') {
                    finalPdfDoc.setTitle('');
                    finalPdfDoc.setAuthor('');
                    finalPdfDoc.setSubject('');
                    finalPdfDoc.setKeywords([]);
                }

                self.postMessage({ id, status: 'progress', progress: 80 });

                // Apply optimization during save
                const compressedPdfBytes = await finalPdfDoc.save({
                    useObjectStreams: true,
                    addDefaultPage: false,
                });

                self.postMessage({ id, status: 'progress', progress: 95 });

                self.postMessage({
                    id,
                    status: 'success',
                    data: [new Blob([compressedPdfBytes as any], { type: 'application/pdf' })]
                });
                break;
            }

            case 'delete-pages': {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const pagesToDeleteStr = options?.pagesToDelete || '';

                self.postMessage({ id, status: 'progress', progress: 10 });

                const srcDoc = await PDFDocument.load(arrayBuffer);
                const totalSrcPages = srcDoc.getPageCount();

                // Parse 1-indexed pages to delete
                const pagesToDelete = new Set<number>();
                const parts = pagesToDeleteStr.split(',').map((s: string) => s.trim());
                for (const part of parts) {
                    if (!part) continue;
                    if (part.includes('-')) {
                        const [startStr, endStr] = part.split('-');
                        const start = parseInt(startStr, 10);
                        const end = parseInt(endStr, 10);
                        if (!isNaN(start) && !isNaN(end) && start <= end) {
                            for (let i = start; i <= end; i++) pagesToDelete.add(i);
                        }
                    } else {
                        const num = parseInt(part, 10);
                        if (!isNaN(num)) pagesToDelete.add(num);
                    }
                }

                self.postMessage({ id, status: 'progress', progress: 30 });

                const newPdf = await PDFDocument.create();

                // Which indices (0-indexed) to keep?
                const indicesToKeep: number[] = [];
                for (let i = 0; i < totalSrcPages; i++) {
                    if (!pagesToDelete.has(i + 1)) {
                        indicesToKeep.push(i);
                    }
                }

                if (indicesToKeep.length === 0) {
                    throw new Error('You cannot delete all pages from the document.');
                }

                const copiedPages = await newPdf.copyPages(srcDoc, indicesToKeep);
                copiedPages.forEach(page => newPdf.addPage(page));

                self.postMessage({ id, status: 'progress', progress: 80 });

                const newPdfBytes = await newPdf.save();
                self.postMessage({ id, status: 'progress', progress: 100 });
                self.postMessage({
                    id,
                    status: 'success',
                    data: [new Blob([newPdfBytes as any], { type: 'application/pdf' })]
                });
                break;
            }

            case 'reorder-pages': {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const newOrder: number[] = options?.newOrder || [];

                self.postMessage({ id, status: 'progress', progress: 10 });

                const srcDoc = await PDFDocument.load(arrayBuffer);

                if (newOrder.length === 0) {
                    throw new Error("No new order provided.");
                }

                self.postMessage({ id, status: 'progress', progress: 30 });

                const newPdf = await PDFDocument.create();

                // newOrder contains 1-indexed page numbers. Convert to 0-indexed for pdf-lib copyPages.
                const indicesToCopy = newOrder.map(page => page - 1);

                const copiedPages = await newPdf.copyPages(srcDoc, indicesToCopy);
                copiedPages.forEach(page => newPdf.addPage(page));

                self.postMessage({ id, status: 'progress', progress: 80 });

                const newPdfBytes = await newPdf.save();
                self.postMessage({ id, status: 'progress', progress: 100 });
                self.postMessage({
                    id,
                    status: 'success',
                    data: [new Blob([newPdfBytes as any], { type: 'application/pdf' })]
                });
                break;
            }

            case 'add-blank-pages': {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const insertionsStr = options?.insertions || '';

                self.postMessage({ id, status: 'progress', progress: 10 });

                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const totalPages = pdfDoc.getPageCount();

                // determine page dimensions from first page, or A4 default
                let width = 595.28;
                let height = 841.89;
                if (totalPages > 0) {
                    const firstPage = pdfDoc.getPage(0);
                    const size = firstPage.getSize();
                    width = size.width;
                    height = size.height;
                }

                self.postMessage({ id, status: 'progress', progress: 30 });

                // parse insertions
                const insertAfterPages = new Set<number>();
                const parts = insertionsStr.split(',').map((s: string) => s.trim());
                for (const part of parts) {
                    if (!part) continue;
                    const num = parseInt(part, 10);
                    if (!isNaN(num) && num >= 0 && num <= totalPages) {
                        insertAfterPages.add(num);
                    }
                }

                // To insert without shifting earlier insertions' logic, we process insertions in reverse order.
                // E.g., if inserting after 5 and after 2, we insert after 5 first.
                // "Insert after 5" means inserting at index `5` in pdf-lib (since index 5 puts the new page before the old index 5, which was page 6... wait.)
                // pdf-lib `insertPage(index)` inserts the page such that it becomes the new `index`.
                // So if we have pages [A, B, C]. "Insert after 1 (A)" means inserting at index 1.
                // "Insert after 0" means inserting at index 0.
                // This matches exactly: "insert after K" -> insert at index K.
                const sortedInsertions = Array.from(insertAfterPages).sort((a, b) => b - a);

                sortedInsertions.forEach(insertIdx => {
                    pdfDoc.insertPage(insertIdx, [width, height]);
                });

                self.postMessage({ id, status: 'progress', progress: 80 });

                const newPdfBytes = await pdfDoc.save();
                self.postMessage({ id, status: 'progress', progress: 100 });
                self.postMessage({
                    id,
                    status: 'success',
                    data: [new Blob([newPdfBytes as any], { type: 'application/pdf' })]
                });
                break;
            }

            case 'add-watermark': {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const watermarkText = options?.text || 'CONFIDENTIAL';
                const opacity = options?.opacity || 0.3;

                self.postMessage({ id, status: 'progress', progress: 10 });

                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                const pages = pdfDoc.getPages();

                self.postMessage({ id, status: 'progress', progress: 30 });

                for (let i = 0; i < pages.length; i++) {
                    const page = pages[i];
                    const { width, height } = page.getSize();

                    // A reasonable font size based on page width
                    const fontSize = width / 8;
                    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
                    const textHeight = font.heightAtSize(fontSize);

                    page.drawText(watermarkText, {
                        x: width / 2 - textWidth / 2,
                        y: height / 2 - textHeight / 2,
                        size: fontSize,
                        font,
                        color: rgb(0.5, 0.5, 0.5),
                        opacity,
                        rotate: degrees(45),
                    });

                    self.postMessage({ id, status: 'progress', progress: 30 + Math.round(((i + 1) / pages.length) * 50) });
                }

                const newPdfBytes = await pdfDoc.save();
                self.postMessage({ id, status: 'progress', progress: 100 });
                self.postMessage({
                    id,
                    status: 'success',
                    data: [new Blob([newPdfBytes as any], { type: 'application/pdf' })]
                });
                break;
            }

            case 'add-page-numbers': {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const position = options?.position || 'bottom-center';

                self.postMessage({ id, status: 'progress', progress: 10 });

                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
                const pages = pdfDoc.getPages();
                const fontSize = 12;

                self.postMessage({ id, status: 'progress', progress: 30 });

                for (let i = 0; i < pages.length; i++) {
                    const page = pages[i];
                    const { width, height } = page.getSize();
                    const text = String(i + 1);
                    const textWidth = font.widthOfTextAtSize(text, fontSize);

                    let x = width / 2 - textWidth / 2;
                    let y = 30;

                    if (position === 'bottom-left') {
                        x = 30;
                    } else if (position === 'bottom-right') {
                        x = width - 30 - textWidth;
                    } else if (position === 'top-left') {
                        x = 30;
                        y = height - 30;
                    } else if (position === 'top-right') {
                        x = width - 30 - textWidth;
                        y = height - 30;
                    } else if (position === 'top-center') {
                        y = height - 30;
                    }

                    page.drawText(text, {
                        x,
                        y,
                        size: fontSize,
                        font,
                        color: rgb(0, 0, 0),
                    });

                    self.postMessage({ id, status: 'progress', progress: 30 + Math.round(((i + 1) / pages.length) * 50) });
                }

                const newPdfBytes = await pdfDoc.save();
                self.postMessage({ id, status: 'progress', progress: 100 });
                self.postMessage({
                    id,
                    status: 'success',
                    data: [new Blob([newPdfBytes as any], { type: 'application/pdf' })]
                });
                break;
            }

            case 'edit-metadata': {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();

                self.postMessage({ id, status: 'progress', progress: 10 });

                const pdfDoc = await PDFDocument.load(arrayBuffer);

                self.postMessage({ id, status: 'progress', progress: 50 });

                if (options?.title) pdfDoc.setTitle(options.title);
                if (options?.author) pdfDoc.setAuthor(options.author);
                if (options?.subject) pdfDoc.setSubject(options.subject);
                if (options?.keywords) {
                    const kws = options.keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
                    pdfDoc.setKeywords(kws);
                }

                pdfDoc.setCreator('GravityPDF');
                pdfDoc.setProducer('GravityPDF');

                self.postMessage({ id, status: 'progress', progress: 80 });

                const newPdfBytes = await pdfDoc.save();
                self.postMessage({ id, status: 'progress', progress: 100 });
                self.postMessage({
                    id,
                    status: 'success',
                    data: [new Blob([newPdfBytes as any], { type: 'application/pdf' })]
                });
                break;
            }

            case 'flatten': {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();

                self.postMessage({ id, status: 'progress', progress: 10 });

                const pdfDoc = await PDFDocument.load(arrayBuffer);

                self.postMessage({ id, status: 'progress', progress: 40 });

                try {
                    const form = pdfDoc.getForm();
                    form.flatten();
                } catch (e) {
                    console.warn('Document has no form to flatten or error flattening', e);
                }

                self.postMessage({ id, status: 'progress', progress: 80 });

                const newPdfBytes = await pdfDoc.save();
                self.postMessage({ id, status: 'progress', progress: 100 });
                self.postMessage({
                    id,
                    status: 'success',
                    data: [new Blob([newPdfBytes as any], { type: 'application/pdf' })]
                });
                break;
            }

            default:
                throw new Error(`Unknown job type: ${type}`);
        }

    } catch (error: any) {
        self.postMessage({ id, status: 'error', error: error.message || "Unknown error inside Web Worker" });
    }
};
