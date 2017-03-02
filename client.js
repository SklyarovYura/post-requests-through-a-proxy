const fs   = require('fs');
const http = require('http');
const path = require('path');


http.createServer((req,res)=>{
    if(req.url==='/'){

        var file = fs.createReadStream(path.join(__dirname,'index.html'));
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        file.pipe(res);

        file.on('error',()=>{
            res.statusCode = 500;
            res.end();
        });
        
        res.on('close',()=>{
            file.destroy();
        });

    }
}).listen(8080);
