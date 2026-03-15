import path from 'path'

export const movingUp = (currentDir) => {
  return path.dirname(currentDir)
}