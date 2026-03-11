import { parseArguments } from "./argParser"
import path from 'path'

export const resolvePath = async (pathPointed) => {
  const absolutePath = path.resolve(pathPointed)
  return absolutePath
}