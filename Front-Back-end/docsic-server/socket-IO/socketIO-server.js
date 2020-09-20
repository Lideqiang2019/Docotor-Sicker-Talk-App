const Chat = require('../models/chat');

module.exports = function (server) {
    // 得到 IO 对象
    const io = require('socket.io')(server)
    // 监视连接(当有一个客户连接上时回调)
    io.on('connection', function (socket) {
    console.log('soketio connected')

    // 绑定 sendMsg 监听, 接收客户端发送的消息
    socket.on('sendMsg', function ({from,to,content}) {
    console.log('服务器接收到浏览器的消息', {from,to,content})
    // 准备chatMsgs数据
    const chat_id = [from,to].sort().join('_');
    const create_time = new Date();
    // 将数据存入数据库
    new Chat({from,to,chat_id,content,create_time}).save(function(err,chatMsg){
        // 向所有客户端发送数据
        io.emit('receiveMsg',chatMsg)
    })
    
    })
    })
}