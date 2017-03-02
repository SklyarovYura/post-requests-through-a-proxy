const fs    = require('fs');
const http  = require('http');
const path  = require('path');


var server = http.createServer( (req, res) => {



   if(req.url==='/to_file' && req.method==='POST'){

        let  errorHandler5xx = errorHandler.bind(undefined,res,500)
            ,errorHandler4xx = errorHandler.bind(undefined,res,400);

        saveToFile(req)
        .then( file => validFile(file) , errorHandler5xx )
        .then( file => loadFromFile(res,file) , errorHandler4xx)
        .catch( errorHandler5xx );
            
   }
   else
    errorHandler(res,500,new Error('path not found'));
   



}).listen(8084);


function getFileName(){
    var file_name = Date.now().toString() + Math.floor(Math.random() * 1000) + '.txt';
    file_name = path.join( __dirname,'tmp',file_name);
    return file_name;
}

function saveToFile(req){

    return new Promise((resolve,reject)=>{

        var  file_name = getFileName()                 
            ,file      = fs.createWriteStream( file_name );
    
        file.on('finish',()=>{
            resolve(file_name);
        });

        file.on('error',reject);

        req.on('close',()=>{
            file.destroy();
            //reject(new Erorr('connect closed'))
        });

         req.pipe(file);
    });
}

function validFile(file_name){
    return new Promise((resolve,reject)=>{
        fs.stat(file_name,(err,stat)=>{
            if(err) {
                console.log('stat error');
                reject(err)
            };
            if(stat.size>0){
                resolve(file_name);
            }
            else{
                fs.unlink(file_name,(err)=>{
                    console.log('delete error ');
                    console.log(err);
                });
                reject(new Error('file is empty'));
            }
        });
    });
}

function loadFromFile(res,file_name){

    return new Promise((resolve,reject)=>{

        var file = fs.createReadStream( file_name );
    
        file.on('error',reject);

        res.on('close',()=>{
            file.destroy();
            reject(new Erorr('connect closed'))
        });
        
        res.setHeader('Content-type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename( file_name )}"`);

        file.pipe(res);

    });


}


function errorHandler(res,statusCode,err){
    console.log('-----------------------------------')
    console.log(statusCode);
    console.log(err);
    res.statusCode = statusCode;
    res.end();
}