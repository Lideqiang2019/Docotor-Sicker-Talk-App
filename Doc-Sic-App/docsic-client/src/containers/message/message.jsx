import React, { Component } from 'react';
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'
const Item = List.Item
const Brief = Item.Brief


/*
    // 1. 使用{}进行分组(chat_id), 只保存每个组最后一条msg: {chat_id1: lastMsg1, chat_id2:
    lastMsg2}
    // 2. 得到所有分组的lastMsg 组成数组: Object.values(lastMsgsObj) [lastMsg1, lastMsg2]
    // 3. 对数组排序(create_time, 降序)

    注意：首次判断lastMsgs容器中有没有根据唯一分组标识（chat_id）的lastMsg，如果没有，直接赋值，
    后面继续遍历，判断有同样chat_id的消息，其时间是否比当前的lastMsg晚，如果是则将该msg放入lastMsgs容器中，作为
    当前分组chat_id的最新消息
    */
function getLastMsgs(chatMsgs, meId) {
    const lastMsgObjs = {}
    chatMsgs.forEach(msg => {
        // 对msg个体进行统计，看看是已读或者未读
        if(msg.to===meId && !msg.read){
            msg.unReadCount = 1
        }else{
            msg.unReadCount = 0
        }

        const chatId = msg.chat_id
        const lastMsg = lastMsgObjs[chatId]
        console.log('lastmsg',lastMsg) // 一条，但是是循环展示的
        if (!lastMsg) { // 当前就是最新的分组的消息
            lastMsgObjs[chatId] = msg
        } else {
            const unReadCount = lastMsg.unReadCount + msg.unReadCount
            if (msg.create_time > lastMsgObjs[chatId].create_time) {
                lastMsgObjs[chatId] = msg
            }
            lastMsgObjs[chatId].unReadCount = unReadCount
        }
    })
    const lastMsgs = Object.values(lastMsgObjs)
    lastMsgs.sort((msg1, msg2) => { // 降序
        return msg2.create_time - msg1.create_time
    })

    return lastMsgs
}
class Message extends Component {


    render() {
        const { user } = this.props // 取出state中的user，_id
        const { users, chatMsgs } = this.props.chat

        // 获取一个object里面存储了和meId相关聊天的最近的一条消息
        const lastMsgs = getLastMsgs(chatMsgs, user._id) // 1. 第一处修改
        return (
            <List style={{ marginTop: 50, marginBottom: 50 }}>
                {
                    lastMsgs.map(msg => {
                         // 取出tartID 
                         const targetId = msg.from == user._id ? msg.to : msg.from// 第二处修改
                         // 取出target中的username
                         const targetUser = users[targetId]
                         // console.log("输入unReadCount",msg)
                        return(<Item
                            key={msg._id}
                            extra={<Badge text={msg.unReadCount} />}
                            thumb={targetUser.header?require(`../../assets/headers/${targetUser.header}.png`):null}
                            arrow='horizontal'
                            onClick={()=>this.props.history.push(`/chat/${targetId}`)}
                        >
                            {msg.content}
                        <Brief>{targetUser.username}</Brief>
                        </Item>)
                    })
                }
            </List>
        )
    }
}

export default connect(
    state => ({ user: state.user, chat: state.chat }),
    {}
)(Message)