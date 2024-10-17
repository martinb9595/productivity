const fs = require('fs');
const path = require('path');

function checkTailwind() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const tailwindConfigPath = path.join(__dirname, 'tailwind.config.js');
    const cssFilePath = path.join(__dirname, 'src', 'index.css');

    // Check package.json
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        if (packageJson.dependencies && packageJson.dependencies['tailwindcss']) {
            console.log('Tailwind CSS is installed in package.json.');
        } else {
            console.log('Tailwind CSS is NOT installed in package.json.');
        }
    } else {
        console.log('package.json not found.');
    }

    // Check tailwind.config.js
    if (fs.existsSync(tailwindConfigPath)) {
        console.log('tailwind.config.js exists.');
    } else {
        console.log('tailwind.config.js not found.');
    }

    // Check main CSS file for Tailwind directives
    if (fs.existsSync(cssFilePath)) {
        const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
        if (cssContent.includes('@tailwind base;') && cssContent.includes('@tailwind components;') && cssContent.includes('@tailwind utilities;')) {
            console.log('Tailwind CSS directives are present in the CSS file.');
        } else {
            console.log('Tailwind CSS directives are NOT present in the CSS file.');
        }
    } else {
        console.log('Main CSS file not found.');
    }
}

checkTailwind();
