import { expect, test, describe, beforeAll } from 'bun:test'
import { $ } from 'bun'
import os from 'node:os'
import { check_existing } from './lib/check_existing'
import { create_directory } from './lib/create_directory'
import { create_file } from './lib/create_file'

describe("command: new", () => {
    beforeAll(async () => {
        try {
            await $`rm -r .gildtest`.quiet()
        } catch(e) {
            console.error('issue deleting test folder')
        }
    })

    // TODO: sanitization needed to force throw
    const linux = process.platform === "linux"
    test.if(linux)("check_existing() - linux", async () => {
        expect(async () => {
            const { exitCode: exitCode_cel } = await check_existing('linux', '.gildtest')
        }).not.toThrow()    
    })

    const macos = process.platform === "darwin"
    test.if(macos)("check_existing() - macos", async () => {
        expect(async () => {
            const { exitCode: exitCode_cem } = await check_existing('darwin', '.gildtest')
        }).not.toThrow()
    })

    const windows = process.platform === "win32"
    test.if(windows)("check_existing() - windows", async () => {
        expect(async () => {
            const { exitCode: exitCode_cew } = await check_existing('win32', '.gildtest')
        }).not.toThrow()
    })

    test("create_directory()", async () => {
        const { exitCode: exitCode_cd } = await create_directory('.gildtest')
        expect(exitCode_cd).toBe(0)
    })

    // TODO: sanitization needed to force throw
    test("create_directory() - bad", async () => {
        expect(async () => {
            const { exitCode: exitCode_cd } = await create_directory('.gildtest')
        }).toThrow()
    })

    test("create_file() - toml", async () => {
        const { exitCode: exitCode_cf } = await create_file('.gildtest', 'infra.toml', 'toml')
        expect(exitCode_cf).toBe(0)
    })

    test("create_file() - json", async () => {
        const { exitCode: exitCode_cfj } = await create_file('.gildtest', 'infra.json', 'json')
        expect(exitCode_cfj).toBe(0)
    })

    test("create_file() - md", async () => {
        expect(async () => {
            const { exitCode: exitCode_cfm } = await create_file('.gildtest', 'infra.md', 'md')
        }).toThrow()
    })
})