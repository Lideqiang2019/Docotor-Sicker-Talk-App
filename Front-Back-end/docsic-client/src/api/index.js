/*
包含n 个接口请求函数的模块
每个函数返回的都是promise 对象
*/
import ajax from './ajax'

export const reqRegister = (user)=>{
    return ajax('/register',user,'POST')
}

export const reqLogin = (user)=>{
    return ajax('/login',user,'POST')
}

export const reqUpdate = (user)=>{
    return ajax('/update',user,'POST')
}

export const reqUser = ()=>{
    return ajax('/user')
}

export const reqUserList = (type)=>{
    return ajax('/userlist',{type})   // 就这一点点就显示不出来？
}

// 获取消息列表
export const reqChatMsgList = ()=>{
    return ajax('/msglist')
}

// 获取消息
export const reqReadMsg = (from)=>{
    return ajax('/readmsg',{from},'POST')
}