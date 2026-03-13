import { workerData, parentPort } from "worker_threads";
import fs from "fs"
import readline from "readline"

const readData = async () =>{
  const data = workerData
  const fileStats = {
    "total": "number",
    "levels": {
      "INFO": "number",
      "WARN": "number",
      "ERROR": "number"
    },
    "status": {
      "2xx": "number",
      "3xx": "number",
      "4xx": "number",
      "5xx": "number"
    },
    "topPaths": [
      { "path": "string", "count": "number" }
    ],
    "avgResponseTimeMs": "number"
  }

  const stream = fs.createReadStream(data.inputPath, { start: data.start, end: data.end })

  const rl = readline.createInterface({
    input: stream,
    terminal: false
  })

  rl.on('line', (line) =>{

  })

  rl.on('close', () => {
    parentPort.postMessage(stats);
  });
}

await readData()