#!/usr/bin/env node
const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

function findBinaryPath() {
    // Determine if the script is being run globally or locally
    const isGlobalInstall = path.dirname(require.main.filename).includes('node_modules');
    let npmRoot;

    if (isGlobalInstall) {
        // Global installation path
        npmRoot = execSync('npm root -g').toString().trim();
    } else {
        // Local installation path
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

    const binaryPath = path.join(npmRoot, 'node_modules', '@samifouad', binaryFolder, binaryName);

    console.log(`Binary Path: ${binaryPath}`);

    if (fs.existsSync(binaryPath)) {
        return binaryPath;
    }

    console.error(`Binary not found: ${binaryPath}`);
    process.exit(1);
}

const binaryPath = findBinaryPath();
execSync(`"${binaryPath}" ${process.argv.slice(2).join(' ')}`, { stdio: 'inherit' });
