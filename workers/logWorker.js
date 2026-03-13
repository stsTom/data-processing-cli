import { workerData, parentPort } from "worker_threads";
import fs from "fs"
import readline from "readline"

const readData = async () =>{
  const data = workerData
  const fileStats = {
    "total": 0,
    "levels": {
      "INFO": 0,
      "WARN": 0,
      "ERROR": 0
    },
    "status": {
      "2xx": 0,
      "3xx": 0,
      "4xx": 0,
      "5xx": 0
    },
    "topPaths": [],
    "avgResponseTimeMs": 0
  }

  const stream = fs.createReadStream(data.inputPath, { start: data.start, end: data.end })

  const rl = readline.createInterface({
    input: stream,
    terminal: false
  })

  rl.on('line', (line) =>{
    fileStats.total += 1

    if (line.includes('INFO') || line.includes("WARN") || line.includes("ERROR")){
      fileStats.levels[line] += 1
    }

    fileStats.status[`${Math.floor(parseInt(line.split(' ')[3]/100))}xx`] += 1

    const filePath = line.match(/\s(\/\S*)/)
    
    if (filePath){
      for (let obj of fileStats.topPaths){
        if (obj.path == filePath){
          obj.count += 1
          break;
        }
        if (fileStats.topPaths.indexOf(obj) == fileStats.topPaths - 1){
          fileStats.topPaths.push({"path": filePath, "count": 1})
        }
        continue
      }
      fileStats.topPaths.push()
    }

    fileStats.avgResponseTimeMs = line.split(' ')[4]
  })

  rl.on('close', () => {
    parentPort.postMessage(stats);
  });
}

await readData()