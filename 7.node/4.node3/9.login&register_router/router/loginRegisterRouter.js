// 专门用于管理登录、注册的业务路由。 路由器是用于管理路由的

// 引入Router构造函数
const {Router} = require('express')
// 创建一个Router实例，路由器就是一个小型的app
let router = new Router()
// 引入模型对象，进行数据库CRUB
let usersModel = require('../model/usersModel')

// 用于处理用户的注册请求，有很多业务逻辑（校验数据有效性等） --- 就是业务路由
// 接下来要用获取回来的信息进行业务逻辑处理
router.post('/register', (req, res) => {
  // console.log(req.body)
  /* { email: '科比',
       nickName: '下',
       password: '123',
       re_password: '123' } */ 

  // 1、获取用户的输入信息
  const { email, nickName, password, re_password } = req.body
  /* 2、判断数据是否合规：邮箱、密码等是否符合要求（一般前台和后端同时验证）
      2.1 校验成功
        与数据库进行校验：注册过，提示；未注册，则写入数据库
      2.2 校验失败
        提示用户具体哪里输入的不正确
  */
  // 定义校验各项信息的正则 
  const emailReg = /^[a-zA-Z0-9_]{4,16}@[a-zA-Z0-9]{2,10}\.com$/
  const nickNameReg = /[\u4e00-\u9fa5]/gm
  const passwordReg = /^[a-zA-Z0-9_@+.%]{4,16}$/

  // 使用正则去校验
  if (!emailReg.test(email)) {
    res.send('邮箱格式不合法！用户名必须4-16位，主机名必须2-10位')
  } else if (!nickNameReg.test(nickName)) {
    res.send('昵称格式不合法！必须使用中文名字')
  } else if (!passwordReg.test(password)) {
    res.send('密码格式不合法，输入4-10位数....')
  } else if (password !== re_password) {
    res.send('两次密码不一致，请重新输入！')
  } else {
    // 1.连接数据库：如果写这里的话，一百万个用户注册就要触动百万次数据库，导致数据库自爆了。所以就要已启动就要连接数据库
    // 2.去数据库中查询该邮箱是否注册过
    // //{email:email} = {email}
    usersModel.findOne({email}, function (err,data){
      if (data) {
        // 如果注册过，要引入计数模块，防止过多注册，当达到一个敏感点阈值，触发一些安全性机制。
        res.send('该邮箱已被注册，请更换邮箱！')
      } else{
        usersModel.create({email,nickName,password},function(err,data){
          if (!err) {
            res.send(`${nickName}注册成功！`)
          } else{
            // 引入报警模块，当达到敏感阈值时候（10分钟注册20次，18次失败），触发报警 --- -告诉运维人员，服务器出问题了
            console.log(err);
            res.send('当前网络状态不稳定，稍后重试') // 假装有问题
          }
        })
      }
    })
  }
})

// 用于处理用户的登录请求，有很多业务逻辑（校验数据有效性等） --- 就是业务路由
router.post('/login', (req, res)=>{
  // 获取登录信息
  const {email,password} = req.body
  // 要正则校验
  const emailReg = /^[a-zA-Z0-9_]{3,16}@[a-zA-Z0-9]{2,10}\.com$/
  const passwordReg = /^[a-zA-Z0-9_@+.%]{4,16}$/
  // 验证格式是否符合要求
  if (!emailReg.test(email)){
    res.send('邮箱格式不正确，请重新输入！')
  } else if (!passwordReg.test(password)){
    res.send('密码格式不正确，请重新输入密码！')
  } else {
    // 从数据库中查找数据进行验证
    usersModel.findOne({email,password},(err, data)=>{
      if (err) {
        console.log(err);
        res.send('您当前网络不稳定，请稍后重试')
        return  //if判断完，一次请求一次相应，代码还 要继续往下走，所以要用return避免执行下去
      }
      // 有数据有结果，表示登录成功
      if (data) {
        console.log('login successed');
        res.redirect('https://www.baidu.com')
        return
      }
      // 没结果，表示登录失败
      console.log('password error');
      res.send('邮箱或密码不正确，请重新输入')
    })
  }
})

module.exports = function () {
  return router
}