import React,{Component} from 'react';
import {connect} from 'react-redux'
import {Button,Modal,Result,List,WhiteSpace} from 'antd-mobile'
import {resetUser} from '../../redux/actions'
import Cookies from 'js-cookie'
const Item = List.Item
const Brief = Item.Brief

class Personal extends Component{
    handleLogout = ()=>{
        
        Modal.alert('退出','确定要退出登录吗？',[
            {
                text:'取消',
                onPress:()=>{console.log('cancel')}
            },{
                text:'确定',
                onPress:()=>{
                    // 清除cookie
                    Cookies.remove('userid')
                    this.props.resetUser()
                }
            }
        ])
    }
    render(){
        const {user} = this.props
        return (
            <div>
                <Result 
                style={{marginTop:50}}
                img={<img src={require(`../../assets/headers/${user.header}.png`)}></img>}
                title={user.username}
                message={user.hospital?user.hospital:null}></Result>

                <List renderHeader={()=>'相关信息'}>
                    <Item multipleLine>
                    {user.department?<Brief>所在医院：{user.department}</Brief>:null}
                    {user.part?<Brief>薪资：</Brief>:null}
                    <Brief>简介：{user.info}</Brief>
                    </Item>
                </List>
                <WhiteSpace></WhiteSpace>
                <List>
                    <Button type="warning" onClick={this.handleLogout}>退出登录</Button>
                </List>
            </div>
        )
    }
}

export default connect(
    state=>({user:state.user}),
    {resetUser}
)(Personal)