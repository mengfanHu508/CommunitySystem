const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const express = require('express');
const app = express()

const port = 5508


const headimg_default = "default.jpg"
// 配置模板引擎
app.set("view engine","ejs")
app.use(express.static("node_modules"));
app.use(express.static("static/photo"))
app.use(express.static('static'))

//功能主页
app.get('/',(req, res)=>{

    res.render('index.ejs', {
        user:null
    })

})

app.get('/index.ejs',(req, res)=>{

    res.render('index.ejs', {
        user:null
    })

})

//登陆页面
app.get('/login.ejs',(req, res)=>{

    res.render('login.ejs', {
        user:null,
        info:null
    })

})

//注册页面
app.get('/reg.ejs',(req, res)=>{

    res.render('reg.ejs', {
        user:null
    })

})

//用户登陆
app.post('/LoginAction',(req, res,next)=>{
    console.log(req.body)
    var molename = req.body.molename;
    var password = req.body.password;
    res.render("userlist.ejs", {
        info: "登陆成功！",
        user:null,
        page:1
    })
    next()
})

//用户注册
// app.post('/doReg', upload.single('headimg'), (req, res) => {
app.post('/RegAction', (req, res) => {
    var moleid = req.body.moleid
    var molename = req.body.molename
    var password = req.body.password
    var sex = req.body.sex
    if(sex == "1") sex = "男"
    else sex = "女"
    var birth = req.body.birth
    var region = req.body.region
    var spec = req.body.spec
    var headimg = headimg_default
    if(req.file != null) headimg = req.file.filename
    var regtime = Service.GetRegTime()
    var manager = req.body.manager
    // Service.InsertUser(moleid,molename, password, sex, birth, region, spec, regtime, headimg,manager)
    res.render("login.ejs", {info: "注册成功！"})
})

//我的消息页面
app.get('/mamessage.ejs',(req, res)=>{

    res.render('mamessage.ejs', {
        user:null,
        info:null
    })

})

//好友列表页面
app.get('/friendlist.ejs',(req, res)=>{

    res.render('friendlist.ejs', {
        user:null,
        info:null
    })

})

//用户信息页面
app.get('/userinfo.ejs',(req, res)=>{

    res.render('userinfo.ejs', {
        user:null,
        info:null
    })

})

//用户列表页面
app.get('/userlist.ejs',(req, res)=>{

    res.render('userlist.ejs', {
        user:null,
        info:null
    })

})

//菜品图鉴页面
app.get('/food.ejs',(req, res)=>{

    res.render('food.ejs', {
        user:null,
        info:null
    })

})

//菜品信息页面
app.get('/foodinfo.ejs',(req, res)=>{

    res.render('foodinfo.ejs', {
        user:null,
        info:null
    })

})

//植物图鉴页面
app.get('/plant.ejs',(req, res)=>{

    res.render('plant.ejs', {
        user:null,
        info:null
    })

})

//植物信息页面
app.get('/plantinfo.ejs',(req, res)=>{

    res.render('plantinfo.ejs', {
        user:null,
        info:null
    })

})

//vip页面
app.get('/vip.ejs',(req, res)=>{

    res.render('vip.ejs', {
        user:null,
        info:null
    })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})