//TODO:
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import fs from "fs";

const inputDir = process.env.INPUT_DIR || "D://nextjs/input/";
export default async function insert(
  file: string,
  matchedList: string[],
  filePath: string,
  logs: string[]
) {
  const db = new PrismaClient();

  const fileContents = fs.readFileSync(filePath);
  const fileHash = crypto
    .createHash("sha256")
    .update(fileContents)
    .digest("hex");

  const { birthtime, mtime } = fs.statSync(filePath);
  const createdDate = new Date(birthtime);
  const modifiedDate = new Date(mtime);

  const fileExists = await db.data.findFirst({
    where: { fileHash },
  });

  if (fileExists) {
    logs.push(`${file} has already been scanned`);
    return;
  }

  for (const extractedData of matchedList) {
    const found = await db.data.findFirst({
      where: { extractedData, fileHash },
    });
    if (found) {
      continue;
    }
    await db.data.create({
      data: {
        fileHash,
        fileName: file,
        filePath: inputDir,
        extractedData,
        createdDate,
        modifiedDate,
      },
    });
    logs.push(`Inserted data from ${file}: ${matchedList}`);
  }
  return;
}
