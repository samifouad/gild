import type { Kv } from '@/core/types/type'
import os from 'node:os'

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

    // Return the object with dynamic keys
    return [
        { machineType: platform },
        { osVersion: osVersion },
        { architecture: architecture },
        { ipAddress: ipAddress }
    ];
}