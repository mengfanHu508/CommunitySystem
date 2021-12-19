const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const express = require('express');
const app = express()
const port = 5508

// 配置模板引擎
app.set("view engine","ejs")
app.use(express.static("node_modules"));

app.get('/',(req, res)=>{
    // ejs.renderFile('index', {result:10}, function(err, str){
    //     // str => 输出渲染后的 HTML 字符串
    //     if(err){console.log('File is error.')}
    //     else
    //     {
    //         res.setHeader('Content-Type', 'text/html');
    //         res.end(str);
    //     }
    // });

    res.render('index.ejs', {

    })

    // res.send("年号s")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})