let http=require("http");

let fs=require("fs");

fs.writeFileSync("demo.html",`
"<h1>Hello danish </h1>",
<p>welcome to 10x</p>`

)


fs.readFile("demo.html",(err,data)=>{
   http.createServer((req,res)=>{
       res.writeHead(200,{"content-Type":"text/html"})
       res.write(data);
       res.end()
   }
   ).listen(8000)


})