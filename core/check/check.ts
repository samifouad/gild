import chalk from 'chalk'
import { $ } from 'bun'
import os from 'node:os'
import { createSpinner } from 'nanospinner'
import { load } from 'js-toml'
import pkg from '../../package.json'

export async function check() {
    console.log('gild v'+ pkg.version)
    console.log(os.platform() +' - '+ os.arch())

    const incus_spinner = createSpinner('is incus installed?').start();
    const { exitCode: incus_exitCode } = await $`incus --version`.nothrow().quiet()

    if (incus_exitCode === 0) {
        incus_spinner.success()
    } else {
        incus_spinner.error()
    }

    const gf_spinner = createSpinner('does .gild folder exist?').start();
    const { exitCode: gf_exitCode } = await $`du -h --max-depth=1 ./.gild`.nothrow().quiet()

    if (gf_exitCode === 0) {
        gf_spinner.success()
    } else {
        gf_spinner.error()
    }

    const gc_spinner = createSpinner('does infra.toml file exist?').start();
    const { exitCode: gc_exitCode } = await $`du -sh ./.gild/infra.toml`.nothrow().quiet()

    if (gc_exitCode === 0) {
        gc_spinner.success()
    } else {
        gc_spinner.error()
    }

    const gt_spinner = createSpinner('is infra.toml file valid?').start();
    try {
        const path = './.gild/infra.toml'
        const file = Bun.file(path)
        const gtoml = await file.text();
        const data = load(gtoml)
        gt_spinner.success()
        //console.log(gtoml)
    } catch(e) {
        gt_spinner.error()
        //console.log(e)
    }

    process.exit(0)
}