export { status } from './status/status'
export { check } from './check/check'
export { init } from './new/new'
export { add } from './add/add'
export { login } from './login/login'


export const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));