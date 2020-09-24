const mongoose = require("mongoose")
const db = require("./db")
const Schema = mongoose.Schema

const chatSchema = new Schema({
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    chat_id:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    read:{
        type:Boolean,
        default:false // 默认消息未读
    },
    create_time:{
        type:Number
    }
})
const Chat = mongoose.model('Chat',chatSchema)

module.exports = Chat