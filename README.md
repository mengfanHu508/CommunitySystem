 

姓名 胡孟帆 学号 190110910508  班级 19计算机2班   

 

## **一、系统设计**

 1．**系统的主要目标**：

实现摩尔庄园玩家的信息图鉴和好友系统

 2．**项目的功能说明**：

  (1）用户登录注册。

（2）图鉴展示：植物图鉴，并显示图鉴详情。

（3）图鉴信息可由管理员添加。

（4）VIP充值：用户可通过充值成为VIP（支付宝付款未实现）。

（5）好友系统：一方通过加好友给另一方发送申请信息，另一方接受后即可成为好友或拒绝添加好友。

（6）好友聊天系统：好友之间可以通过私聊发送消息和删除消息记录。

## **二、详细设计说明**

 1、**数据库(mongodb)说明**

数据库名称:190110910508

 本数据库共4张表，如下所示

users:人员表

plants:植物图鉴表

messages:消息表

friends:好友表

具体表结构及说明如下:



表users 人员表，主要字段如下

| **字段名称** | **数据类型** | **中文说明** |
| ------------ | ------------ | ------------ |
| molename     | String       | 用户名       |
| password     | String       | 密码         |
| sex          | String       | 性别         |
| birth        | datetime     | 生日         |
| region       | String       | 摩尔地区     |
| spec         | String       | 家园特产     |
| headimg      | String       | 个人头像     |
| regtime      | String       | 注册时间     |
| status       | Nember       | 是否为管理员 |
| vip          |              |              |

 

表plant 植物图鉴表，主要字段如下

| **字段名称** | **数据类型** | **中文说明** |
| ------------ | ------------ | ------------ |
| plantname    | String       | 植物名称     |
| rarity       | String       | 稀有度       |
| cost         | Nember       | 成本         |
| saleprice    | Nember       | 商店售价     |
| growtime     | String       | 成长时间     |
| access       | String       | 获得途径     |
| headimg      | String       | 植物图像     |

表message 消息表，主要字段如下

| **字段名称** | **数据类型** | **中文说明**     |
| ------------ | ------------ | :--------------- |
| molename     | String       | 接受消息的用户名 |
| friendname   | String       | 发送消息的用户名 |
| message      | String       | 消息内容         |
| sendtime     | String       | 发送时间         |

表friend 好友表，主要字段如下

| **字段名称** | **数据类型** | **中文说明** |
| ------------ | ------------ | ------------ |
| molename     | String       | 用户名       |
| friendname   | String       | 好友名       |



## 三、引入的包说明

![image](https://user-images.githubusercontent.com/77476993/147737339-da772fbc-e8e6-49f0-a1cf-666880ac7f2c.png)

1. ejs：使用ejs渲染页面（如<%= data %>）

2. Mongoose：自己封装的一个mongoose CURD模块

3. express：Web 开发框架

4. session：将一些不变的参数放入session（如user）可以减少查询次数

5. path：用来获得文件的扩展名等

6. multer：上传文件
7. ![image](https://user-images.githubusercontent.com/77476993/147737373-c4343653-895b-490c-b16a-8f185aacb971.png)

7. bodyParser：处理前端 Post 提交的数据

8. lodash：给 list 按某一个属性排序
9. ![image](https://user-images.githubusercontent.com/77476993/147737381-878102a8-d76a-492f-9974-2f019ea1b7d4.png)

   

## 四、项目目录结构和各个部分的说明

![image](https://user-images.githubusercontent.com/77476993/147737414-13da372d-3aee-42e3-827d-3e25d4788ec0.png)

1. modules：mongodb的连接，CURD，实体类
2. node_modules：存放导入的包
3. pubilc：公共资源
4. static：静态资源，我用来放用户上传的头像以及上传的植物图鉴
5. views：视图，存放 ejs web文件
6. app.js：主程序



## 五、使用说明书
![image](https://user-images.githubusercontent.com/77476993/147737422-a4181ef4-2f47-431b-8e8e-8e46b4068660.png)

首页：简要介绍了本项目的功能，点击去登陆跳转到登录页面

![image](https://user-images.githubusercontent.com/77476993/147737433-e00bb570-247e-4580-91b5-39ff41434bdb.png)

登录页面：如果已经有账号可以输入账号密码进行登录，没有可以点击注册进行账户注册

如果账号密码登录失败会提示账户密码错误！

![image](https://user-images.githubusercontent.com/77476993/147737443-7af993f2-c831-40df-88a2-6a786eb57db8.png)

注册页面：用户输入对应信息以及上传用户头像即可完成注册（用户名不能重复，如果用户名已经被注册会出现提示）

注册完回跳转回登录页面进行登录

![image](https://user-images.githubusercontent.com/77476993/147737448-1fe29608-6c49-40b7-bf23-7b43cb103059.png)

 用户列表页面：登录成功后进入用户列表页面，这里显示除自己以外的所有注册用户，在此界面可以查看任何一个人的详细资料。

![image](https://user-images.githubusercontent.com/77476993/147737455-e24966ee-5abd-494d-8544-897c6e38b1a7.png)

还可以加他们为好友（使用 Ajax 局部刷新，只是想他们发出加好友请求，真正加好友需要对方的同意）。这里VIP会有属于自己的红标。

![image](https://user-images.githubusercontent.com/77476993/147737462-ebb345c1-8161-454e-abeb-69c25d8bdd41.png)

植物图鉴界面：在此界面会展示所有已经加入数据库的植物图片以及名称，点击查看详细可以查看植物的详细信息，具有分页的功能，每页八个。
![image](https://user-images.githubusercontent.com/77476993/147737483-a0df8424-986a-47f6-8c37-98a12ce8ed73.png)

如果是管理员可以对图鉴进行增加，不是管理员则会提示不能添加。

![image](https://user-images.githubusercontent.com/77476993/147737494-4267d912-4bbd-425b-8269-f5f909d778a2.png)

 我的消息界面：此界面会显示所有请求加为好友的信息，不会有重复，用户可以接受好友请求或者拒绝好友请求，接受或拒绝都会删除请求加为好友的信息并刷新页面。

![image](https://user-images.githubusercontent.com/77476993/147737503-efcf1d5d-4da4-49cd-b6cf-a382a0eeb68b.png)

我的好友界面：此界面会展示所有用户已经通过的好友请求真正成为好友的用户，在此可以查看他们的个人信息，删除好友，点击“私聊”会跳转到私聊界面

![image](https://user-images.githubusercontent.com/77476993/147737511-74c4dc28-baae-479c-9f2a-838561eb61bb.png)

私聊界面：在此见面可以对好友私聊，自己发的信息在右边，好友发的信息在左边，并按时间排序，在下方输入框输入内容点击发送即可发送消息，记录只查看最近五条，可以删除聊天记录。

![image](https://user-images.githubusercontent.com/77476993/147737521-c76f5934-4b8e-41ab-865e-ebade28647e7.png)

VIP界面，点击我的会员进如VIP界面，点击”穷比买不起“会跳转到，点击"整个好活？"成为VIP，点击“冲冲冲！”成为高级VIP（暂时没有实现支付宝付款）







## 六、开发日记
![image](https://user-images.githubusercontent.com/77476993/147737541-d155116a-7be1-4709-bed2-ff1ede70756c.png)
![image](https://user-images.githubusercontent.com/77476993/147737550-4b7b72d8-5086-4a60-be23-5e00ab064ce0.png)
![image](https://user-images.githubusercontent.com/77476993/147737558-f4dde3b1-08a1-435f-bba4-cb8133f93bb8.png)
