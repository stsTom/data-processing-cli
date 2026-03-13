import { parseArguments } from "../../utils/argParser.js"
import { resolvePath } from "../../utils/pathResolver.js"
import os from 'os'
import fs from 'fs/promises'
import { Worker, workerData } from "worker_threads"

export const readStats = async (commandLine, currentDir) => {
  const chunksCount = os.availableParallelism()

  try{
    const args = await parseArguments(commandLine)
    const inputPath = await resolvePath(currentDir, args['--input'])
    const outputPath = await resolvePath(currentDir, args['--output'])
    
    await fs.access(inputPath)

    const buffer = Buffer.alloc(1)
    const chunkSize = Math.floor((await fs.stat(inputPath)).size / chunksCount)
    const allWorkersData = []

    var startPosition = 0
    var endPosition = chunkSize

    const fileHandle = await fs.open(inputPath)

    for (let worker = 0; worker < chunksCount; worker++){
      if (worker === chunksCount - 1){
        endPosition = (await fs.stat(inputPath)).size - 1
        //create new Worker, send it start position and end position
      }else{
        while (true) {
          await fileHandle.read(buffer, 0, 1, endPosition)

          if (buffer[0] === 10){
            //create new Worker, send it start position and end position
            break;
          }

          endPosition++
        }
      }

      const workerPromise = new Promise((resolve, reject) => {
        const logWorker = new Worker(
          "./workers/logWorker.js",
          { workerData:{
            start: startPosition,
            end: endPosition,
            inputPath
          }
        })

        logWorker.on('message', (result) => {
          resolve(result); 
        });

        logWorker.on('error', (err) => {
          reject(err);
        });
      })

      allWorkersData.push(workerPromise)
      
      startPosition = ++endPosition
      endPosition += chunkSize
      /* if it works at all, end position will be increased even after the last worker would be created
      it shouldn't affect anything but it's an unneccessary calculation */
    }

    const finalResults = await Promise.all(allWorkersData)

    console.log(finalResults)

    await fileHandle.close()

    const mergedData = {
      total: 0,
      levels: { INFO: 0, WARN: 0, ERROR: 0 },
      status: { '2xx': 0, '3xx': 0, '4xx': 0, '5xx': 0 },
      topPaths: [],
      avgResponseTimeMs: 0
    };

    let totalAvgResponseTimeSum = 0;

    for (const p of finalResults) {
      mergedData.total += p.total;

      mergedData.levels.INFO += p.levels.INFO;
      mergedData.levels.WARN += p.levels.WARN;
      mergedData.levels.ERROR += p.levels.ERROR;

      mergedData.status['2xx'] += p.status['2xx'];
      mergedData.status['3xx'] += p.status['3xx'];
      mergedData.status['4xx'] += p.status['4xx'];
      mergedData.status['5xx'] += p.status['5xx'];

      totalAvgResponseTimeSum += p.avgResponseTimeMs;
      
      mergedData.topPaths.push(p.topPaths);
    }

    if (chunksCount > 0) {
      mergedData.avgResponseTimeMs = (totalAvgResponseTimeSum / chunksCount).toString();
    }

    const jsonString = JSON.stringify(mergedData, null, 2);

    await fs.writeFile(outputPath, jsonString, 'utf8');
  }catch(err){
    console.log(err)
    console.log('Operation failed')
  }
}