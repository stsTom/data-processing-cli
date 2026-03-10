import readline from "node:readline/promises"
import { stdin, stdout } from "node:process"

export const repl = async (directory) => {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    prompt: '> '
  })

  console.log('Welcome to Data Processing CLI!')
  console.log('You are currently in ', directory)
}