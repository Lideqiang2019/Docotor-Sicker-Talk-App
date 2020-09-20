import React, { Component } from 'react'
import { List, Button, Radio, WingBlank, WhiteSpace, NavBar, InputItem } from 'antd-mobile'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { register } from '../../redux/actions'
import Logo from '../../components/logo/logo'
const Item = List.Item;

class Register extends Component {
    state = {
        username: '',
        password: '',
        password2: '',
        type: 'sicker',
    }

    toLogin = () => {
        this.props.history.replace('/login')
    }

    register = () => {
        // console.log(JSON.stringify(this.state))
        this.props.register(this.state)
    }

    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }

    render() {
        const { redirectTo, msg } = this.props
        if (redirectTo) {
            return <Redirect to={redirectTo} />
        }
        return (
            <div>
                <NavBar>医患通</NavBar>
                <Logo />
                <WingBlank>
                    {msg ? <p className='error-msg'>{msg}</p> : null}
                    <List>
                        <InputItem placeholder="请输入用户名" type="text" onChange={val => (this.handleChange('username', val))}> 用户名:</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder="请输入密码" type="password" onChange={val => (this.handleChange("password", val))}>密&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder="请再次输入密码" type="password" onChange={val => (this.handleChange('password2', val))}>密&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace />
                        <Item>
                            <span style={{ marginRight: 10 }}>用户类型:</span>
                            <Radio checked={this.state.type === 'doctor'} onChange={val => this.handleChange('type', 'doctor')}>医生</Radio>
                            <Radio checked={this.state.type === 'sicker'} onChange={val => this.handleChange('type', 'sicker')}>患者</Radio>
                        </Item>
                        <WhiteSpace />
                        <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;册</Button>
                        <WhiteSpace />
                        <Button type="primary" onClick={this.toLogin}>已有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => state.user,
    { register }
)(Register)