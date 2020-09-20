import React,{Component} from 'react'
import Logo from '../../components/logo/logo'
import {List,Button,WingBlank,WhiteSpace,NavBar,InputItem} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {login} from '../../redux/actions'

const Item = List.Item;

class Login extends Component{

    state = {
        username:'',
        password:''
    }

    handleRegister = ()=>{
        this.props.history.replace('/register')
    }

    handleLogin = ()=>{
        // console.log(JSON.stringify(this.state))
        this.props.login(this.state)
    }

    handleChange = (name,val)=>{
        this.setState({
            [name]:val
        })
    }

    render(){
        const {msg,redirectTo} = this.props
        if(redirectTo){
            return <Redirect to={redirectTo}></Redirect>
        }
        return(
            <div>
                <NavBar>医患通</NavBar>
                <Logo/>
                <WingBlank>
                {msg?<p className='error-msg'>{msg}</p>:null}
                <List>
                   <InputItem placeholder="请输入用户名" type="text" onChange={val=>this.handleChange('username',val)}> 用户名:</InputItem>
                        <WhiteSpace/>
                    <InputItem placeholder="请输入密码" type="password" onChange={val=>this.handleChange('password',val)}>密&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace/>
                        <Button type="primary" onClick={this.handleLogin}>登&nbsp;&nbsp;录</Button>
                        <WhiteSpace/>
                        <Button onClick={this.handleRegister}>还没有账号？</Button>
                </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state=>state.user,
    {login}
)(Login)