import processImages from "../api/ocrModule";
import fs from "fs";
import path from "path";
import { existsSync } from "fs";
const INPUT_DIR = process.env.INPUT_DIR || "./input";
const OUTPUT_DIR = process.env.OUTPUT_DIR || "./output";
let logs = "";
interface WorkerInput {
  inputDir: string;
  outputDir: string;
  files: string[];
}
export default function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const formDataValues = Array.from(formData.values());
    for (const value of formDataValues)
      if (typeof value === "object" && "arrayBuffer" in value) {
        const file = value as unknown as Blob;
        const buffer = Buffer.from(await file.arrayBuffer());
        if (!fs.existsSync(`D:/nextjs/input/${file.name}`)) {
          fs.writeFileSync(`D:/nextjs/input/${file.name}`, buffer);
          console.log(`${file.name} uploaded!`);
        } else {
          console.log(`${file.name} already exists!`);
        }
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
      logs = await processImages(workerInput);
    } catch (error) {
      console.log({ error: error });
    }
  }
  async function upload(formData: FormData) {
    "use server";
    console.log(Array.from(formData.values()));
  }
  return (
    <div>
      <div className="flex flex-col bg-lime-100 w-10/12 h-20 m-5 mx-auto justify-center items-center">
        <p className="font-sans font-medium">Hello world!</p>
        <p className="font-sans font-medium">Hello world!</p>
      </div>
      <div className="bg-red-400 mx-auto w-2/5 h-150 justify-center items-center">
        <form action={handleSubmit} className="m-2">
          <input
            className="text-lg w-11/12 text-gray-900 border rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
            name="file"
            multiple
            //onChange={handleChange}
          />
          <button
            type="submit"
            className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
