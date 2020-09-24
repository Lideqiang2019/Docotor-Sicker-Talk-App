import React from 'react'
import logo from './logo.jpg'
import './logo.css'

export default class Logo extends React.Component{
    render(){
        return(
            <div className="logo-container">
                <img src={logo} alt="logo" className="logo-img"/>
            </div>
        )
    }
}