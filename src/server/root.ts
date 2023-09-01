export { root };

// https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag/50052194#50052194

// import { dirname } from "node:path";
// import { fileURLToPath } from "node:url";
// import fs from "fs";
// import path from "path";
// const __filename = new URL("", import.meta.url).pathname;
// const __dirname = new URL(".", import.meta.url).pathname;

// const __dirname = dirname(fileURLToPath(import.meta.url));
const root = `${__dirname}/../..`;
