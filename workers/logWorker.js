import { workerData, parentPort } from "worker_threads";
import fs from "fs"
import readline from "readline"

const readData = async () =>{
  return new Promise((resolve, reject) => {
    const data = workerData
    var fileStats = {
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

      if (line.includes('INFO')){
        fileStats.levels['INFO'] += 1
      }else if (line.includes('WARN')){
        fileStats.levels['WARN'] += 1
      }else if (line.includes('ERROR')){
        fileStats.levels['ERROR'] += 1
      }

      fileStats.status[`${Math.floor(parseInt(line.split(' ')[3]/100))}xx`] += 1

      const pathMatch = line.match(/\s(\/\S*)/);
      if (pathMatch) {
        const path = pathMatch[1]

        const existingPath = fileStats.topPaths.find(obj => obj.path === path)
        
        if (existingPath) {
          existingPath.count += 1
        } else {
          fileStats.topPaths.push({ "path": path, "count": 1 })
        }
      }

      fileStats.avgResponseTimeMs = line.split(' ')[4]
    })

    rl.on('close', () => {
      resolve(fileStats)
    })

    rl.on('error', reject)
  })
}

const finalStats = await readData()
parentPort.postMessage(finalStats)