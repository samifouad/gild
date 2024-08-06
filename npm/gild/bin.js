#!/usr/bin/env node
const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

let binaryPath;

// Determine if the script is running from a global installation or a local one
const isGlobalInstall = path.dirname(require.main.filename).includes('node_modules');

try {
    let npmRoot;
    if (isGlobalInstall) {
        // Global install path
        npmRoot = execSync("npm root -g").toString().trim();
    } else {
        // Local install path
        npmRoot = path.dirname(require.main.filename);
    }

    console.log(`npmRoot: ${npmRoot}`);

    const binaryName = os.platform() === 'win32' ? 'gild.exe' : 'gild';
    const binaryFolder = os.platform() === 'win32'
        ? 'gild-windows-x64'
        : os.platform() === 'linux'
        ? 'gild-linux-x64'
        : os.platform() === 'darwin'
        ? os.arch() === 'x64'
            ? 'gild-darwin-x64'
            : 'gild-darwin-arm64'
        : '';

    binaryPath = path.join(npmRoot, 'node_modules', '@samifouad', binaryFolder, binaryName);

    console.log(`Binary Path: ${binaryPath}`);

    // Check if the binary exists before trying to execute it
    if (!fs.existsSync(binaryPath)) {
        console.error(`Binary not found: ${binaryPath}`);
        process.exit(1);
    }

    // Execute the binary with any arguments passed to the script
    execSync(`"${binaryPath}" ${process.argv.slice(2).join(' ')}`, { stdio: 'inherit' });
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
