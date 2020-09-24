const mongoose = require("mongoose")
const db = require("./db")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    header:{
        type:String
    },
    create_time:{
        type:Date,
        default:Date.now
    },
    last_modified_time:{
        type:Date,
        default:Date.now
    },
    status:{
        // 用户权限设置
        type:Number,
        enum:[0,1,2],
        default:0
    },
    hospital: {type: String}, // 所在医院
    department: {type: String}, // 部门
    title: {type: String}, // 头衔
    fee: {type: String} ,// 挂号费
    info:{type:String}, // 详细描述
    sex:{type:String}, // 性别
    age:{type:String}, // 年龄
    past:{type:String}, // 既往史
    interval:{type:String},// 患病时长
    part:{type:String}, // 患病部位
})



const User = mongoose.model('User',userSchema)

module.exports = User