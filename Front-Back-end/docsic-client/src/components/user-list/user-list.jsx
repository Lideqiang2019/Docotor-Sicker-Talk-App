import React from 'react';
import { WingBlank, Card, WhiteSpace } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import QueueAnim from 'rc-queue-anim'

const Header = Card.Header
const Body = Card.Body

class UserList extends React.Component {
    static propTypes = {
        userList: PropTypes.array.isRequired
    }
    render() {
        // const userList = this.props.userList
        // debugger
        return (
            <WingBlank style={{marginTop:50,marginBottom:50}}>
                 <QueueAnim type='scale' delay={100}>
                {
                    this.props.userList.map(user => (
                        <div key={user._id}>
                            <WhiteSpace />
                            <Card onClick={()=>this.props.history.push(`/chat/${user._id}`)}>
                                <Header
                                    thumb={user.header?require(`../../assets/headers/${user.header}.png`):null}
                                    extra={user.username}></Header>
                                <Body>
                                    <div>描述：{user.info}</div>
                                </Body>
                            </Card>

                        </div>
                    ))
                }
                </QueueAnim>
            </WingBlank>
        )
    }
}

export default withRouter(UserList)