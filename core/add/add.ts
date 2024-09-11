import { $ } from 'bun'
import { createSpinner } from 'nanospinner'
import { sleep } from '@/core'

export async function add(repo: string, version: string) {
    const spinner = createSpinner(' task: add remote package').start();

    await sleep(1000)

    if (repo.startsWith('https://') || repo.startsWith('github.com')) {
        repo = repo.replace('https://', '')
        repo = repo.replace('http://', '')
        repo = repo.replace('github.com/', '')
    }

    let [user, pkg] = repo.split('/')

    let source

    if (user.includes(':')) {
        [source, user] = user.split(':')
    }

    console.log('\nsource: '+ source)

    if (source !== undefined && pkg === undefined) {
        pkg = user
        user = ''
    }
    console.log('user: '+ user)
    console.log('pkg: '+ pkg)

    if (version !== undefined) {
        console.log('version requested: '+ version)
    } else {
        console.log('version requested: latest')
    }

    spinner.success()
    process.exit(0)
}