import React from 'react';
import {connect} from 'react-redux'
import {NavBar,InputItem,TextareaItem,Button} from 'antd-mobile'
import {updateUser} from '../../redux/actions'
import {Redirect} from 'react-router-dom'

import Header from '../../components/header-selector/header-selector'

class SickerInfo extends React.Component{
    state={
        header:'',
        sex:'',
        age:'',
        past:'',
        interval:'',
        part:'',
        info:''
    }
    handleChange = (name, val) => {
        this.setState({[name]: val})
    }

    // 设置更新头像
    setHeader = (header)=>{
        this.setState({header:header})
    }

    completeInfo = ()=>{
        // console.log(JSON.stringify(this.state))
        this.props.updateUser(this.state)
    }

    render(){

        // 如果信息已经完善, 自动重定向到对应主界面
        const { header, type } = this.props.user
        if (header) { // 说明信息已经完善
            const path = type === 'doctor' ? '/doctor' : '/sicker'
            return <Redirect to={path} />
        }
        return(
            <div>
                <NavBar>患者信息完善界面</NavBar>
                <Header setHeader={this.setHeader}></Header>
                <InputItem onChange={val=>this.handleChange('sex',val)}>性别：</InputItem>
                <InputItem onChange={val=>this.handleChange('age',val)}>年龄：</InputItem>
                <InputItem onChange={val=>this.handleChange('past',val)}>既往史：</InputItem>
                <InputItem onChange={val=>this.handleChange('interval',val)}>患病时长：</InputItem>
                <InputItem onChange={val=>this.handleChange('part',val)}>患病部位：</InputItem>
                <TextareaItem title="病情描述："
                rows={3}
                onChange={val=>this.handleChange('info',val)}></TextareaItem>
                <Button type='primary' onClick={this.completeInfo}>保存</Button>
            </div>
        )
    }
}

export default connect(
    state=>({user:state.user}),
    {updateUser}
)(SickerInfo)