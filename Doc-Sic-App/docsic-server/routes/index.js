var express = require('express');
// 引入md5 加密函数库
const md5 = require('blueimp-md5')
var User = require('../models/user');
var Chat = require('../models/chat');
var router = express.Router();
const filter = {password: 0} // 查询时过滤出指定的属性

/**
 * 测试数据库
 */
function testSave(){
  const user = {
    username:'qing',
    password:'123',
    type:'sicker'
  }
  new User(user).save((err,docs)=>{
      console.log("save()",docs,err)
  })
}

// testSave()
function testFind(){
  User.find((err,docs)=>{
    console.log("find()",docs,err)
  })

  User.findOne({username:'ldq'},(err,docs)=>{
    console.log("findOne()",docs,err)
  })
}
// testFind()
function testUpdate(){
  User.updateOne({username:'gzf'},{password:'1234'},(err,docs)=>{
    console.log("updateOne()",docs,err)
  })

  User.findOneAndUpdate({username:'gzf'},{password:'12345'},(err,docs)=>{
    console.log("findOneAndUpdate()",docs,err) // 查询旧的结果
  })
}
// testUpdate()
function testDelete(){
  User.deleteOne({username:'qing'},(err,user)=>{
    console.log("deleteOne()",user,err)
  })
}
// testDelete()
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register',function(req,res){
  // 1. 获取请求参数数据(username, password, type)
  const {username,password,type} = req.body
  // 2. 处理数据
  User.findOne({username:username},(err,user)=>{
    if(user){
      res.send({code:1,msg:'该用户已经注册！'})
    }else{
      // 2.2. 如果不存在, 将提交的user 保存到数据库
      new User({username,password:md5(password),type}).save((err,user)=>{
        // 生成一个cookie(userid: user._id), 并交给浏览器保存
        res.cookie('userid',user._id,{maxAge:1000*60*60*24})//持久化cookie
        // 返回响应数据
        res.send({code:0,data:{_id:user._id,username,type}})
      })
    }
  })
})

router.post('/login',(req,res)=>{
  // 1. 获取请求参数数据(username, password, type)
  const {username,password} = req.body
  // 2. 查询数据库中是否有注册
  User.findOne({username,password:md5(password)},filter,(err,user)=>{
    if(!user){
      res.send({code:1,msg:'用户名或者密码有误！'})
    }else{
      // 生成一个cookie(userid: user._id), 并交给浏览器保存
      res.cookie('userid',user._id,{maxAge:1000*60*60*24})//持久化cookie
      // 返回响应数据
      res.send({code:0,data:user})
    }
  })
})

router.post('/update',(req,res)=>{
  // 得到cookie中的userid
  const userid = req.cookies.userid;
  if(!userid){
    // 没有登录成功,先登录
    return res.send({code:1,msg:'请先登录'})
  }else{
    User.findByIdAndUpdate({_id:userid},req.body,(err,oldUser)=>{
      const {_id,username,type}=oldUser;
      // 合并用户信息，Object.assign将多个object合并
      const data = Object.assign(req.body,{_id,username,type})
      // 返回用户的数据
      res.send({code:0,data:data})
    })
  }
})

// 用于自动登录（刷新页面）的时候获取数据库中的数据，进而重新定向路由
router.get('/user',(req,res)=>{
    const userid = req.cookies.userid
    if(!userid){
      return res.send({code:1,msg:'请先登录!'})
    }else{
      // 查询对应userid的user
      User.findOne({_id:userid},(err,user)=>{
        return res.send({code:0,data:user})
      })
    }
})

// 获取对应type的userlist
router.get('/userlist',(req,res)=>{
  const {type} = req.query
  User.find({type},(err,users)=>{
    return res.send({code:0,data:users})
  })

})

/**
 获取当前用户所有相关聊天信息列表
*/
router.get('/msglist',(req,res)=>{
  // 获取浏览器中的cookies
  const userid = req.cookies.userid;
  // 查询所有的user的文档数组
  // 需要返回的是一个容器，容器中保存username和header信息即可
  const users = {}
  User.find((err,userDocs)=>{
    userDocs.forEach(user=>{
      users[user._id] = {username:user.username,header:user.header}
    })
    /*
    const users = userDocs.reduce((users,user)=>{
      users[user._id] = {username:user.username,header:user.header}
      return users
    },{})
    */
    // console.log('users',users)
  })
  // 查询userid相关所有聊天信息
  Chat.find({'$or':[{from:userid},{to:userid}]},filter,(err,chatMsgs)=>{
    // console.log('data',{users,chatMsgs})
    res.send({code:0,data:{users,chatMsgs}})
  })
})

/* 
  修改指定消息为已读
*/

router.post('/readmsg',(req,res)=>{
  // 得到from to
  const from = req.body.from
  const to = req.cookies.userid
  Chat.update({from,to,read:false},{read:true},{multi:true},(err,doc)=>{
    console.log('readmsg()',doc)
    res.send({code:0,data:doc.nModified})
  })
})


module.exports = router;
