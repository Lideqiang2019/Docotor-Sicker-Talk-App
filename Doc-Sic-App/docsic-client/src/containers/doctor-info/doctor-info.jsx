/**医生信息完善界面 */

import React, { Component } from 'react';
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { updateUser } from '../../redux/actions'

import Header from '../../components/header-selector/header-selector'

class DoctorInfo extends Component {
    state = {
        header: '',
        hospital: '',
        department: '',
        title: '',
        fee: '',
        info: ''
    }
    handleChange = (name, val) => {
        this.setState({ [name]: val })
    }
    // 设置更新头像
    setHeader = (header) => {
        this.setState({ header: header })
    }

    completeInfo = () => {
        // console.log(JSON.stringify(this.state))
        this.props.updateUser(this.state)
    }

    render() {
        // 如果信息已经完善, 自动重定向到对应主界面
        const { header, type } = this.props.user
        if (header) { // 说明信息已经完善
            const path = type === 'doctor' ? '/doctor' : '/sicker'
            return <Redirect to={path} />
        }
        return (
            <div>
                <NavBar>医生信息完善界面</NavBar>
                <Header setHeader={this.setHeader}></Header>
                <InputItem onChange={val => this.handleChange('hospital', val)}>所在医院：</InputItem>
                <InputItem onChange={val => this.handleChange('department', val)}>所属科室：</InputItem>
                <InputItem onChange={val => this.handleChange('title', val)}>职业称号：</InputItem>
                <InputItem onChange={val => this.handleChange('fee', val)}>挂号资费：</InputItem>
                <TextareaItem title="擅长方向："
                    rows={3}
                    onChange={val => this.handleChange('info', val)}></TextareaItem>
                <Button type='primary' onClick={this.completeInfo}>保存</Button>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    { updateUser }
)(DoctorInfo)