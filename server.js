const http = require('http');
const fs = require('fs');

/* Listen on specified port or use the default 9001 */
const port = parseInt(process.argv[2], 10) || 9001;

/**
 * Log an error to both the server log and the client response.
 * @param message text description of the error
 * @param status HTTP status code
 * @param response HTTP response object
 * @param level must be a valid method of `console`, defaults to "error"
 */
function error(message, status, response, level) {
	level = level || 'error';
	console[level](`[${new Date()}] ${status}: ${message}`);
	response.writeHead(status);
	response.end(`[STATUS ${status}] ${message}`);
}

http.createServer((req, res) => {
	/* Log every request */
	console.log(`[${new Date()}] [${req.socket.address().address}] ${req.url}`);

	const filename = '.' + decodeURI(req.url);
	fs.stat(filename, (err, stat) => {
		if (err) {
			error(`File not found: "${filename}" [${err.message}]`, 404, res, 'warn');
		} else if (stat.isFile()) {
			/* Send file if it exists */
			fs.createReadStream(filename).pipe(res);
		} else if (stat.isDirectory()) {
			/* List dir contents if it exists */
			fs.readdir(filename, (err, data) => {
				if (err) {
					error(`Error reading dir "${filename}": ${err}`, 500, res);
				} else {
					const parent = req.url + (req.url[req.url.length - 1] === '/' ? '' : '/');
					res.end(`
						<html>
						<head><title>Listing for ${filename}</title></head>
						<body>
							<h1>Listing for <pre>${filename}</pre></h1>
							<ul>
								${data.map(item => `<li><pre><a href="${parent + item}">${item}</a></pre></li>`).join('\n')}
							</ul>
						</body>
						</html>
                    `);
				}
			});
		} else {
			error(`Path "${filename}" is neither file nor directory, I don't know what to do`, 403, res);
		}
	});
}).listen(port, () => console.log(`Ready on port ${port}`));
