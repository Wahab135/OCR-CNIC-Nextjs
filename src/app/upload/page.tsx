"use client";

import React, { useState } from "react";

export default function Upload() {
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((image, i) => {
      formData.append(image.name, image);
    });
    await fetch("http://localhost:3000/api", {
      method: "post",
      body: formData,
    });
    console.log("submitted!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const _files = Array.from(e.target.files);
      setImages(_files);
    }
  };
  return (
    <div>
      <div className="flex flex-col bg-lime-100 w-10/12 h-20 m-5 mx-auto justify-center items-center">
        <p className="font-sans font-medium">Hello world!</p>
        <p className="font-sans font-medium">Hello world!</p>
      </div>
      <div className="bg-red-400 mx-auto w-2/5 h-150 justify-center items-center">
        <form onSubmit={handleSubmit} className="m-2">
          <input
            className="text-lg w-11/12 text-gray-900 border rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
            name="file"
            multiple
            onChange={handleChange}
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
