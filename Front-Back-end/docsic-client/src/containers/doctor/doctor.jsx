import React,{Component} from 'react';
import {connect} from 'react-redux'
import UserList from '../../components/user-list/user-list'
import {getUserList} from '../../redux/actions'

class Doctor extends Component{
    componentDidMount(){
        this.props.getUserList('sicker')
    }
    render(){
        // console.log(this.props.userlist)
        return (
            <UserList userList={this.props.userlist}></UserList>
        )
    }
}

export default connect(
    state=>({userlist:state.userlist}),
    {getUserList}
)(Doctor)