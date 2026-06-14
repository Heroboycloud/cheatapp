const ePub = require('epub-gen');
const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');

// Ensure output directory exists - use absolute path
const outputDir = path.join(process.cwd(), 'output');
fs.ensureDirSync(outputDir);
console.log(`📁 Output directory: ${outputDir}`);

// Get version from environment or generate
const versionType = process.env.VERSION_TYPE || 'patch';
let currentVersion = '1.0.0';

// Try to read existing version
try {
  if (fs.existsSync('version.txt')) {
    currentVersion = fs.readFileSync('version.txt', 'utf-8').trim();
    currentVersion = incrementVersion(currentVersion, versionType);
  }
} catch (e) {
  console.log('No existing version found, starting at 1.0.0');
}

// Save new version
fs.writeFileSync('version.txt', currentVersion);
console.log(`📚 Generating Programming Cheatsheets v${currentVersion}`);

// Define all cheatsheets (same as before - I'm keeping it short here)
const cheatsheets = {
  python: {
    title: "🐍 Python Cheatsheet",
    content: `
      <h1>Python Cheatsheet</h1>
      <h2>Basic Syntax</h2>
      <pre><code># Variables
name = "John"
age = 25
print(f"Hello {name}")</code></pre>
    `
  },
  javascript: {
    title: "📜 JavaScript Cheatsheet", 
    content: `
      <h1>JavaScript Cheatsheet</h1>
      <h2>Variables</h2>
      <pre><code>let name = "John";
const age = 25;
console.log(` + '`Hello ${name}`' + `);</code></pre>
    `
  },
  git: {
    title: "📦 Git Cheatsheet",
    content: `
      <h1>Git Cheatsheet</h1>
      <pre><code>git init
git add .
git commit -m "message"
git push origin main</code></pre>
    `
  }
  // Add your other cheatsheets here...
};

// Select which cheatsheets to include
let selectedCheatsheets = Object.values(cheatsheets);
const languagesFilter = process.env.LANGUAGES || 'all';

if (languagesFilter !== 'all') {
  const languages = languagesFilter.split(',');
  selectedCheatsheets = selectedCheatsheets.filter(cheat => 
    languages.some(lang => cheat.title.toLowerCase().includes(lang))
  );
}

console.log(`Including ${selectedCheatsheets.length} cheatsheets`);

// Build the content
const content = [
  {
    title: "Introduction",
    data: `
      <div style="text-align: center;">
        <h1>📚 Programming Cheatsheets Collection</h1>
        <p><strong>Version ${currentVersion}</strong></p>
        <p>Generated on ${moment().format('MMMM Do YYYY, h:mm:ss a')}</p>
        <hr/>
        <h2>Table of Contents</h2>
        ${selectedCheatsheets.map((sheet, idx) => 
          `<p><a href="#section-${idx}">${sheet.title}</a></p>`
        ).join('')}
      </div>
    `
  },
  ...selectedCheatsheets.map((sheet, idx) => ({
    title: sheet.title,
    data: `<div id="section-${idx}">${sheet.content}</div>`
  }))
];

// Create absolute file path
const epubFileName = `Programming-Cheatsheets-${currentVersion}.epub`;
const epubOutputPath = path.join(outputDir, epubFileName);

console.log(`📖 Generating EPUB...`);
console.log(`📄 Will save to: ${epubOutputPath}`);

// Generate the EPUB
const options = {
  title: `Programming Cheatsheets v${currentVersion}`,
  author: "GitHub Actions Auto-Generator",
  publisher: "Open Source Community",
  description: "A comprehensive collection of programming cheatsheets",
  cover: null,
  output: epubOutputPath,  // Use absolute path
  version: 3,
  lang: "en",
  css: `
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      margin: 2em;
      color: #333;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
    }
    h2 {
      color: #34495e;
      border-left: 4px solid #3498db;
      padding-left: 0.5em;
    }
    pre {
      background-color: #f4f4f4;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 1em;
      overflow-x: auto;
    }
    code {
      background-color: #f4f4f4;
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
  `,
  content: content
};

// Use Promise instead of callback for better error handling
async function generateBook() {
  return new Promise((resolve, reject) => {
    new ePub(options, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Run the generation
generateBook()
  .then(() => {
    console.log(`✅ EPUB generated successfully!`);
    console.log(`📚 File: ${epubFileName}`);
    
    // Verify file exists
    if (fs.existsSync(epubOutputPath)) {
      const stats = fs.statSync(epubOutputPath);
      console.log(`📏 Size: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`📍 Full path: ${epubOutputPath}`);
    } else {
      console.error(`❌ File was not created at expected path!`);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("❌ Error generating EPUB:", err);
    process.exit(1);
  });

// Helper function to increment version
function incrementVersion(version, type) {
  const parts = version.split('.').map(Number);
  
  switch(type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2]++;
      break;
  }
  
  return parts.join('.');
}
