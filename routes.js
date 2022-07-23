const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text"><button type="submit">Send</button></form></body>');
        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            console.log(parsedBody);
            fs.writeFile('message.txt', message, (err) => {
                if (err) throw err;
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
                // const parsedBody = Buffer.concat(body).toString();
                // const message = parsedBody.split('=')[1];
                // fs.writeFile('message.txt', message, err => {
                //     res.statusCode = 302;
                //     res.setHeader('Location', '/');
                //     return res.end();
                // });
            });
        })
    }

    res.end();
}

// module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//     someText: 'Some hard coded text'
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some text';

exports.handler = requestHandler;
exports.someText = 'Some hard coded text';
