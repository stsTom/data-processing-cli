import { resolvePath } from "../../utils/pathResolver.js"
import { parseArguments } from "../../utils/argParser.js"
import path from 'path'
import { createHash } from "crypto"
import { createReadStream, createWriteStream } from "fs"
import { pipeline } from "stream/promises"

export const calculateHash = async (commandLine, currentDir) => {
  const args = await parseArguments(commandLine)
  console.log(args)
  const file = await resolvePath(currentDir, args['--input'])
  const algorithm = args['--algorithm']

  try{
    const hash = createHash(algorithm)
    const source = await createReadStream(file)

    await pipeline(source, hash) 

    const digest = hash.digest('hex')

    if (args['--save']){
      const outputFile = await createWriteStream(`${file}.${algorithm}`)

      outputFile.write(digest)
    }else{
      console.log('hash: ', digest)
    }
  }catch(err){
    console.log(err)
    console.log('Operation failed')
  }
}