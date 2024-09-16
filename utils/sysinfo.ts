import type { Kv } from '@/core/types/type'
import os from 'node:os'
import crypto from 'node:crypto'

// Function to generate the truncated SHA-256 hash of the IP address
function generateTruncatedHash(ipAddress: string): string {
    // Create a SHA-256 hash, take the first 12 characters
    return crypto.createHash('sha256').update(ipAddress).digest('hex').slice(0, 12);
}

// Function to format the hash with semicolons (similar to MAC address style)
function formatHashWithSemicolons(hash: string): string {
    // Insert semicolons every two characters to get the format like '12:34:56:78:90'
    return hash.match(/.{1,2}/g)?.join(':') || hash;
}

// Main sysinfo function
export async function sysinfo(): Promise<Kv> {
    const platform = os.platform();
    const osVersion = os.release();
    const architecture = os.arch();

    const networkInterfaces = os.networkInterfaces();
    let ipAddress = '';
    for (const [key, interfaces] of Object.entries(networkInterfaces)) {
        if (interfaces) {
            for (const iface of interfaces) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    ipAddress = iface.address;
                    break;
                }
            }
        }
        if (ipAddress) break;
    }

    // Generate the hashed, truncated, and formatted IP address
    const truncatedHash = generateTruncatedHash(ipAddress);
    const formattedHash = formatHashWithSemicolons(truncatedHash);

    // Return the object with dynamic keys
    return [
        { machineType: platform },
        { osVersion: osVersion },
        { architecture: architecture },
        { ipAddress: formattedHash }  // Return the hashed and formatted IP
    ];
}

// Function to validate if an IP address matches the given fingerprint
// function validateIpAgainstFingerprint(ipAddress: string, fingerprint: string): boolean {
//     // Generate the truncated and formatted hash from the input IP address
//     const truncatedHash = generateTruncatedHash(ipAddress);
//     const formattedHash = formatHashWithSemicolons(truncatedHash);

//     // Compare the generated formatted hash with the provided fingerprint
//     return formattedHash === fingerprint;
// }

// // Example usage:

// const ipAddress = '192.168.1.100';  // The IP address to validate
// const fingerprint = '12:ab:cd:ef:34:56';  // The precomputed fingerprint

// // Validate if the IP matches the fingerprint
// const isMatch = validateIpAgainstFingerprint(ipAddress, fingerprint);
// console.log(`Does the IP match the fingerprint? ${isMatch}`);  // Output: true or false
