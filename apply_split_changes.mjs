import fs from 'fs';

try {
    let text = fs.readFileSync('src/pages/split.tsx', 'utf8');

    // 1. Add state and parsing logic
    text = text.replace(
        /const \[selectedPages, setSelectedPages\](.*)/,
        `const [selectedPages, setSelectedPages]$1\n    const [pageRangeInput, setPageRangeInput] = useState<string>('');\n\n    const parsePageRange = (input: string, maxPages: number): Set<number> => {\n        const pages = new Set<number>();\n        const parts = input.split(',').map(s => s.trim());\n        for (const part of parts) {\n            if (!part) continue;\n            if (part.includes('-')) {\n                const [startStr, endStr] = part.split('-');\n                const startRange = parseInt(startStr);\n                const endRange = parseInt(endStr);\n                if (!isNaN(startRange) && !isNaN(endRange)) {\n                    const start = Math.max(1, Math.min(startRange, endRange));\n                    const end = Math.min(maxPages, Math.max(startRange, endRange));\n                    for (let i = start; i <= end; i++) pages.add(i);\n                }\n            } else {\n                const page = parseInt(part);\n                if (!isNaN(page) && page >= 1 && page <= maxPages) pages.add(page);\n            }\n        }\n        return pages;\n    };\n\n    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n        const val = e.target.value;\n        setPageRangeInput(val);\n        if (val.trim() !== '') {\n            setSelectedPages(parsePageRange(val, numPages));\n        } else {\n            const allPages = new Set<number>();\n            for (let i = 1; i <= numPages; i++) allPages.add(i);\n            setSelectedPages(allPages);\n        }\n    };`
    );

    // 2. Set default input when file loaded
    text = text.replace(
        /setSelectedPages\(allPages\);\s*\} catch \(err\)/,
        `setSelectedPages(allPages);\n                setPageRangeInput(\`1-\${pdf.numPages}\`);\n            } catch (err)`
    );

    // 3. Update toggle logic to sync back to string where simple
    text = text.replace(
        /return newSet;\s*\}\);\s*\};/,
        `    const arr = Array.from(newSet).sort((a,b) => a-b);\n            if (arr.length === numPages) setPageRangeInput(\`1-\${numPages}\`);\n            else setPageRangeInput(arr.join(', '));\n            return newSet;\n        });\n    };`
    );

    // 4. Update "Select All" logic implicitly created inline inside the button
    text = text.replace(
        /const all = new Set<number>\(\);\s*for \(let i = 1; i <= numPages; i\+\+\) all\.add\(i\);\s*setSelectedPages\(all\);/,
        `const all = new Set<number>();\n                                        for (let i = 1; i <= numPages; i++) all.add(i);\n                                        setSelectedPages(all);\n                                        setPageRangeInput(\`1-\${numPages}\`);`
    );

    // 5. Update "Deselect All" button logic
    text = text.replace(
        /onClick=\{\(\) => setSelectedPages\(new Set\(\)\)\}/,
        `onClick={() => { setSelectedPages(new Set()); setPageRangeInput(''); }}`
    );

    // 6. Update "Clear File" button logic
    text = text.replace(
        /setSelectedPages\(new Set\(\)\);\s*reset\(\);/,
        `setSelectedPages(new Set());\n                                        setPageRangeInput('');\n                                        reset();`
    );

    // 7. Inject the UI Input
    text = text.replace(
        /<div className="flex justify-between items-center mb-6 border-b border-white\/10 pb-4">[\s\S]*?<h3 className="text-lg font-bold text-white">[\s\S]*?Select Pages \(\{selectedPages\.size\} \/ \{numPages\}\)[\s\S]*?<\/h3>/,
        `<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/10 pb-4 gap-4">\n                            <h3 className="text-lg font-bold text-white whitespace-nowrap">\n                                Select Pages ({selectedPages.size} / {numPages})\n                            </h3>\n                            <div className="flex-1 max-w-md w-full mx-auto md:mx-4">\n                                <input type="text" value={pageRangeInput} onChange={handleRangeChange} placeholder={\`e.g. 1-5, 8, 11-\${Math.min(13, numPages)}\`} className="w-full bg-black/40 border border-white/20 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all text-sm placeholder:text-gray-500" />\n                            </div>`
    );

    // 8. Add instructional text
    text = text.replace(
        /Select visually which pages you want to keep\./,
        `Type a page range or select visually which pages you want to keep.`
    );

    fs.writeFileSync('src/pages/split.tsx', text);
    console.log("Successfully patched split.tsx with UI included!");
} catch (e) {
    console.error("Error patching:", e);
}
