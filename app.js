const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const Mongoose = require('./modules/mongoose.js');
const express = require('express');
const session = require('express-session')
const path  = require('path')
const multer  = require('multer')
var bodyParser = require('body-parser');
const { time, info } = require('console');
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
const port = 50508


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
        user:null,
        info:null
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
    Mongoose.User.findOne({"molename":molename}).exec((err,user) =>{
        if(!user){
            Mongoose.InsertUser(molename, password, sex, birth, region, spec, regtime, headimg,manager,0)
            res.render("login.ejs", {
                user:null,
                info: "注册成功！"
            })
            return next();
        }else{
            res.render("reg.ejs", {
                user:null,
                info: "该用户名已被注册！"
            })
        }
        
    })
})

//加好友ajax发消息
app.post('/AddMessage',(req, res)=>{
    var user = req.session.user
    console.log(req.body)
    var friendname = req.body.friendname
    var messageSend = req.body.message
    Mongoose.Message.findOne({"molename": user.molename,"friendname":friendname, "message": messageSend}).exec((err, message) => {
        if(err) return console.log(err)
        if(!message){
            sendtime = Mongoose.GetChartTime();
            Mongoose.InsertMessage(friendname, user.molename, messageSend, sendtime)
            res.send("已成功发送请求！")
        }else{
            res.send("已经是好友！")
        }
        
    })
})


//我的消息页面
app.get('/mymessage.ejs',(req, res)=>{
    var user = req.session.user
    Mongoose.Message.aggregate([
        {
            $lookup:{
                from:"users",
                localField:"friendname",
                foreignField:"molename",
                as:"user"
            }
        }
    ],function(err,messagelist){
        if(err)  return console.log(err)
        req.session.mostPage = Mongoose.calMostPage(messagelist.length)
        req.session.messagelist = messagelist
        console.log(messagelist)
        res.render('mymessage.ejs', {
            user:user,
            messagelist:messagelist,
            page: req.session.page,
            mostPage:req.session.mostPage,
        })
    })
})

//跳转聊天页面
app.get('/chartList',(req, res)=>{
    var user = req.session.user
    var suburl = req.url.split('?')[1];
    var key = suburl.split('&');
    var friendname = key[0].split('=')[1];
    console.log(friendname)
    req.session.friendname = friendname
    Mongoose.User.findOne({"friendname":friendname}).exec((err, friend) => {
        if(err) return console.log(err)
        Mongoose.Message.find({"molename": user.molename,"friendname":friendname}).exec((err, messagelist) => {
            if(err) return console.log(err)
            res.render('messagesend.ejs', {
                user:user,
                friend:friend,
                messagelist:messagelist
            })
        })
    })
})

//聊天页面
app.get('/messagesend.ejs',(req, res)=>{
    var user = req.session.user
    var friendname = req.session.friendname
    Mongoose.User.findOne({"friendname":friendname}).exec((err, friend) => {
        if(err) return console.log(err)
        Mongoose.Message.find({"molename": user.molename,"friendname":friendname}).exec((err, messagelist) => {
            if(err) return console.log(err)
            console.log(friend)
            console.log(messagelist)
            res.render('messagesend.ejs', {
                user:user,
                friend:friend,
                messagelist:messagelist
            })
        })
    })
})

//新增聊天记录
app.post('/MessageSend',(req, res)=>{
    var user = req.session.user
    var message = req.body.message
    var friendname = req.session.friendname
    var chartime = Mongoose.GetChartTime()
    console.log(friendname)

    // async 使用失败
    // async function test(){
    //     return new Promise((resolve,reject)=>{
    //         Mongoose.InsertMessage(user.molename, friendname, message,chartime)
    //         resolve(true)
    //     })
    // }
    // async function main(){
    //     var data = await test()
    //     console.log(data)
    //     Mongoose.User.findOne({"friendname":friendname}).exec((err, friend) => {
    //         if(err) return console.log(err)
    //         Mongoose.Message.find({"molename": user.molename,"friendname":friendname}).exec((err, messagelist) => {
    //             if(err) return console.log(err)
    //             console.log(friend)
    //             console.log(messagelist)
    //             res.render('messagesend.ejs', {
    //                 user:user,
    //                 friend:friend,
    //                 messagelist:messagelist
    //             })
    //         })
    //     })
    // }
    // main()

    Mongoose.InsertMessage(user.molename, friendname, message,chartime,list)

    function list(){
        Mongoose.User.findOne({"friendname":friendname}).exec((err, friend) => {
            if(err) return console.log(err)
            Mongoose.Message.find({"molename": user.molename,"friendname":friendname}).exec((err, messagelist) => {
                if(err) return console.log(err)
                console.log(friend)
                console.log(messagelist)
                res.render('messagesend.ejs', {
                    user:user,
                    friend:friend,
                    messagelist:messagelist
                })
            })
        })
    }

})

//删除聊天记录
app.get('/deleteChart',(req, res)=>{
    var user = req.session.user
    res.render('messagesend.ejs', {
        user:user,
        info:null
    })

})

//同意加好友
app.get('/AddFriend',(req, res)=>{
    var user = req.session.user
    var suburl = req.url.split('?')[1];
    var key = suburl.split('&');
    var molename = key[0].split('=')[1];
    var friendname = key[1].split('=')[1];
    Mongoose.InsertFriend(molename, friendname)
    Mongoose.InsertFriend(friendname, molename)
    Mongoose.DeleteMessage(molename,friendname,list)
    
    function list(){
        Mongoose.Message.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"friendname",
                    foreignField:"molename",
                    as:"user"
                }
            }
        ],function(err,messagelist){
            if(err)  return console.log(err)
            req.session.mostPage = Mongoose.calMostPage(messagelist.length)
            req.session.messagelist = messagelist
            console.log(messagelist)
            res.render('mymessage.ejs', {
                user:user,
                messagelist:messagelist,
                page: req.session.page,
                mostPage:req.session.mostPage,
            })
        })
    }
    
})

//不同意加好友
app.get('/DeleteMessageFriend',(req, res)=>{
    var user = req.session.user
    var suburl = req.url.split('?')[1];
    var key = suburl.split('&');
    var molename = key[0].split('=')[1];
    var friendname = key[1].split('=')[1];
    Mongoose.DeleteMessage(molename,friendname,list)

    function list(){
        Mongoose.Message.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"friendname",
                    foreignField:"molename",
                    as:"user"
                }
            }
        ],function(err,messagelist){
            if(err)  return console.log(err)
            req.session.mostPage = Mongoose.calMostPage(messagelist.length)
            req.session.messagelist = messagelist
            console.log(messagelist)
            res.render('mymessage.ejs', {
                user:user,
                messagelist:messagelist,
                page: req.session.page,
                mostPage:req.session.mostPage,
            })
        })
    }
})

//删除好友
app.get('/deleteFriend',(req, res)=>{
    var user = req.session.user
    var suburl = req.url.split('?')[1];
    var key = suburl.split('&');
    var friendname = key[0].split('=')[1];
    console.log(user.molename)
    console.log(friendname)
    Mongoose.DeleteFriend(user.molename,friendname)
    Mongoose.Friend.aggregate([
        {
            $lookup:{
                from:"users",
                localField:"friendname",
                foreignField:"molename",
                as:"user"
            }
        },
        {
            $sort: {"time":-1}
        }
    ],function(err,friendlist){
        if(err)  return console.log(err)
        req.session.mostPage = Mongoose.calMostPage(friendlist.length)
        req.session.friendlist = friendlist
        console.log(friendlist)
        res.render("friendlist.ejs", {
            user: user,
            friendlist: friendlist,
            page: req.session.page,
            mostPage:req.session.mostPage,
        })
    })
})

//好友列表页面(连表查询)
app.get('/friendlist.ejs',(req, res)=>{
    var user = req.session.user
    Mongoose.Friend.aggregate([
        {
            $lookup:{
                from:"users",
                localField:"friendname",
                foreignField:"molename",
                as:"user"
            }
        },
        {
            $sort: {"time":-1}
        }
    ],function(err,friendlist){
        if(err)  return console.log(err)
        req.session.mostPage = Mongoose.calMostPage(friendlist.length)
        req.session.friendlist = friendlist
        console.log(friendlist)
        res.render("friendlist.ejs", {
            user: user,
            friendlist: friendlist,
            page: req.session.page,
            mostPage:req.session.mostPage,
        })
    })

})

//删除好友
app.post('/deleteFriend',(req, res)=>{
    var user = req.session.user
    var suburl = req.url.split('?')[1];
    var key = suburl.split('&');
    var friendname = key[0].split('=')[1];
    console.log(friendname)
    Mongoose.DeleteFriend(user.molename,friendname)
    Mongoose.Friend.aggregate([
        {
            $lookup:{
                from:"users",
                localField:"friendname",
                foreignField:"molename",
                as:"user"
            }
        },
        {
            $sort: {"time":-1}
        }
    ],function(err,friendlist){
        if(err)  return console.log(err)
        req.session.mostPage = Mongoose.calMostPage(friendlist.length)
        req.session.friendlist = friendlist
        console.log(friendlist)
        res.render("friendlist.ejs", {
            user: user,
            friendlist: friendlist,
            page: req.session.page,
            mostPage:req.session.mostPage,
        })
    })
})

//用户信息页面
app.get('/userinfo',(req, res)=>{
    var self = req.session.user
    if(req.url == '/userinfo'){
        molename=self.molename
    }else{
        var suburl = req.url.split('?')[1];
        var key = suburl.split('&');
        var molename = key[0].split('=')[1];
    }
    Mongoose.User.findOne({"molename": molename}).exec((err, user) => {
        if(err) return console.log(err)
        res.render('userinfo.ejs', {
            user:user,
            self:self
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

//植物图鉴页面
app.get('/plant.ejs',(req, res)=>{
    var user = req.session.user
    Mongoose.Plant.find({},function(err,plantlist){
        console.log(plantlist)
        if(err) return console.log(err)
        req.session.page = 1
        var most = Mongoose.calMostPage(plantlist.length)
        req.session.mostPage = most
        res.render("plant.ejs", {
            info:null,
            user:user,
            plantlist:plantlist,
            page:1,
            mostPage: most
        })
    })
})

//植物信息页面
app.get('/PlantInfo',(req, res)=>{
    var user = req.session.user
    var url = decodeURI(req.url)
    var suburl = url.split('?')[1];
    var key = suburl.split('&');
    var plantname = key[0].split('=')[1];
    Mongoose.Plant.findOne({"plantname": plantname}).exec((err, plant) => {
        if(err) return console.log(err)
        res.render('plantinfo.ejs', {
            user:user,
            plant:plant
        })
        console.log(plant)
    })
})

//增加植物图鉴页面
app.get('/addplant.ejs', (req, res)=>{
    var user = req.session.user
    Mongoose.User.findOne({"molename": user.molename}).exec((err, user) => {
        if(err) return console.log(err)
        if(user.status){
            res.render('addplant.ejs', {
                user:user,
                info:null
            })
        }
        else{
            res.render('plant.ejs', {
                user:user,
                info:"管理员才能添加图鉴！"
            })
        }
    })
})

//用户注册
app.post('/AddPlant', upload.single('photo'), (req, res) => {
    var user = req.session.user
    console.log(req.file.filename)
    var plantname = req.body.plantname
    var cost = req.body.cost
    var saleprice = req.body.saleprice
    var growtime = req.body.growtime
    var access = req.body.access
    var rarity = req.body.rarity
    var photo = req.file.filename
    Mongoose.InsertPlant(plantname, rarity, cost, saleprice, growtime, access ,photo)
    
    Mongoose.Plant.find({},function(err,plantlist){
        console.log(plantlist)
        if(err) return console.log(err)
        req.session.page = 1
        var most = Mongoose.calMostPage(plantlist.length)
        req.session.mostPage = most
        res.render("plant.ejs", {
            info:"添加成功！",
            user:user,
            plantlist:plantlist,
            page:1,
            mostPage: most
        })
    })
})
    

//vip页面
app.get('/vip.ejs',(req, res)=>{
    var user = req.session.user
    res.render('vip.ejs', {
        user:user,
        info:null
    })

})

//更改vip状态
app.get('/ChangeStatus',(req, res)=>{
    var user = req.session.user
    var url = decodeURI(req.url)
    var suburl = url.split('?')[1];
    var key = suburl.split('&');
    var vip = key[0].split('=')[1];
    console.log(vip)
    Mongoose.ChangeStatus(user.molename,vip);
    if(vip == 1){
        res.render('vip.ejs', {
            user:user,
            info:"已成为VIP！！"
        })
    }else if (vip == 2){
        res.render('vip.ejs', {
            user:user,
            info:"已成为超级VIP！！"
        })
    }
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