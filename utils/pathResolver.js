import { parseArguments } from "./argParser.js"
import path from 'path'

export const resolvePath = async (currentDir, pathPointed) => {
  const absolutePath = path.resolve(currentDir, pathPointed)
  return absolutePath
}