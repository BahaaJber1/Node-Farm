import fs from "fs";
import http from "http"; // we gonna use this to implement a simple server
import { dirname } from "path";
import url, { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log({ __dirname });

// 1- Blocking, synchronous way

// 1. Synchronous read
//  - Not passing the encoding parameter will return a buffer object which is not human-readable
const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
console.log({ textInput });

// 2. Synchronous write
const textOutput = `This is what we know about the avocado: ${textInput}\nCreated on ${new Date()}`;
fs.writeFileSync("./txt/output.txt", textOutput);
console.log("File written!");

// 2- Non-blocking, asynchronous way

// 1. Asynchronous read
//  - The first argument in the callback is for error handling most of the time
//  - The second console.log outside the readFile callback will be executed first because readFile is non-blocking meaning it'll be running in the background
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
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

// Read data for the /api endpoint
// it can be set as sync because it runs only once when the server starts
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// Read HTML templates
const overview = fs.readFileSync(
	`${__dirname}/templates/overview.html`,
	"utf-8"
);
const product = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");
const card = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");

const replaceTemplate = (template, product) => {
	let output = template.replaceAll("{%PRODUCTNAME%}", product.productName);
	output = output.replaceAll("{%IMAGE%}", product.image);
	output = output.replaceAll("{%PRICE%}", product.price);
	output = output.replaceAll("{%FROM%}", product.from);
	output = output.replaceAll("{%NUTRIENTS%}", product.nutrients);
	output = output.replaceAll("{%QUANTITY%}", product.quantity);
	output = output.replaceAll("{%DESCRIPTION%}", product.description);
	output = output.replaceAll("{%ID%}", product.id);
	if (!product.organic)
		output = output.replaceAll("{%NOTORGANIC%}", "not-organic");
	return output;
};

// 3- Creating a simple server
const server = http.createServer((req, res) => {
	const pathName = req.url;

	// Overview page
	if (pathName === "/" || pathName === "/overview") {
		const cardsHtml = dataObj
		.map((product) => replaceTemplate(card, product))
		.join("");
		const output = overview.replace("{%PRODUCTCARDS%}", cardsHtml);
		
		res.writeHead(200, { "Content-type": "text/html" });
		res.end(output);
		
		// Product page
	} else if (pathName === "/product") {
		res.writeHead(200, { "Content-type": "text/html" });
		
		res.end(product);

		// API page
	} else if (pathName === "/api") {
		// 4- Simple API
		// its a service that provides data to other applications through endpoints
		// __dirname is a global variable that holds the path to the current directory in CommonJS modules but not in ES6 modules
		res.writeHead(200, { "Content-type": "application/json" });
		res.end(data);

		// Not found page
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
