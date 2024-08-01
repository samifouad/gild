export { status } from './status'
export { check } from './check'
export { init } from './new'


export const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));