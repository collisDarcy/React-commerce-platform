import React, { Component } from 'react'

import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { loginAction } from './action';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';

import './login.css'
import logo from '../../assets/images/1-3.gif'
import { login } from '../../api';
class Login extends Component {

  onFinish = async (result) => {
    const { username, password } = result;
    const res = await login(username, password);
    const { token } = res.data.data;
    const { meta: data } = res.data;
    if (data.status === 200) {
      localStorage.setItem('token', token);

      const res = await login(username, password);
      const { meta: data } = res.data;
      if (data.status === 200) {

        message.success(data.msg);
        this.props.loginAction(true, 'admin');
        this.props.history.replace('/admin');
      } else {
        message.error(data.msg);
      }

    }
  }
  render() {

    const token = localStorage.getItem('token');
    if (token) {
      return <Redirect to="/admin" />
    } else {
      return (
        <div className="LoginContent">
          <header className='login-header'>
            React---后台管理系统
          </header>
          <section className='login-section'>
            <div className='login-logo'>
              <img src={logo} alt="" />
            </div>
            <div className='login-form'>
              <Form
                name="normal_login"
                className="login-form"
                onFinish={this.onFinish}
                initialValues={{ remember: true }}
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '用户名不能为空' },
                    { min: 4, message: '用户名的长度至少为4位' },
                    { max: 12, message: '用户名的长度至多为12位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是由英文,数字,下划线组成' }
                  ]}
                  initialValue='admin'
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    type="text"
                    placeholder="username"
                    maxLength={12}
                  />

                </Form.Item>
                <Form.Item
                  className='passwordInput'
                  name="password"
                  rules={[
                    { required: true, message: '密码不能为空' },
                    { min: 4, message: '密码的长度至少为4位' },
                    { max: 12, message: '密码的长度至多为12位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是由英文,数字,下划线组成' }
                  ]
                  }
                  initialValue=''

                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="password"
                    maxLength={12}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button login">
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </section>
        </div>
      )
    }

  }
}
//获取LoginReducer中的值---通过this.props获取;
const mapState = (state) => {
  const { isLogin, username } = state.LoginReducer;
  return {
    isLogin,
    username
  }
}
//修改LoginReducer中的值---通过this.props.loginAction(传参);
const mapDispatch = (dispatch) => ({
  loginAction(flag, username) {
    dispatch(loginAction(flag, username));
  }
})

export default connect(mapState, mapDispatch)(Login);