import { parseArguments } from "../../utils/argParser.js"
import { resolvePath } from "../../utils/pathResolver.js"
import os from 'os'
import fs from 'fs/promises'
import { Worker } from "worker_threads"

export const readStats = async (commandLine, currentDir) => {
  const chunksCount = os.availableParallelism()

  try{
    const args = await parseArguments(commandLine)
    const inputPath = await resolvePath(currentDir, args['--input'])
    const outputPath = await resolvePath(currentDir, args['--output'])
    
    await fs.access(inputPath)

    const buffer = Buffer.alloc(1)
    const chunkSize = (await fs.stat(inputPath)).size / chunksCount

    var startPosition = 0
    var endPosition = chunkSize

    const fileHandle = await fs.open(inputPath)

    for (let worker = 0; worker < chunksCount; worker++){
      if (worker === chunksCount - 1){
        endPosition = (chunkSize * chunksCount) - 1
        //create new Worker, send it start position and end position
      }else{
        while (true) {
          fileHandle.read(buffer, 0, 1, endPosition)
          if (buffer[0] === 10){
            //create new Worker, send it start position and end position
            break;
          }
          endPosition++
        }
      }
      const logWorker = new Worker("../../workers/logWorker.js", { start: startPosition, end: endPosition, inputPath })
      
      startPosition = ++endPosition
      endPosition += chunkSize
      /* if it works at all, end position will be increased even after the last worker would be created
      it shouldn't affect anything but it's an unneccessary calculation */
    }
  }catch(err){
    console.log(err)
    console.log('Operation failed')
  }
}