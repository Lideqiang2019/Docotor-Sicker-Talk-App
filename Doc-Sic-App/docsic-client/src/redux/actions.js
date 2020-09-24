import io from 'socket.io-client'
/*
包含所有action creator 函数的模块
*/
import React from 'react'
import { AUTHER_SUCCESS, ERROR_MSG, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST,RECEIVE_MSG_LIST,RECEIVE_MSG,MSG_READ } from './action-types';
import { reqLogin, reqRegister, reqUpdate, reqUser, reqUserList,reqChatMsgList,reqReadMsg } from '../api/index'

export const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg });
export const autherSuccess = (user) => ({ type: AUTHER_SUCCESS, data: user });
export const receiveUser = (user) => ({ type: RECEIVE_USER, data: user })
export const resetUser = (msg) => ({ type: RESET_USER, data: msg })
export const receiveUserList = (users) => ({ type: RECEIVE_USER_LIST, data: users })

export const receiveMsgList = ({users,chatMsgs,userid})=>({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})

const receiveMsg = (chatMsg,userid)=>({type:RECEIVE_MSG,data:{chatMsg,userid}})
export const msgRead = ({count,from,to})=>({type:MSG_READ,data:{count,from,to}})
/**创建单例对象，也就是没有才创建 */
function initIO(dispatch,userid) {
    // 连接服务器, 得到代表连接的 socket 对象
    if (!io.socket) {
        io.socket = io('ws://localhost:4000')
        // 绑定'receiveMessage'的监听, 来接收服务器发送的消息
        io.socket.on('receiveMsg', function (chatMsg) {
            if(chatMsg.from===userid || chatMsg.to===userid){
                dispatch(receiveMsg(chatMsg,userid))
            }
            console.log('浏览器端接收到消息:', chatMsg)
        })
    }
}

// 获取用户列表
async function getMsgList(dispatch,userid){
    initIO(dispatch,userid)
    const response = await reqChatMsgList()
    const result = response.data
    console.log("成功",result)
    if(result.code===0){
        console.log("msglist",result.data)
        const {users,chatMsgs} = result.data
        dispatch(receiveMsgList({users,chatMsgs,userid}))
    }
    console.log("users-msglist")
}
// 异步注册
export const register = (user) => {
    const { username, password, password2, type } = user;
    // 一些错误提示
    if (!username || !password || !type) {
        return errorMsg('请补全信息!')
    } else if (password !== password2) {
        return errorMsg('两次密码必须一致！')
    }
    else {
        return async dispatch => {
            const response = await reqRegister(user);
            // debugger
            const result = response.data;
            // 如果是正确的
            if (result.code === 0) {
                getMsgList(dispatch,result.data._id)
                // 分发成功的action
                dispatch(autherSuccess(result.data))
            } else {
                // 分发提示错误的action
                dispatch(errorMsg(result.msg))
            }
        }
    }
}

// 异步登录
export const login = (user) => {
    const { username, password } = user;
    // debugger
    // 一些错误提示
    if (!username || !password) {
        return errorMsg('用户名和密码必须输入！')
    }
    else {
        return async dispatch => {
            const response = await reqLogin(user);
            const result = response.data;
            // 如果是正确的
            if (result.code === 0) {
                getMsgList(dispatch,result.data._id)
                // 分发成功的action
                dispatch(autherSuccess(result.data))
            } else {
                // 分发提示错误的action
                dispatch(errorMsg(result.msg))
            }
        }
    }
}

// 异步更新用户
export const updateUser = (user) => {
    return async dispatch => {
        // 发送异步请求
        const response = await reqUpdate(user)
        const result = response.data
        if (result.code == 0) {
            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))
        }
    }
}

// 异步获取用户数据
export const getUser = () => {
    return async dispatch => {
        const resopnse = await reqUser()
        const result = resopnse.data
        // debugger
        console.log("result", result)
        if (result.code == 0) {
            getMsgList(dispatch,result.data._id)
            dispatch(receiveUser(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

// 异步获取用户列表
export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type)
        // debugger
        const result = response.data

        if (result.code == 0) {
            dispatch(receiveUserList(result.data))
        }
    }
}

// 异步发送消息
export const sendMsgs = ({ from, to, content }) => {
    return dispatch => {
        console.log({ from, to, content })
        io.socket.emit('sendMsg',{from,to,content})
    }
}

// 读取异步action
export const readMsg = (from,to)=>{
    return async dispatch=>{
        const response = await reqReadMsg(from)
        const result = response.data
        if(result.code===0){
            const count = result.data.count
            dispatch(msgRead({count,from,to}))
        }
    }

}
