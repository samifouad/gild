#!/usr/bin/env node
const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');

let binaryPath;

switch (os.platform().toString().trim()) {
    case 'darwin':
        let dariwinNpmGlobal = execSync("npm root -g").toString().trim();
        binaryPath = os.arch() === 'x64'
            ? dariwinNpmGlobal +'/gild/node_modules/@samifouad/gild-darwin-x64/gild'
            : dariwinNpmGlobal +'/gild/node_modules/@samifouad/gild-darwin-arm64/gild';
        break;
    case 'win32':
        let winNpmGlobal = execSync("npm root -g").toString().trim();
        binaryPath = winNpmGlobal +'\\gild\\node_modules\\@samifouad\\gild-windows-x64\\gild.exe';
        break;
    case 'linux':
        let linuxNpmGlobal = execSync("npm root -g").toString().trim();
        binaryPath = fs.realpathSync(linuxNpmGlobal +'/gild/node_modules/@samifouad/gild-linux-x64/gild');
        break;
    default:
        console.error(`Unsupported platform: ${os.platform()}`);
        process.exit(1);
}

// Execute the binary with any arguments passed to the script
execSync(`"${binaryPath}" ${process.argv.slice(2).join(' ')}`, { stdio: 'inherit' });