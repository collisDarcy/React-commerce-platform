import React, { Component } from 'react'
import {
  HomeOutlined, UserOutlined, PictureOutlined, FrownOutlined, IdcardOutlined, HddOutlined, GatewayOutlined, FormOutlined, DeleteOutlined, SettingOutlined
} from '@ant-design/icons';

import { Breadcrumb, Card, Table, Divider, Radio, Input, message, Switch, Tooltip, Popconfirm } from 'antd';
import { getUserListMethod, switchUserState, deleteCurrentUser } from '../../api';
import { formateDate } from '../../utils/formateDate';
import './index.css'
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';
const { Search } = Input;
//角色路由
const TitleIcon = [
  {
    label: '角色列表',
    key: "1",
    icon: <HomeOutlined />,
    path: '/role'
  },
  {
    label: '权限列表',
    key: "2",
    icon: <UserOutlined />,
    path: '/authority'
  },
  {
    label: '商品列表',
    key: "3",
    icon: <PictureOutlined />,
    path: '/category'
  },
  {
    label: '分类参数',
    key: "4",
    icon: <GatewayOutlined />,
    path: '/classify'
  },
  {
    label: '商品分类',
    key: "5",
    icon: <IdcardOutlined />,
    path: '/pro_classify'
  },
  {
    label: '订单列表',
    key: "6",
    icon: <HddOutlined />,
    path: '/list'
  },
  {
    label: '数据报表',
    key: "7",
    icon: <FrownOutlined />,
    path: '/charts'
  }
]


const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',//查询参数
        pagenum: 1,//当前的页码
        pagesize: 2//每页显示的条数
      },
      usersList: [],//保存请求回来的用户列表数据
      selectionType: 'checkbox',
      pagination: {
        size: 'small',
        showQuickJumper: true,
        showSizeChanger: true,
        current: 1,
        pageSize: 2,
        total: 5,
        pageSizeOptions: [2, 3, 4, 5],
      },
      loading: false,
    }
  }

  componentDidMount() {
    this.getUserList();
  }
  getUserList = async () => {
    const { queryInfo } = this.state;
    this.setState({
      loading: true
    })
    const { data: res } = await getUserListMethod(queryInfo);
    if (res.meta.status === 200) {
      message.success('获取管理员列表成功!');
      this.setState({
        usersList: res.data.users,
      })
      setTimeout(() => {
        this.setState({
          loading: false
        })
      }, 1000)
    } else {
      message.error('获取管理员列表失败!');
    }
  }
  //点击页码进行切换下一页
  handleTableChange = (result) => {
    this.setState(() => {
      return {
        queryInfo: {
          query: "",
          pagenum: result.current,
          pagesize: result.pageSize
        },
        pagination: {
          current: result.current,
          pageSize: result.pageSize
        },
        loading: true
      }
    }, () => {
      this.getUserList();
    })
  }
  //改变switch的状态值--用户是否在线
  onChange = async (userinfo, state) => {
    userinfo.mg_state = state;
    const { data: res } = await switchUserState(userinfo);
    if (res.meta.status !== 200) {
      userinfo.mg_state = !userinfo.mg_state;
      return message.error('更新用户状态失败!');
    } else {
      message.success('更新用户状态信息成功!');
    }
  }
  //点击添加用户
  handleCreateRole = () => {
    console.log('添加用户');
  }
  //确认删除
  onConfirm = async (currentUserInfo) => {
    const { data: res } = await deleteCurrentUser(currentUserInfo.id);
    if (res.meta.status !== 200) {
      return message.error('删除用户失败!')
    }
    message.success('删除用户成功!');
    this.getUserList();
  }
  //取消删除
  onCancel = () => {
    message.success('取消删除成功!');
  }
  render() {
    const { selectionType, usersList, pagination, loading } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center'
      },
      {
        title: '姓名',
        dataIndex: 'username',
        align: 'center'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center'
      },
      {
        title: '电话',
        dataIndex: 'mobile',
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        align: 'center',
        render: formateDate
      },
      {
        title: '身份',
        dataIndex: 'role_name',
        align: 'center'
      },
      {
        title: '状态',
        dataIndex: 'mg_state',
        align: 'center',
        render: (status, record) => {
          //status是当前的值--mg_state
          //record是每一行的值
          return (
            <Switch onChange={(state) => this.onChange(record, state)} defaultChecked={status} />
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',

        render: (state, record) => {

          return (
            <div className='tableLast'>
              <span>
                <Tooltip placement='top' title='编辑'>
                  <FormOutlined />
                </Tooltip>
              </span>
              <Popconfirm title="Are you sure to delete the user?" onConfirm={() => this.onConfirm(record)} onCancel={this.onCancel}>
                <span>
                  <Tooltip placement='top' title='删除'>
                    <DeleteOutlined />
                  </Tooltip>
                </span>
              </Popconfirm>
              <span>
                <Tooltip placement='top' title='设置'>
                  <SettingOutlined />
                </Tooltip>
              </span>
            </div >
          )

        }
      },
    ];
    const ButtonTitle = (
      <div className='TopHeader'>
        <Search placeholder="input search text" enterButton size='small' style={{ width: '600px' }} />
        <button className='create_role' onClick={this.handleCreateRole}>创建角色</button>
      </div>

    )
    return (
      <div className='RoleContent' >
        <div className='RoleTop'>
          <Breadcrumb>
            {
              TitleIcon.map((item) => {
                return (
                  <BreadcrumbItem key={item.key} href={'/admin' + item.path}>
                    {item.icon}
                    <span>{item.label}</span>
                  </BreadcrumbItem>
                )
              })
            }
          </Breadcrumb>
        </div>
        <section>
          <Card title={ButtonTitle} bordered={false} >
            <Radio.Group
              onChange={({ target: { value } }) => {
                this.setState({
                  selectionType: value
                })
              }}
              value={selectionType}
            >
              <Radio value="checkbox">Checkbox</Radio>
              <Radio value="radio">radio</Radio>
            </Radio.Group>
            <Divider />
            <Table
              bordered
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              columns={columns}
              dataSource={[...usersList]}
              pagination={pagination}
              loading={loading}
              rowKey={(columns) => columns.id}
              onChange={this.handleTableChange}
            />
          </Card>
        </section>
      </div >
    )
  }
}

export default Role;