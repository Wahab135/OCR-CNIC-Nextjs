import path from "path";
import { createWorker } from "tesseract.js";
import getText from "./getText";
import insert from "./insert";
import { log } from "console";

interface WorkerInput {
  inputDir: string;
  outputDir: string;
  files: string[];
}

const processImages = async (workerInput: WorkerInput) => {
  let logs: any = [];
  let processedCount = 0;
  const worker = await createWorker({
    workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js",
  });
  for (const file of workerInput.files) {
    const filePath = path.join(workerInput.inputDir, file);
    try {
      const matchedList = await getText(worker, file, logs);
      if (!matchedList || matchedList.length === 0) {
        logs.push(`${file} does not contain valid data!`);
        throw new Error();
      }
      await insert(file, matchedList, filePath, logs);
    } catch (err) {
      logs.push(`Error processing file ${file}:${err}`);
    }
    processedCount++;
    logs.push(
      `processed ${processedCount} files of total ${workerInput.files.length}`
    );
  }
  logs.push(`Processed ${workerInput.files.length} files!`);
  await worker.terminate();
  return logs;
};

export default processImages;
