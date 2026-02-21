import { PDFDocument, degrees } from 'pdf-lib';

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
                    data: new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
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
                    data: [new Blob([newPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })]
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
                    data: new Blob([newPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
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
                    data: new Blob([rotatedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
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
                    data: new Blob([compressedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
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
