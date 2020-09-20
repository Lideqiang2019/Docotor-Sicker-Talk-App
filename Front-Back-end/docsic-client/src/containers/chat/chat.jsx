import React from 'react';
import { NavBar, List, InputItem, Icon,Grid } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim'
import { connect } from 'react-redux'
import { sendMsgs ,readMsg} from '../../redux/actions'

const Item = List.Item;

class Chat extends React.Component {
    state = {
        content: '',
        isShow:false
    }

    // 在第一次render之前，初始化表情
    componentWillMount(){
        const emojis = ['😀','😃',  '😄','😁', '😆',  '😅', '🤣', '😂',   '🙂',   '🙃',  '😉',  '😊',   '😇',
            '🥰',  '😍', '🤩','😘',  '😗',   '😚',    '😙',   '😋',  '😛',  '😜',  '🤪', '😝',
            '😶', '😏',  '🙄',  '😬',  '🤥',  '😌',   '😔',   '😪',  '🤤','😴',  '😷','🤒']
        this.emojis = emojis.map(emoji=>({text:emoji}))
    }

    componentDidMount() {
        // 初始显示列表
        window.scrollTo(0, document.body.scrollHeight)
        // 
    }

    componentDidUpdate () {
        // 更新显示列表
        window.scrollTo(0, document.body.scrollHeight)
    }

    componentWillUnmount(){ // 离开此界面时，将消息改成已读
        // 发送更新消息的未读状态
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from,to)
    }

    toogleShow = ()=>{
        const isShow = !this.state.isShow //取反
        this.setState({isShow})
        // 异步手动派发resize 事件,解决表情列表显示的bug
        if(isShow){
            setTimeout(()=>{
                window.dispatchEvent(new Event('resize'))
            },0)
        }

    }

    sendMsg = () => {
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content.trim()
        if (content) {
            this.props.sendMsgs({ from, to, content })
        }
        //清除数据
        this.setState({ content: '',isShow:false })
    }
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat

        // 计算当前聊天的chatId
        const meId = user._id
        if(!users[meId]){ // 如果还没有获取数据，直接不做任何显示
            return null
        }
        const targetId = this.props.match.params.userid
        const chatId = [meId, targetId].sort().join('_')
        // 对chatMsgs进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
        // 得到目标用户的header图片对象
        const targetHeader = users[targetId].header
        const targetIcon = targetHeader?require(`../../assets/headers/${targetHeader}.png`):null;
        const meIcon = user.header?require(`../../assets/headers/${user.header}.png`):null
        return (
            <div id='chat-page'>
                <NavBar
                    className='sticky-top'
                    icon={<Icon type="left"></Icon>}
                    onLeftClick={() => this.props.history.goBack()}>{users[targetId].username}</NavBar>
                    <List style={{marginTop:50,marginBottom:50}}>
                    <QueueAnim type='scale' delay={100}>
                        {
                            msgs.map(msg => {
                                if (meId === msg.to) {
                                    // 对方发给我的
                                    return (
                                        <Item
                                            key={msg._id}
                                            thumb={targetIcon}>
                                            {msg.content}
                                        </Item>
                                    )
                                } else {
                                    return (
                                        <Item
                                            key={msg._id}
                                            className="chat-me"
                                            extra="我"
                        
                                        >
                                            {msg.content}
                                        </Item>
                                    )

                                }
                            })
                        }
                    </QueueAnim>
                    </List>

                <div className='am-tab-bar'>
                    <InputItem
                        placeholde="请输入"
                        extra={
                            <span>
                            <span onClick={this.toogleShow} style={{marginRight:5}}>😊</span>
                            <span
                            onClick={this.sendMsg}>发送</span>
                            </span>
                        }
                        value={this.state.content}
                        onChange={val => this.setState({ content: val })}
                        onFocus={()=>this.setState({isShow:false})}
                    >
                    </InputItem>
                    {
                        this.state.isShow?<Grid
                        data={this.emojis}
                        columnNum={8}
                        carouselMaxRow={4}
                        isCarousel={true}
                        onClick={(item)=>this.setState({content:this.state.content+item.text})}></Grid>:null
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user, chat: state.chat }),
    { sendMsgs,readMsg }
)(Chat)