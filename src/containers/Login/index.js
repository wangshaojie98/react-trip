import React, { Component } from 'react'
import { List, InputItem, Toast,Button } from 'antd-mobile';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {actions as tripActions} from '../../redux/modules/trip';
import {post,get } from '../../utils/request';
import './style.scss';


 class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }
  render() {
    return (
      <div className="login">
        <div className="login_form">
        <h1>出行系统</h1>

        <List>
          <InputItem
            type="phone"
            placeholder="请输入用户名"
            onChange={this.handleUserChange}
            value={this.state.username}
          >账号</InputItem>
          <InputItem
            type="password"
            placeholder="请输入密码"
            onChange={this.handlePwdChange}
            value={this.state.password}
          >密码</InputItem>
          
        </List>
        <div className="login-btnBox">
          <Button type="primary" className="login-btn" onClick={this.handleLogin}>登录</Button>
        </div>
        </div>
      </div>
    )
  }

  handlePwdChange = val => {
    this.setState({
      password: val
    })
  }

  handleUserChange = val => {
    this.setState({
      username: val
    })
  }

  handleLogin = () => {
    let params = {
      userName: this.state.username.replace(/\s/g, ''),
      passWord: this.state.password.replace(/\s/g, '')
    }

    post('/user', params).then(res => {
      console.log(res);
      let tmpUser = JSON.stringify(res.data);
      // 登录信息存到本地
      localStorage.setItem('user', tmpUser)
      //存到redux
      this.props.tripActions.setUser(res.data);
      Toast.success(`欢迎回来，${res.data.name}`, 2);
      this.fetchAllDistance();
      this.props.history.push('/');
    }).catch(err => {
      console.log(err);
    })
  }

  fetchAllDistance = () => {
    get('/trip/allDistance', {}).then(res => {
      console.log(res);
      this.props.tripActions.setDistance(res.data);
    }).catch(err => {
      Toast.fail('获取里程失败', 3);
      console.log(err);
    })
  }
}
const mapDispatchtoProps = dispatch => ({
  tripActions: bindActionCreators(tripActions, dispatch)
})
export default connect(null, mapDispatchtoProps)(Login)