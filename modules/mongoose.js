const User = require("./user")
const Food = require("./food")
const Plant = require("./plant")
const Friend = require("./friend")
const Message = require("./message")

//在user表中插入数据
function InsertUser(moleid,molename, password, sex, birth,region, spec, regtime, headimg, manager) {
    var user = new User({
        moleid : moleid,
        molename: molename,
        password: password,
        sex: sex,
        birth: birth,
        region: region,
        spec: spec,
        regtime: regtime,
        headimg: headimg,
        manager: manager
    })
    user.save((err) => {
        if(err) return console.log(err)
        console.log("插入user成功")
    })
}
//向菜品表插入数据
function InsertFood(foodname, saleprice, cooking_time, access,materials,rarity,photo) {
    var food = new Food({
        foodname: foodname,
        saleprice: saleprice,
        cooking_time: cooking_time,
        access: access,
        materials: materials,
        rarity: rarity,
        photo: photo
    })
    food.save((err) => {
        if(err) return console.log(err)
        console.log("插入food成功")
    })
}
//向植物表插入数据
function InsertPlant(plantname, rarity, cost, saleprice, growtime, access ,photo) {
    var plant = new Plant({
        plantname: plantname,
        rarity: rarity,
        cost: cost,
        saleprice: saleprice,
        growtime: growtime,
        access: access,
        photo: photo,
    })
    plant.save((err) => {
        if(err) return console.log(err)
        console.log("插入plant成功")
    })
}

//向消息表插入数据
function InsertMessage(molename, friendname, message, sendtime) {
    var message = new Message({
        molename: molename,
        friendname: friendname,
        message: message,
        sendtime: sendtime
    })
    message.save((err) => {
        if(err) return console.log(err)
        console.log("插入message成功")
    })
}

//向好友表插入数据
function InsertFriend(molename, friendname) {
    var friend = new Friend({
        molename: molename,
        friendname: friendname,
    })
    friend.save((err) => {
        if(err) return console.log(err)
        console.log("插入friend成功")
    })
}

function GetRegTime() {
    var d = new Date()
    var time = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()
    return time
}

function GetPublishTime() {
    var d = new Date()
    var time = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    return time
}

function calMostPage(sum) {
    var most = 0
    while(sum > 10) {
        sum -= 10
        most++
    }
    if(sum > 0) most++
    return most
}

module.exports = {User, Food, Friend,Plant,Message, InsertUser, InsertFood, InsertFriend,InsertMessage,InsertPlant, GetRegTime, GetPublishTime, calMostPage}
