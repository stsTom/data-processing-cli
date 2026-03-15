import fs from 'fs/promises'
import path from 'path'

export const getList = async (directory) =>{
  const list = await fs.readdir(directory)
  const folders = []
  const files = []

  for (const element of list){
    const fullPath = path.join(directory, element)
    const stat = await fs.stat(fullPath)
    stat.isDirectory() ? folders.push(element) : files.push(element)
  }

  const finalList = folders.sort().concat(files.sort())

  for (const element of finalList){
    const fullPath = path.join(directory, element)
    const stat = await fs.stat(fullPath)
    console.log(`${element.padEnd(20)}  [${stat.isDirectory() ? 'Folder' : 'File'}]`)
  }
}