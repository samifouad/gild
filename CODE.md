# gild-cli code faq

## what language is this written in?

**TypeScript** and this uses the **[commander](https://github.com/tj/commander.js)** cli framework

## what runtime is being used?

**[bun](https://bun.sh)**. main reasons are:

- no typescript build step
- can bundle a static binary for the desired architectures
- bun is not required on target machine
- bun's shell is powerful &amp; nice to work with
- bun's testing is used to ensure code quality
- simplified the dependency tree
- the surface area for supply chain issues is reduced
- it's fast. very fast. some would even say ***blazingly fast***.

## how is the code organized?

there is a **/core** folder that contains every command in it's own subfolder. each command is co-located with its tests and its own library of functions in a **/lib** folder.

## how is CI handled?

- work is to be done in a branch called **next**
- to keep things simple this only runs tests on linux in github actions
- **this is the branch where public contribution are welcome**
- if there's a reason to test against another target architecture, eg. a platform-specific bug fix, **next-macos** and **next-windows** can be used to run github actions on those platforms when code is pushed. mac testing happens on both x64 and arm64.
- once a new version of gild is ready to be released, the branch called **rc** is used to run a more thorough test suite on all target architectures. currently gild targets these 4 architectures:

    - linux-x64
    - windows-x64
    - macos-x64
    - macos-arm64

- in the future some more support will come to other platforms, like [windows-arm64](https://github.com/oven-sh/bun/issues/9824) and [freebsd-x64](https://github.com/oven-sh/bun/issues/1524) once support lands upstream (in bun)

- once changes in **rc** pass the advanced test suite on all supported platforms, then a new tag is generated &amp; the changes are merged into the **main** branch

## how is CD handled?

once code hits the main branch and a new tag is generated, gild will be eventually deployed to **npm**, **homebrew** and **scoop**. as of right now, npm is fully integrated. homebrew works manually and scoop support is coming soon.

for people who do not wish to use any of these package managers, a standalone file will be made available on the [gild.gg](https://gild.gg) website directly.

every new tag also generates a github release. the release will contain all binaries for all platforms.