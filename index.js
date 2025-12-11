import fs from "fs";
import http from "http"; // we gonna use this to implement a simple server
import url from "url";

const server = http.createServer((req, res) => {
	const pathName = req.url;
	if (pathName === "/" || pathName === "/overview") {
		res.end("Welcome to our homepage");
	} else if (pathName === "/product") {
		res.end("Welcome to our product page");
	} else {
		// We can also set headers before sending the response
		// ? whats a header you say? -> Headers are like metadata for the response, they give additional information about the response being sent to the client
		// The header should be always set before sending the response using res.end()
		res.writeHead(404, {
			"Content-type": "text/html",
			"my-own-header": "hello-world",
		});
		res.end("<h1>Page not found</h1>");
	}
});

// we use port 8000 to avoid conflicts with other servers that might be using the default port 3000
// the second parameter is the localhost IP address which we don't to explicitly specify most of the time
// after running the server, we notice that the terminal is blocked which means it can't do anything else until we stop the server which is something related to the event loop
server.listen(8000, "127.0.0.1", () => {
	console.log("Listening to requests on port 8000");
});

/*
// Blocking, synchronous way

// 1. Synchronous read
//  - Not passing the encoding parameter will return a buffer object which is not human-readable
const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
console.log({ textInput });

// 2. Synchronous write
const textOutput = `This is what we know about the avocado: ${textInput}\nCreated on ${new Date()}`;
fs.writeFileSync("./txt/output.txt", textOutput);
console.log("File written!");

// Non-blocking, asynchronous way

// 1. Asynchronous read
//  - The first argument in the callback is for error handling most of the time
//  - The second console.log outside the readFile callback will be executed first because readFile is non-blocking meaning it'll be running in the background
fs.readFile("./txt/start.tt", "utf-8", (err, data) => {
	console.log({ err, data });
	if (err)
		return console.log("Something went wrong while reading this file!", {
			errorMessage: err,
		});
	fs.readFile(`./txt/${data}.txt`, "utf-8", (err1, data1) => {
		console.log({ err1, data1 });
		fs.readFile("./txt/append.txt", "utf-8", (err2, data2) => {
			console.log({ err2, data2 });
			fs.writeFile("./txt/final.txt", `${data1}\n${data2}`, (err3) => {
				console.log({ err3 }, "File written!");
			});
		});
	});
});

console.log("Will read file...");
*/
