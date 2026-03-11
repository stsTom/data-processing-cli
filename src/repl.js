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

  rl.on('line', (line) => {
    const input = line.trim()

    // this try catch block need to be tested when some of the commands will be implemented
    try{
      switch(input){
        case 'encrypt':
          encrypt()
          break
        case '.exit':
          rl.close()
          return
        default: 
          console.log('Invalid input')
          break
      }
    }catch{
      console.log('switch stopped')
      console.log('Operation failed')
    }

    console.log('You are currently in ', directory)
    rl.prompt()
  })

  rl.on('close', () => console.log('Thank you for using Data Processing CLI!'))
}