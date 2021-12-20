const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const Mongoose = require('./modules/mongoose.js');
const express = require('express');
const session = require('express-session')
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
    name: 'username',
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
    console.log(req)
    console.log(req.body)
    var molename = req.body.molename;
    var password = req.body.password;
    res.render("userlist.ejs", {
        info: "登陆成功！",
        user:{
            molename,
            password
        },
        page:1
    })
    next();
})

//用户注册
// app.post('/RegAction', upload.single('headimg'), (req, res) => {
app.post('/RegAction', (req, res,next) => {
    console.log(req.body.moleid)
    var moleid = req.body.moleid
    var molename = req.body.molename
    var password = req.body.password
    var sex = req.body.sex
    var birth = req.body.birth
    var region = req.body.region
    var spec = req.body.spec
    var headimg = headimg_default
    if(req.file != null) headimg = req.file.filename
    var regtime = Mongoose.GetRegTime()
    var manager = req.body.manager
    // Mongoose.InsertUser(moleid,molename, password, sex, birth, region, spec, regtime, headimg,manager)
    res.render("login.ejs", {
        user:null,
        info: "注册成功！"
    })
    next();
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