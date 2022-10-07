import React, { Component, Suspense } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, Layout } from 'antd';
import { logoutAction } from '../Login/action';
import Header from '../../components/Header';
import LeftNav from '../../components/LeftNav';
import Home from '../Home';
import Category from '../Category';
import List from '../List';
import Role from '../Role';
import User from '../User';
import Charts from '../Charts';
import Order from '../Order';
import Classify from '../Classify';
import ProClassify from '../ProClassify';
import Authority from '../Authority';
import './index.css';
const { Content, Footer, Sider } = Layout;

const NavList = [
  "首页",
  "用户管理",
  "权限管理",
  "商品管理",
  "订单管理",
  "数据统计"
]
class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    }
  }
  render() {
    const { username } = this.props;
    const token = localStorage.getItem('token');
    if (!token) {
      return <Redirect to="/" />
    } else {
      return (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible >
            <LeftNav />
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} username={username} />
            <Content style={{ margin: '36px 16px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                {
                  NavList.map((item, index) => {
                    return (
                      <Breadcrumb.Item className='active' href='/' key={index}>{item}</Breadcrumb.Item>
                    )
                  })
                }

              </Breadcrumb>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <Suspense>
                  <Switch>
                    <Route path="/admin/home" component={Home} />
                    <Route path="/admin/user" component={User} />
                    <Route path="/admin/role" component={Role} />
                    <Route path="/admin/authority" component={Authority} />
                    <Route path="/admin/category" component={Category} />
                    <Route path="/admin/list" component={List} />
                    <Route path="/admin/classify" component={Classify} />
                    <Route path="/admin/pro_classify" component={ProClassify} />
                    <Route path="/admin/charts" component={Charts} />
                    <Route path="/admin/order" component={Order} />
                    <Redirect to="/admin/role" />
                  </Switch>
                </Suspense>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Welcome to {username} Login</Footer>
          </Layout>
        </Layout>
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