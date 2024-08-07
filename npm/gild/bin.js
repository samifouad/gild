#!/usr/bin/env node
const { execSync } = require('child_process')
const os = require('os')
const fs = require('fs')

let binaryPath;
let platform = os.platform().toString().trim()
let arch = os.arch()
let global = is_global()

if (global) {
    let global_path = execSync("npm root -g").toString().trim()
    
    switch (platform) {
        case 'darwin':
            binaryPath = os.arch() === 'x64'
                ? global_path +'/@samifouad/gild/node_modules/@samifouad/gild-darwin-x64/gild'
                : global_path +'/@samifouad/gild/node_modules/@samifouad/gild-darwin-arm64/gild'
        break;
        case 'win32':
            binaryPath = global_path +'\\@samifouad\\gild\\node_modules\\@samifouad\\gild-windows-x64\\gild.exe'
        break;
        case 'linux':
            binaryPath = fs.realpathSync(global_path +'/@samifouad/gild/node_modules/@samifouad/gild-linux-x64/gild')
        break;
        default:
            console.error(`Unsupported platform: ${os.platform()}`)
            process.exit(1)
    }

    // Execute the binary with any arguments passed to the script
    const args = process.argv.slice(2);
    const processResult = spawnSync(binaryPath, args, { stdio: "inherit" });
    process.exit(processResult.status ?? 0)

} else {
    
    switch (platform) {
        case 'darwin':
            binaryPath = require.resolve(`gild-${os}-${arch}/gild`)
        break;
        case 'win32':
            binaryPath = require.resolve(`gild-${os}-${arch}/gild.exe`)
        break;
        case 'linux':
            binaryPath = require.resolve(`gild-${os}-${arch}/gild`)
        break;
        default:
            console.error(`Unsupported platform: ${os.platform()}`)
            process.exit(1)
    }

    // Execute the binary with any arguments passed to the script
    const args = process.argv.slice(2);
    const processResult = spawnSync(binaryPath, args, { stdio: "inherit" });
    process.exit(processResult.status ?? 0)
}
function is_global() {
    let globals = execSync("npm ls --depth=0 -global").toString();
    if (globals.includes("@samifouad/gild")) {
        return true
    }
    return false
}