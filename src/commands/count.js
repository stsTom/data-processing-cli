import { parseArguments } from "../../utils/argParser.js"
import { resolvePath } from "../../utils/pathResolver.js"
import { createReadStream } from 'node:fs'

export const countData = async (commandLine, currentDir) => {
  const args = await parseArguments(commandLine)
  const filePath = await resolvePath(currentDir, args['--input'])
  const stream = await createReadStream(filePath)

  var linesCount = 0
  var wordsCount = 0
  var charactersCount = 0

  stream.on('data', function(d) {
    const dataString = d.toString()
    const lines = dataString.split('\n')
    const words = dataString.split(/\s/)
    linesCount += lines.length
    for (const word of words){
      if (word.length > 0){
        wordsCount += 1
        charactersCount += word.length
      }
    }
    console.log(`Lines: ${linesCount}\nWords: ${wordsCount}\nCharacters: ${charactersCount}`)
  })
}