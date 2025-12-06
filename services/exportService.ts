
import JSZip from 'jszip';

// This service reconstructs the project files for download
// since we can't easily access the file system in the browser runtime.

export const downloadProjectZip = async () => {
  const zip = new JSZip();
  const src = zip.folder("src");
  const components = src?.folder("components");
  const services = src?.folder("services");

  // 1. Root Configuration Files
  zip.file("package.json", `{
  "name": "active-unknownperson-ai",
  "private": true,
  "version": "2.6.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^1.30.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-markdown": "^10.1.0",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2",
    "typescript": "^5.0.2",
    "vite": "^4.3.2"
  }
}`);

  zip.file("vite.config.ts", `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  }
})
`);

  zip.file("tsconfig.json", `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`);

  zip.file("tailwind.config.js", `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          900: '#050a10',
          800: '#0f172a',
          700: '#1e293b',
          neon: '#00f3ff',
          danger: '#ff0055',
          matrix: '#00ff41'
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'],
        sans: ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        }
      }
    },
  },
  plugins: [],
}
`);

  zip.file("index.html", `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Active_unknownperson - System Interface</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>`);

  // 2. Source Files
  src?.file("index.tsx", `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);

  src?.file("index.css", `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;600&family=Inter:wght@300;400;600;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #050a10;
  color: #e2e8f0;
}
`);

  // Fetch current contents via fetch if possible, otherwise use placeholder logic
  // Since we are in a web container, we can try to fetch the known files
  const filesToFetch = [
    { path: './App.tsx', folder: src, name: 'App.tsx' },
    { path: './types.ts', folder: src, name: 'types.ts' },
    { path: './constants.ts', folder: src, name: 'constants.ts' },
    { path: './components/Sidebar.tsx', folder: components, name: 'Sidebar.tsx' },
    { path: './components/ChatArea.tsx', folder: components, name: 'ChatArea.tsx' },
    { path: './components/MessageBubble.tsx', folder: components, name: 'MessageBubble.tsx' },
    { path: './components/SystemStatus.tsx', folder: components, name: 'SystemStatus.tsx' },
    { path: './components/LiveVoiceModal.tsx', folder: components, name: 'LiveVoiceModal.tsx' },
    { path: './components/BiosBoot.tsx', folder: components, name: 'BiosBoot.tsx' },
    { path: './services/geminiService.ts', folder: services, name: 'geminiService.ts' },
  ];

  // Generate README
  zip.file("README.md", `# Active_unknownperson AI Interface

## Installation
1. Unzip files
2. Run \`npm install\`
3. Run \`npm run dev\`

## Configuration
Create a \`.env\` file and add:
\`VITE_API_KEY=your_gemini_api_key\`
`);

  // Attempt to fetch the actual source code from the runtime environment
  // This works in most dev server setups (like Vite)
  for (const file of filesToFetch) {
    try {
      const response = await fetch(file.path);
      if (response.ok) {
        const text = await response.text();
        file.folder?.file(file.name, text);
      } else {
        file.folder?.file(file.name, `// Error fetching file: ${file.name}\n// Please copy manually.`);
      }
    } catch (e) {
      console.error(`Failed to bundle ${file.name}`, e);
      file.folder?.file(file.name, `// Error fetching file: ${file.name}`);
    }
  }

  // Generate the zip blob
  const blob = await zip.generateAsync({ type: "blob" });
  
  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "active_unknownperson_source.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
