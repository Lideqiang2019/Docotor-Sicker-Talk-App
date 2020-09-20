/**底部导航 */

import React from 'react';
import PropTypes from 'prop-types'
import {TabBar} from 'antd-mobile'
import {withRouter} from 'react-router-dom'

const Item = TabBar.Item

class NavFooter extends React.Component{
    static propTypes ={
        navList:PropTypes.array.isRequired,
        unReadCount:PropTypes.number.isRequired
    }

    render(){
        const navList = this.props.navList.filter(nav=>!nav.hide)
        
        const {pathname} = this.props.location
        const {unReadCount} = this.props
        return (
            <TabBar>
                {
                    navList.map(nav=>(
                        <Item key={nav.path}
                        badge={nav.path==='/message'?unReadCount:0}
                        title={nav.text}
                        icon={{uri:require(`../../assets/nav/${nav.icon}.png`)}}
                        selectedIcon={{uri:require(`../../assets/nav/${nav.icon}-selected.png`)}}
                        selected={pathname===nav.path}
                        onPress={()=>{
                            this.props.history.replace(nav.path)
                        }}>

                        </Item>
                    ))
                }
            </TabBar>
        )
    }
}

export default withRouter(NavFooter)