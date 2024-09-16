import { $ } from 'bun'
import crypto from 'node:crypto'
import { createSpinner } from 'nanospinner'
import data from '@/package.json' with { type: 'json' }
import { sysinfo } from '@/utils'
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { Kv } from '../types/type'

export async function login() {
    let spinner = createSpinner(' task: initiate login flow for fromafri.ca').start();

    let metadata: Kv = [
        { client: `${data.name}_v${data.version}`}
    ] satisfies Kv

    const client_info = await sysinfo()

    metadata.push(...client_info)

    const device_code = generateDeviceCode()

    let user_code

    try {
        const response = await fetch('https://fromafri.ca/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_code, 'metadata': metadata })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.userCode !== undefined)
                user_code = data.userCode

            spinner.success();
        } else {
            throw 'error initiating device flow'
        }
    } catch (error) {
        spinner.error({ text: 'Login failed: '+ error });
        process.exit(1); // Exit with failure code
    }

    console.log(`\nnavigate to: https://fromafri.ca/cli`);
    console.log('\n');
    console.log('enter this code: '+ user_code)
    console.log('\n');

    let spinner2 = createSpinner(' task: waiting for login...').start();

    let auth_token = '';
    let checkInterval: any // Variable to hold the interval ID

    // Function to check the token
    async function checkToken() {
        try {
            const response = await fetch('https:fromafri.ca/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device_code })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.token !== undefined) {
                    auth_token = data.token;
                    spinner2
                    spinner2.success();
                    clearInterval(checkInterval); // Stop polling once the token is received
                    saveToken(auth_token)
                    process.exit(0); // Exit with success code
                }
            } else {
                throw new Error('Error initiating device flow');
            }
        } catch (error) {
            spinner.error({ text: 'Login failed: ' + error });
            clearInterval(checkInterval); // Stop polling on error
            process.exit(1); // Exit with failure code
        }
    }

    // Start polling every 3 seconds
    checkInterval = setInterval(checkToken, 3000);

    // Limit of 60 seconds for this process
    setTimeout(() => {
        clearInterval(checkInterval); // Stop polling
        if (auth_token === '') {
            spinner2.error({ text: 'Login failed: timeout' });
            process.exit(1); // Exit with failure code
        }
    }, 60000);
}

// Function to generate a secure `device_code`
function generateDeviceCode(length = 32) {
  return crypto.randomBytes(length).toString('hex'); // Generate a hexadecimal string
}

function saveToken(token) {
    const homeDir = os.homedir(); // Get user's home directory
    const dirPath = path.join(homeDir, '.fromafrica'); // ~/.fromafrica
    const filePath = path.join(dirPath, 'auth.json'); // ~/.fromafrica/auth.json

    // Check if directory exists, if not, create it
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Save the token to auth.json
    const tokenData = { token };
    fs.writeFileSync(filePath, JSON.stringify(tokenData, null, 2));
}