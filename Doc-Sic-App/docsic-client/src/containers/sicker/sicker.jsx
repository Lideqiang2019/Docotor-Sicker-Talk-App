import React,{Component, useReducer} from 'react';
import {connect} from 'react-redux'
import UserList from '../../components/user-list/user-list'
import {getUserList} from '../../redux/actions'

class Sicker extends Component{
    componentDidMount(){
        this.props.getUserList('doctor')
    }
    render(){
        return (
            <UserList userList={this.props.userlist}></UserList>
        )
    }
}

export default connect(
    state=>({userlist:state.userlist}),
    {getUserList}
)(Sicker)