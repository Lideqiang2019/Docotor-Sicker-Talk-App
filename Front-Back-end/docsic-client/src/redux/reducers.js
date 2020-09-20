import React from 'react'
import { combineReducers } from 'redux'
import {AUTHER_SUCCESS,ERROR_MSG, RESET_USER, RECEIVE_USER, RECEIVE_USER_LIST,RECEIVE_MSG_LIST,RECEIVE_MSG,MSG_READ} from './action-types' 
import {getRedirectPath} from '../utils'

const initUser = {
    username: '', // 用户名
    type: '', // 类型
    msg: '', // 错误提示信息
    redirectTo: '' // 需要自动跳转的路由path
}

export const user = (state = initUser, action) => {
    switch (action.type) {
        case AUTHER_SUCCESS: // 认证成功
            const {header,type} = action.data
            const redirectTo = getRedirectPath(type,header)
            return {...action.data, redirectTo:redirectTo}
        case ERROR_MSG://认证失败
            return {...state, msg: action.data}
        case RECEIVE_USER:
            return action.data
        case RESET_USER:
            return {...initUser,msg:action.data}
        default:
            return state
    }
}

const initUserList = []
export const userlist = (state=initUserList,action)=>{
    switch(action.type){
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}

const initChatMsg = {
    users:{},
    chatMsgs:[],
    unReadCount:0 
}
export const chat = (state=initChatMsg,action)=>{
    switch(action.type){
        case RECEIVE_MSG_LIST:
            const {users,chatMsgs,userid} = action.data
            console.log("reducers执行")
            return {users,chatMsgs,unReadCount:chatMsgs.reduce((preTotal,msg)=>
                preTotal + (!msg.read&&msg.to===userid?1:0)
            ,0)
            }
        case RECEIVE_MSG:
            const {chatMsg} = action.data
            return {
                users:state.users,
                chatMsgs:[...state.chatMsgs,chatMsg],
                unReadCount: state.unReadCount + (!chatMsg.read&&chatMsg.to==action.data.userid?1:0)
            }
        case MSG_READ:
            const {count,from,to} = action.data
            return {
                users:state.users,
                chatMsgs:state.chatMsgs.map(msg=>{
                    if(msg.from===from && msg.to===to && !msg.read){
                        return {...msg,read:true}
                    }else{
                        return msg
                    }
                }),
                unReadCount: state.unReadCount - count
            }
        default:
            return state
    }
}


export default combineReducers({
    user,
    userlist,
    chat
});

// 向外暴露的结构为{xxx:{},yyy:{}}