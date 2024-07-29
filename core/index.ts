export { status } from "./status.js"
export { check } from "./check.js"


export const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));