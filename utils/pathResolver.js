import { parseArguments } from "./argParser"
import path from 'path'

export const resolvePath = async (pathPointed, currentDirectory) => {
  const relativePath = path.relative(currentDirectory, pathPointed)
  return relativePath
}