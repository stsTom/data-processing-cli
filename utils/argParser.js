  const commandsSchema = {
    'cd':{
      'required':{
        'pathToDirectory': null
      },
      'flags':{},
      'optional':{}
    },
    'csv-to-json':{
      'required':{
        '--input': null,
        '--output': null,
      },
      'flags':{},
      'optional':{}
    },
    'count':{
      'required':{
        '--input': null
      },
      'optional':{},
      'flags':{}
    },
    'hash':{
      'required':{
        '--input': null,
      },
      'flags':{
        '--save': false
      },
      'optional':{
        '--algorithm': 'sha256'
      }
    },
    'hash-compare':{
      'required':{
        '--input': null,
        '--hash': null
      },
      'flags':{},
      'optional':{
        '--algorithm': 'sha256'
      }
    },
    'encrypt':{
      'required':{
        '--input': null,
        '--output': null,
        '--password': null
      },
      'flags':{},
      'optional':{}
    },
    'decrypt':{
      'required':{
        '--input': null,
        '--output': null,
        '--password': null
      },
      'flags':{},
      'optional':{}
    },
    'log-stats':{
      'required':{
        '--input': null,
        '--output': null,
      },
      'flags':{},
      'optional':{}
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


  // I could've just make result equal schema and then just calculate the path
  var result = {}

  for (let option of Object.keys(schema.optional)){
    result[option] = schema.optional[option]
  }

  for (let flag of Object.keys(schema.flags)){
    result[flag] = schema.flags[flag]
  }

  for (let i=0; i < args.length; i++){
    const arg = args.at(i)
    // console.log(arg)
    if (arg.startsWith('--')){
      if (Object.keys(schema.flags).includes(arg)){
        result[arg] = !schema.flags[args]
        continue
      }
      // console.log('next arg ', args.at(i+1))
      result[arg] = args.at(++i)
      continue
    }
    result.conditionals = []
    result.conditionals.push(arg)
  }
  // console.log('result ', result)

  if (command === 'cd' && Object.keys(result).includes('conditionals')){
    if (result.conditionals.length === 1){
      result.pathToDirectory = result.conditionals[0]
    }
  }

  Object.keys(schema.required).forEach(key => {
    if (!Object.keys(result).includes(key)){
      // console.log("doesn't include")
      return
    }
  })

  return result
}