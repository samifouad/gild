import { $ } from 'bun'

export async function check_existing(path: string) {
    return await $`du -h --max-depth=1 ./${ path }`.nothrow().quiet()
}