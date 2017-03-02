const http = require('http');

http.createServer((req,res)=>{

    if(req.url==='/proxy' && req.method==='POST'){

        var s_req_options = {
            port: 8084,
            hostname: 'localhost',
            method: 'POST',
            path: '/to_file'
        };

        var s_req = http.request(s_req_options,(s_res)=>{

            s_res.headers['Access-Control-Allow-Origin']='*';
            res.writeHead(s_res.statusCode,s_res.headers);
            s_res.pipe(res);
        });

        req.pipe(s_req);

    }
    else{
        console.log('proxy error');
        res.statusCode=500;
        res.end();
    }

}).listen(8082);
