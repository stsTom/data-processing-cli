import { parseArguments } from "../../utils/argParser.js"
import { resolvePath } from "../../utils/pathResolver.js"
import crypto from 'node:crypto'
import fs from 'fs/promises'
import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { promisify } from "node:util"

export const decrypt = async (commandLine, currentDir) => {
  try{
    const args = await parseArguments(commandLine)
    const inputPath = await resolvePath(currentDir, args['--input'])
    const outputPath = await resolvePath(currentDir, args['--output'])
    /* for better testing results I recommend creating output file with different name
    (e.g. fileDecrypted.txt) */
    const salt = Buffer.alloc(16)
    const iv = Buffer.alloc(12)
    const authTag = Buffer.alloc(16)
    const fileSize = (await fs.stat(inputPath)).size

    const handle = await fs.open(inputPath)

    await handle.read(salt, 0, 16, 0)
    await handle.read(iv, 0, 12, 16)
    await handle.read(authTag, 0, 16, fileSize-16)

    const scryptPromise = promisify(crypto.scrypt)
    const key = await scryptPromise(args['--password'], salt, 32)
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    
    decipher.setAuthTag(authTag)

    const streamSource = handle.createReadStream({ start: 28, end: fileSize-16 })
    const streamOutput = createWriteStream(outputPath)

    if (fileSize == 44){
      decipher.final()
    }else if (fileSize > 44){ //test me
      await pipeline(streamSource, decipher, streamOutput)
    }

    handle.close()

  }catch(err){
    console.log(err)
    console.log('Operation failed')
  }
}