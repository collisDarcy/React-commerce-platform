import React, { Component } from 'react'
import { Menu } from 'antd';
import logo from '../../assets/images/OIP-C.jpg'
import './index.css'
import { Link } from 'react-router-dom';
import { SubMenu } from 'rc-menu';
import {
  PieChartOutlined,
  UserOutlined,
  MailOutlined,
  DesktopOutlined,
  TeamOutlined,
  FileOutlined
} from '@ant-design/icons';
function getItem(label, key, icon, items, route) {
  return {
    label,
    key,
    icon,
    items,
    route
  };
}

const items = [
  getItem('首页', '1', <PieChartOutlined />),
  getItem('用户管理', 'sub1', <UserOutlined />, ["用户列表"], "user"),
  getItem('权限管理', 'sub2', < MailOutlined />, ["角色列表", "权限列表"], "role"),
  getItem('商品管理', 'sub3', < DesktopOutlined />, ["商品列表", "分类参数", "商品分类"], "category"),
  getItem('订单管理', 'sub4', <TeamOutlined />, ["订单列表"], "list"),
  getItem('数据统计', 'sub5', <FileOutlined />, ["数据报表"], "charts"),
];



class LeftNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      index: '',
      openKeys: ''
    }
  }
  openclick = (res) => {
    //更新状态但是是一个异步的,不会立即更新数据，所以index的值为空，执行else中的语句
    this.setState({
      index: res.key
    })
    const { index } = this.state;
    //如果点击是同一个值
    if (res.key === index) {

      this.setState({
        openKeys: res.key - 1,
        index: index - 1
      })
      //这个时候还是之前的旧数据，还没有减1
    }
    //点击不一样的时候或者第一次点击的时候
    else {
      this.setState({
        openKeys: res.key
      })
    }
  }
  render() {
    const { openKeys } = this.state;
    return (
      <div className='nav-content'>
        <div className='nav-header'>
          <img src={logo} alt="" />
          <p>超级管理员</p>
        </div>
        <Menu theme='light' defaultSelectedKeys={['0']} mode="inline" openKeys={[openKeys]}>

          {
            items.map((item, index) => {
              return (
                <SubMenu key={index} title={item.label} onTitleClick={this.openclick} >
                  {!item.items ? '' : (
                    item.items.length <= '1' ?
                      (
                        <><Menu.Item key={item.key} icon={<PieChartOutlined />} >
                          <Link to={'/admin/' + item.route}>{item.items[0]}</Link>
                        </Menu.Item>
                        </>
                      )
                      :
                      (
                        item.items.length >= '2' && item.items.length < 3 ?
                          <><Menu.Item key="sub2-1" icon={<PieChartOutlined />}>
                            <Link to="/admin/role">{item.items[0]}</Link>
                          </Menu.Item>
                            <Menu.Item key="sub2-2" icon={< MailOutlined />}>
                              <Link to="/admin/authority">{item.items[1]}</Link>
                            </Menu.Item>
                          </>
                          :
                          <><Menu.Item key="sub3-1" icon={< DesktopOutlined />}>
                            <Link to="/admin/category">{item.items[0]}</Link>
                          </Menu.Item>
                            <Menu.Item key="sub3-2" icon={<TeamOutlined />}>
                              <Link to="/admin/classify">{item.items[1]}</Link>
                            </Menu.Item>
                            <Menu.Item key="sub3-3" icon={< FileOutlined />}>
                              <Link to="/admin/pro_classify">{item.items[2]}</Link>
                            </Menu.Item>
                          </>
                      )
                  )}
                </SubMenu>
              )
            })
          }
        </Menu>
      </div >
    )
  }
}
export default LeftNav;
