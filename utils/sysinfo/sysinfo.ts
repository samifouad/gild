import os from 'node:os'

export async function sysinfo() {
    const platform = os.platform();
    const osVersion = os.release();
    const architecture = os.arch();

    const networkInterfaces = os.networkInterfaces();
    let ipAddress = '';
    for (const [key, interfaces] of Object.entries(networkInterfaces)) {
        for (const iface of interfaces) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ipAddress = iface.address;
                break;
            }
        }
        if (ipAddress) break;
    }

    // payload
    return [
        {machineType: platform},
        {osVersion: osVersion},
        {architecture: architecture},
        {ipAddress: ipAddress},
    ]
}