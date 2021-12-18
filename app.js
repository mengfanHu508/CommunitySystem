const http = require('http');
const fs = require('fs')
const ejs = require('ejs')

const server = http.createServer((req, res) => {
    res.statusCode = 200;

    if(req.url.endsWith('/favicon.ico'))
    {
        res.setHeader('Content-Type', 'image/jpg');
        fs.readFile('icon.jpg', function (err, data) {
            if(err) console.error(err);
            res.write(data);
            res.end();
        });
    }
    else if(req.url == '/')
    {
        res.setHeader('Content-Type', 'text/html');
        // var data = fs.readFileSync('20210923/index.html');
        // res.write(data);
        fs.readFile('./views/index.ejs', function (err, data) {
            if (err) return console.error(err);
            //console.log(data.toString());
            res.write(data);
            res.end();
        });
    }
    else{
        res.setHeader('Content-Type', 'text/html');
        res.end('input received!')
    }
    
});
server.listen(5508);