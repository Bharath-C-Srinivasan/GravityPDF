/src
 ├── /components
 │    ├── /ui             # Buttons, Cards, Modals (Shadcn/UI style)
 │    ├── FileDropzone.tsx # The universal upload component
 │    └── PDFPreview.tsx   # Renders a single PDF page to Canvas
 ├── /hooks
 │    └── usePDFWorker.ts  # Custom hook to talk to the Web Worker
 ├── /lib
 │    ├── pdf-tools.ts     # Pure functions for Merge, Split, Rotate
 │    └── utils.ts         # Formatting sizes, dates, etc.
 ├── /pages (or /app)
 │    ├── index.tsx        # The "All Tools" Dashboard
 │    ├── merge.tsx        # The Merge Tool UI
 │    └── split.tsx        # The Split Tool UI
 └── /workers
      └── pdf.worker.ts    # The background thread for processing