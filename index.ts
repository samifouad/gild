#!/usr/bin/env bun
import { Command } from 'commander'
import * as core from './core/index'

const program = new Command()

program
    .name('gild')
    .version('0.1.0')
    .description('https://gild.gg')
  
program
    .command('new')
    .description('create a new gild project')
    .action(async () => {
        await core.init()
    })

program
    .command('add')
    .description('fetch remote package')
    .argument('<repo>', 'github <user>/<repo> containing a package')
    .argument('[version]', 'requested version for package, default is latest')
    .action(async (repo, version) => {
        await core.add(repo, version)
    })

program
    .command('status')
    .description('sanity check current project')
    .action(async () => {
        await core.status()
    })

program
    .command('check')
    .description('sanity check your system')
    .action(async () => {
        await core.check()
    })

program
    .command('get')
    .description('fetch a remote config')
    .action(async () => {
        console.log('get')
    })

program.parse()