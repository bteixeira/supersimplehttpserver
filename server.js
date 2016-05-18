var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    /* Log every request */
    console.log(`[${new Date()}] [${req.socket.address().address}] ${req.url}`);

    var filename = '.' + decodeURI(req.url);
    fs.stat(filename, function(err, stat) {
        if (err) {
            console.log(`Returning 404: ${err.message}`);
            res.writeHead(404);
            res.end(`File not found: "${filename}"`);
        } else if (stat.isFile()) {
            /* Send file if it exists */
            fs.createReadStream(filename).pipe(res);
        } else if (stat.isDirectory()) {
            /* List dir contents if it exists */
            fs.readdir(filename, function (err, data) {
                if (err) {
                    console.error(`Error reading dir "${filename}": ${err}`);
                    res.writeHead(500);
                    res.end();
                } else {
                    var parent = req.url + (req.url[req.url.length - 1] === '/' ? '' : '/');
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
            console.error(`Path "${filename}" is neither file nor directory, I don't know what to do`);
            res.writeHead(403);
            res.end();
        }
    });
});

var port = parseInt(process.argv[2], 10) || 9001;

server.listen(port, function () {
    console.log('Ready on port', port);
});
