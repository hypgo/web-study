// 引入express
const express = require('express')
// 创建app应用对象
const app = express()
// 禁止服务器返回X-Power-By，为了安全
app.disable('x-power-by')
// 使用内置中间件暴露静态资源，作用：不访问路由直接写文件名+后缀也能看到页面
app.use(express.static(__dirname + '/public'))
// 配置模板引擎
app.set('view engine','ejs')
app.set('views','./view')
// 引入db模块，用于连接数据库
const db = require('./db/db')
// 使用内置中间件用于解析post请求的urlencoded参数(post请求注册账号，要获取传回来的数据)
app.use(express.urlencoded({ extended: true }))
// 引入UI路由器
const UIRouter = require('./router/UIRouter')
// 引入loginRegisterRouter路由器
const loginRegisterRouter = require('./router/loginRegisterRouter')

// 如果数据库连接成功，随后立即启动服务器，在整个过程中，无论多少次请求，数据库只连接一次
db(() => {
  // 使用UI路由
  app.use(UIRouter())
  // 使用loginRegisterRouter
  app.use(loginRegisterRouter())

  // 绑定端口监听
  app.listen(3000, (err) => {
    if (!err) console.log('服务器启动成功');
    else console.log(err);
  })

}, (err) => {
  console.log('数据库连接失败',err);
})
