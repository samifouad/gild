import { $ } from 'bun'

export async function check_existing(platform: string, path: string) {
    try {
        switch (platform) {
            case 'linux':
                return await $`du -h ./${ path }`.nothrow().quiet()

            case 'darwin':
                return await $`du -hd1 ./${ path }`.nothrow().quiet()

            case 'win32':
                return await $`du -h --max-depth=1 ./${ path }`.nothrow().quiet()

            default:
                throw new Error('unsupported platform')
        }
    } catch (e: any) {
        throw new Error(e)
    }
} 