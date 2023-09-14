import { NextResponse } from "next/server";
import path from "path";
import processImages from "./ocrModule";
import fs from "fs";
import { arrayBuffer } from "stream/consumers";
interface WorkerInput {
  inputDir: string;
  outputDir: string;
  files: string[];
}
const INPUT_DIR = process.env.INPUT_DIR || "./input";
const OUTPUT_DIR = process.env.OUTPUT_DIR || "./output";

export async function GET(request: Request) {
  const inputDirContents = fs
    .readdirSync(INPUT_DIR)
    .filter((file) => [".jpg", ".jpeg", ".png"].includes(path.extname(file)));
  const workerInput: WorkerInput = {
    inputDir: INPUT_DIR,
    outputDir: OUTPUT_DIR,
    files: inputDirContents,
  };
  try {
    let logs = await processImages(workerInput);
    return NextResponse.json({ logs: logs });
  } catch (error) {
    return NextResponse.json({ error: "some error occured!" });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const formDataValues = Array.from(formData.values());
  for (const value of formDataValues)
    if (typeof value === "object" && "arrayBuffer" in value) {
      const file = value as unknown as Blob;
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(`D:/nextjs/input/${file.name}`, buffer);
    }
  const inputDirContents = fs
    .readdirSync(INPUT_DIR)
    .filter((file) => [".jpg", ".jpeg", ".png"].includes(path.extname(file)));
  const workerInput: WorkerInput = {
    inputDir: INPUT_DIR,
    outputDir: OUTPUT_DIR,
    files: inputDirContents,
  };
  try {
    let logs = await processImages(workerInput);
    return NextResponse.json({ logs: logs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "some error occured!" }, { status: 400 });
  }
}
