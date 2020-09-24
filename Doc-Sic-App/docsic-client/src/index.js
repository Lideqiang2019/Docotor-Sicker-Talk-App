import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter,Route,Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import Register from './containers/register/register';
import Login from './containers/login/login';
import Main from './containers/main/main';
import store from './redux/store';
import './assets/css/index.css';
// import './test/socketio_test';

ReactDOM.render(
    (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route path="/register" component={Register}></Route>
                    <Route path="/login" component={Login}></Route>
                    <Route component={Main}></Route>
                </Switch>
            </BrowserRouter>
        </Provider>
        
    ),
    document.getElementById('root')
);
