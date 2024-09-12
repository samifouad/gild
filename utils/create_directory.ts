import { $ } from 'bun'

export async function create_directory(path: string) {
    try {
        // TODO: sanitization that throws on error
        return await $`mkdir ./${ path }`.quiet()
    } catch (e: any) {
        throw new Error(e)
    }
}