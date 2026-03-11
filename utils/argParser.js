export const parseArguments = async () => {
  const args = process.argv

  var result = {}

  args.forEach(arg => {
    if (arg.startsWith('--')){
      const argIndex = args[args.indexOf(arg)]
      result.arg = args[argIndex + 1]
    }
  return result
  });
}