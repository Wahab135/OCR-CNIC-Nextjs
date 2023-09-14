import Tesseract, { createWorker } from "tesseract.js";
import path from "path";

const inputDir: string = process.env.INPUT_DIR || "D://nextjs/input/";
export default async function getText(
  worker: Tesseract.Worker,
  fileName: string,
  logs: string[]
) {
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  let processedCount = 0;

  const filePath: string = path.join(inputDir, fileName);
  const {
    data: { text },
  } = await worker.recognize(filePath);
  const matchedList = text
    .match(/\b(?:\d{5}-?\d{7}-?\d{1}|\d{13})\b/g)
    ?.map((data) => data.replace(/[- ]/g, ""));

  return matchedList;
}
