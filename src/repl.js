import readline from "node:readline/promises"
import { stdin, stdout } from "node:process"
import { encrypt } from "./commands/encrypt.js"

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

  rl.on('line', async (line) => {
    const commandName = line.split(' ')[0]
    switch(commandName){
      case 'encrypt':
        await encrypt(line, directory)
        break
      case '.exit':
        rl.close()
        return
      default: 
        console.log('Invalid input')
    }

    console.log('You are currently in ', directory)
    rl.prompt()
  })

  rl.on('close', () => console.log('Thank you for using Data Processing CLI!'))
}