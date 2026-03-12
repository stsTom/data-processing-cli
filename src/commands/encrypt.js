import { finished, pipeline } from "node:stream/promises"
import { parseArguments } from "../../utils/argParser.js"
import { resolvePath } from "../../utils/pathResolver.js"
import fs from 'fs/promises'
import { createReadStream } from "node:fs"
import { createWriteStream } from "node:fs"
import crypto from 'node:crypto'
import { promisify } from "node:util"

export const encrypt = async (commandLine, currentDir) => {

  try{
    const args = await parseArguments(commandLine)
    const inputPath = await resolvePath(currentDir, args['--input'])
    const outputPath = await resolvePath(currentDir, args['--output'])

    await fs.access(inputPath)

    const salt = crypto.randomBytes(16)
    const iv = crypto.randomBytes(12)
    const scryptPromise = promisify(crypto.scrypt)
    const key = await scryptPromise(args['--password'], salt, 32)
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

    const streamSource = await createReadStream(inputPath)
    const streamOutput = await createWriteStream(outputPath)
  
    streamOutput.write(salt)
    streamOutput.write(iv)

    await pipeline(streamSource, cipher, streamOutput, {end: false})
    cipher.end()
    await finished(cipher)
    
    const authTag = cipher.getAuthTag()

    streamOutput.write(authTag)
    streamOutput.end()
    await finished(streamOutput)
  }catch (err){
    console.log(err)
    console.log('Operation failed')
    return
  }
}