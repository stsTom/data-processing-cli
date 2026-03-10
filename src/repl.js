import readline from "node:readline/promises"
import { stdin, stdout } from "node:process"

export const repl = async (homeDirectory) => {
  var directory = homeDirectory
  
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    prompt: '> '
  })

  console.log('Welcome to Data Processing CLI!')
  console.log('You are currently in ', directory)
  rl.prompt()

  rl.on('line', (line) => {
    const input = line.trim()

    switch(input){

    }

    console.log('You are currently in ', directory)
  })

  rl.on('close', () => console.log('Thank you for using Data Processing CLI!'))
}