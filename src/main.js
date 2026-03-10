import os from 'os'
import { repl } from './repl.js'

const App = async () => {
  const homeDir = os.homedir()

  repl(homeDir)
}

await App()