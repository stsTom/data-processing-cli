import { parseArguments } from "../../utils/argParser"
import { resolvePath } from "../../utils/pathResolver"
import fs from 'fs/promises'

export const encrypt = async () => {
  const args = await parseArguments()
  
  try{
    await fs.access(await resolvePath(args['--input']))
  }catch{
    console.log('no access to the input')
    throw 'Operation failed'
  }

  
}