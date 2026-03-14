import { parseArguments } from "../../utils/argParser.js"
import { resolvePath } from "../../utils/pathResolver.js"
import { pipeline } from 'stream/promises'
import { createReadStream } from "fs"
import { createHash } from "crypto"
import { readFile } from "fs/promises"

export const compareHashes = async (commandLine, currentDir) =>{
  const args = await parseArguments(commandLine)
  const file = await resolvePath(currentDir, args['--input'])
  const comparedFile = await resolvePath(currentDir, args['--hash'])
  const algorithm = args['--algorithm']

  try{
    const expectedHashBuffer = await readFile(comparedFile)
    const expectedHash = expectedHashBuffer.toString('utf8').trim().toLowerCase()
    const actualHash = async () => {
      try{
        const hash = createHash(algorithm)
        const source = await createReadStream(file)
        
        await pipeline(source, hash) 
        
        const digest = hash.digest()
        const actual = digest.toString('utf8').trim().toLowerCase()

        return actual
      }catch(err){
        throw err
      }
    }

    const result = expectedHash === await actualHash() ? 'OK' : 'MISMATCH'
    console.log(result)
  }catch(err){
    console.log(err)
    console.log('Operation failed')
  }
}