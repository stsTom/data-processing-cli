  const commandsSchema = {
    'encrypt':{
      'required':{
        '--input': 'string',
        '--output': 'string',
        '--password': 'string'
      },
      'flags':{}
    },
    'decrypt':{
      'required':{
        '--input': 'string',
        '--output': 'string',
        '--password': 'string'
      },
      'flags':{}
    }
  }

export const parseArguments = async (commandLine) => {
  const inputs = commandLine.split(' ')
  const command = inputs[0]
  const args = inputs.slice(1)
  // console.log('inputs ', inputs)
  // console.log('args ', args)

  if (args.length == 0){
    return
  }

  const schema = commandsSchema[command]
  // console.log(command)
  // console.log(schema)


  var result = {}

  for (let i=0; i < args.length; i++){
    const arg = args.at(i)
    // console.log(arg)
    if (arg.startsWith('--')){
      if (Object.keys(schema.flags).includes(arg)){
        result.arg = !schema.flags.arg
        continue
      }
      // console.log('next arg ', args.at(i+1))
      result[arg] = args.at(++i)
      continue
    }
    result.conditionals = arg
  }
  // console.log('result ', result)

  Object.keys(schema.required).forEach(key => {
    if (!Object.keys(result).includes(key)){
      return
    }
  })

  return result
}