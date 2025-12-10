import fs from "fs";

// 1. Synchronous read

// Not passing the encoding parameter will return a buffer object which is not human-readable
const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
console.log({ textInput });

// 2. Synchronous write
const textOutput = `This is what we know about the avocado: ${textInput}\nCreated on ${new Date()}`;
fs.writeFileSync("./txt/output.txt", textOutput);
console.log("File written!");
