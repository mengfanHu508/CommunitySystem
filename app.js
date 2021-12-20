const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const Mongoose = require('./modules/mongoose.js');
const express = require('express');
const session = require('express-session')
const path  = require('path')
const multer  = require('multer')
var bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
const port = 5508


const headimg_default = "default.jpg"
// 配置模板引擎
app.set("view engine","ejs")
app.use(express.static("node_modules"));
app.use(express.static("static/photo"))
app.use(express.static('static'))

app.use(session({
    secret: 'this is a session', //服务器生成session签名
    name: 'molename',
    resave: false, //强制保存session即使他没有变化
    saveUninitialized: true, //强制保存未初始化的session
    cookie: {
        maxAge: 1000 * 60 * 15
    },
    rolling: true
}))

const storage = multer.diskStorage({ //设置文件保存格式
    destination: function (req, file, cb) {
      cb(null, 'static/upload')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      var extname = path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix + extname)
    }
})
const upload = multer({ storage: storage })

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
    var molename = req.body.molename;
    var password = req.body.password;
    Mongoose.User.findOne({"molename": molename, "password": password}).exec((err, user) => {
        if(err) return console.log(err)
        if(!user) res.render("login.ejs", {
            info: "用户名或密码错误",
            user: null
        })
        else {
            req.session.user = user
            Mongoose.User.find({},function(err,userlist){
                console.log(userlist)
                if(err) return console.log(err)
                req.session.page = 1
                var most = Mongoose.calMostPage(userlist.length)
                req.session.mostPage = most
                res.render("userlist.ejs", {
                    info: "登陆成功！",
                    user:user,
                    userlist:userlist,
                    page:1,
                    mostPage: most
                })
                next();
            })
        }
    })
    
})

//用户注册
app.post('/RegAction', upload.single('headimg'), (req, res, next) => {
// app.post('/RegAction', (req, res,next) => {
    console.log(req)
    console.log(req.body)
    var molename = req.body.molename
    var password = req.body.password
    var sex = req.body.sex
    var birth = req.body.birth
    var region = req.body.region
    var spec = req.body.spec
    spec = spec + ""
    var headimg = headimg_default
    if(req.file != null) headimg = req.file.filename
    var regtime = Mongoose.GetRegTime()
    var manager = req.body.manager
    Mongoose.InsertUser(molename, password, sex, birth, region, spec, regtime, headimg,manager)
    res.render("login.ejs", {
        user:null,
        info: "注册成功！"
    })
    next();
})

//加好友ajax
app.get('/AddMessage',(req, res)=>{
    console.log(req.body)
    // Mongoose.Message.findOne({"molename": molename, "message": message}).exec((err, message) => {
    //     if(err) return console.log(err)
    //     if(!message){

    //         res.end("已成功发送请求")
    //     }
    //     else {

    //     }
    res.send("aa");
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
app.get('/userinfo',(req, res)=>{
    var user = req.session.user
    var suburl = req.url.split('?')[1];
    var key = suburl.split('&');
    var molename = key[0].split('=')[1];
    console.log(molename)
    Mongoose.User.findOne({"molename": molename}).exec((err, user) => {
        res.render('userinfo.ejs', {
            user:user
        })
    })
})

//用户列表页面
app.get('/userlist.ejs',(req, res)=>{
    var user = req.session.user
    Mongoose.User.find({},function(err,userlist){
        if(err) return console.log(err)
        req.session.page = 1
        var most = Mongoose.calMostPage(userlist.length)
        req.session.mostPage = most
        res.render("userlist.ejs", {
            info: "登陆成功！",
            user:user,
            userlist:userlist,
            page:1,
            mostPage: most
        })
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

//注销
app.get('/Logout',(req, res)=>{
    req.session.user = null
    res.render("login.ejs", {
        user:null,
        info: null
    })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})