import { parseArguments } from "../../utils/argParser.js"
import { resolvePath } from "../../utils/pathResolver.js"
import fs from 'fs/promises'

export const navigate = async (commandLine, currentDir) => {
  const args = await parseArguments(commandLine)
  var newPath = await resolvePath(currentDir, args.pathToDirectory)
  try{
    await fs.access(newPath)
  }catch{
    newPath = currentDir
  }finally{
    return newPath
  }
}