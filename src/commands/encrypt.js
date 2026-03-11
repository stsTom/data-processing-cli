import { finished, pipeline } from "node:stream/promises"
import { parseArguments } from "../../utils/argParser.js"
import { resolvePath } from "../../utils/pathResolver.js"
import fs from 'fs/promises'
import crypto from 'node:crypto'

export const encrypt = async () => {
  const args = await parseArguments()
  //need to handle a situation with no input
  //need to accept arguments (argParser?)

  try{
    await fs.access(await resolvePath(args['--input']))

    const salt = crypto.randomBytes(16)
    const iv = crypto.randomBytes(12)
    const key = crypto.scrypt(args['--password'], salt)
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

    const streamSource = await fs.createReadStream(args['--input'])
    const streamOutput = await fs.createWriteStream(args['--output'])
  
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
    // return
  }finally{
    console.log('finally')
  }
}