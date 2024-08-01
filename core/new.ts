import chalk from 'chalk'
import { $ } from 'bun'
import os from 'node:os'
import { createSpinner } from 'nanospinner'
import { load } from 'js-toml'

export async function init() {
    const spinner = createSpinner('task: create .gild folder').start();

    // check for existing folder
    const { exitCode: gf_exitCode } = await $`du -h --max-depth=1 ./.gild`.nothrow().quiet()

    if (gf_exitCode === 0) {
        spinner.error()
        console.log('\nfolder already exists in current directory')
        process.exit(1)
    }

    // create directory
    const { exitCode: gd_exitCode } = await $`mkdir ./.gild`.nothrow().quiet()

    if (gd_exitCode !== 0) {
        spinner.error()
        console.log('\nerror creating new folder')
        process.exit(1)
    }

    const config_file = Bun.file("./.gild/infra.toml", { type: "application/toml" });
    await Bun.write(config_file, "");

    // create configuration file
    const { exitCode: gcf_exitCode } = await $`touch ./.gild/infra.toml`.nothrow().quiet()

    if (gcf_exitCode !== 0) {
        spinner.error()
        console.log('\nerror creating configuration file')
        process.exit(1)
    }

    spinner.success()
    process.exit(0)
}