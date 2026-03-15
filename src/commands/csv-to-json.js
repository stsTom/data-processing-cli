import { createReadStream, createWriteStream } from "node:fs"
import { resolvePath } from "../../utils/pathResolver.js"
import { parseArguments } from "../../utils/argParser.js"
import { Transform } from "node:stream"
import { pipeline } from "node:stream/promises"

export const convertToJSON = async (commandLine, currentDir) => {
  try{
    const args = await parseArguments(commandLine)
    const inputFile = await resolvePath(currentDir, args['--input'])
    const outputFile = await resolvePath(currentDir, args['--output'])

    const source = await createReadStream(inputFile)

    const toJSONTransform = new Transform({
      construct(callback){
        this.firstChunk = true,
        this.headers = null,
        this.leftovers = ''
        callback()
      },

      transform(chunk, encoding, callback){
        const chunkString = chunk.toString()
        const fullString = this.leftovers + chunkString
        const chunkLines = fullString.split('\r\n')
        this.leftovers = chunkLines.pop()
        for (let lineId=0; lineId < chunkLines.length; lineId++){
          if(!this.headers){
            this.headers = chunkLines[lineId].split(',')
          }else{
            const lineWords = chunkLines[lineId].split(',')
            const obj = {}

            this.headers.forEach((key, index) => {
              obj[key] = lineWords[index]
            });
            var JSONObj = JSON.stringify(obj) + ',\n'
            if (this.firstChunk){
              JSONObj = '[\n'+ JSONObj
            }
            this.push(JSONObj)
          }
        }
        
        callback()
      },

      flush(callback){
        if (this.headers){
          if (this.leftovers){
            const obj = {}
            const lineWords = this.leftovers.split(',')
            
            this.headers.forEach((key, index) => {
              obj[key] = lineWords[index]
            });
            this.push(JSON.stringify(obj) + '\n]')
          }
        }

        callback()
      }
    })

    const output = await createWriteStream(outputFile)

    await pipeline(source, toJSONTransform, output)
  }catch(err){
    console.log(err)
  }
}