import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutAction } from '../Login/action';
import { message, Button } from 'antd'

class Admin extends Component {

  success = () => {
    const { username } = this.props;
    message.success(`欢迎${username}的登录!`);
  }
  logout = () => {
    message.warning('退出登录成功!');
    this.props.logoutAction(false);
  }
  render() {
    const { isLogin, username } = this.props;
    if (isLogin === false) {
      return <Redirect to="/" />
    } else {
      return (
        <div>
          管理界面---{username}
          <Button onClick={this.success}>点击登录成功!</Button>
          <Button onClick={this.logout}>退出登录</Button>
        </div>
      )
    }
  }
}

const mapState = (state) => {
  const { isLogin, username } = state.LoginReducer;
  return {
    isLogin,
    username
  }
}
const mapDispatch = (dispatch) => ({
  logoutAction(flag) {
    dispatch(logoutAction(flag));
  }
})
export default connect(mapState, mapDispatch)(Admin);