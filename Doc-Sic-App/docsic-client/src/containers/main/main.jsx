import React, { Component } from 'react'
import { Switch, Route,Redirect } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import Cookies from 'js-cookie'
import { connect } from 'react-redux'
import DoctorInfo from '../doctor-info/doctor-info'
import SickerInfo from '../sicker-info/sicker-info'
import Doctor from '../doctor/doctor'
import Sicker from '../sicker/sicker'
import Personal from '../personal/personal'
import Message from '../message/message'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../../containers/chat/chat'
import {getRedirectPath} from '../../utils'
import {getUser} from '../../redux/actions'


class Main extends Component {

    // 组件类和组件对象
    // 给组件对象添加属性
    navList = [
        {
            path: '/doctor', // 路由路径
            component: Doctor,
            title: '患者列表',
            icon: 'sicker',
            text: '患者',
        },
        {
            path: '/sicker', // 路由路径
            component: Sicker,
            title: '医生列表',
            icon: 'doctor',
            text: '医生',
        },
        {
            path: '/message', // 路由路径
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息',
        },
        {
            path: '/personal', // 路由路径
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人',
        }
    ]
    componentDidMount(){
        const userid = Cookies.get('userid')
        // console.log("Cookies",userid)
        const {user} = this.props
        if(userid && !user._id){
            this.props.getUser()
        }
    }

    render() {
        // 得到当前请求的path
        const path = this.props.location.pathname
        
        // debugger
        // 如果浏览器中没有保存userid的cookie，直接跳转至Login
        const userid = Cookies.get('userid')
        if (!userid) {
            this.props.history.replace('/login')
            return null
        }
        const {user,unReadCount} = this.props
        if(!user._id){
            return null
            // 不做任何显示
        }
        else {
            // 请求根路径时, 自动跳转到对应的用户主界面
            if (path === '/') {
                const pathname = getRedirectPath(user.type, user.header)
                // debugger
                return <Redirect to={pathname} />
            }
        }
        if (user.type === 'doctor') {
            // 此处有点奇怪，当第二次访问时，user.type并没有变？
            this.navList[1].hide = true
        } else {
            this.navList[0].hide = true
        }

        const currentNav = this.navList.find(nav => nav.path === path)

        return (
            <div>
                {currentNav ? <NavBar className="sticky-top">{currentNav.title}</NavBar> : null}
                <Switch>
                    <Route path='/doctorinfo' component={DoctorInfo}></Route>
                    <Route path='/sickerinfo' component={SickerInfo}></Route>

                    <Route path='/doctor' component={Doctor}></Route>
                    <Route path='/sicker' component={Sicker}></Route>
                    <Route path='/personal' component={Personal}></Route>
                    <Route path='/message' component={Message}></Route>
                    <Route path="/chat/:userid" component={Chat}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
                {currentNav ? <NavFooter navList={this.navList} unReadCount={unReadCount}></NavFooter> : null}
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user,unReadCount:state.chat.unReadCount }),
    {getUser}
)(Main)