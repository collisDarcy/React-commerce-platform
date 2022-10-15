import React, { Component } from 'react'
import {
  HomeOutlined, UserOutlined, PictureOutlined, FrownOutlined, IdcardOutlined, HddOutlined, GatewayOutlined, FormOutlined, DeleteOutlined, SettingOutlined
} from '@ant-design/icons';

import { Breadcrumb, Card, Table, Divider, Radio, Input, message, Switch, Tooltip, Popconfirm, Modal, Form, Select } from 'antd';
import { getUserListMethod, switchUserState, deleteCurrentUser, addUser } from '../../api';
import { formateDate } from '../../utils/formateDate';
import './index.css'
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';
import Draggable from 'react-draggable';
const { Search } = Input;
const { Option } = Select;
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
//验证手机号的规则
const MobileRule = (rule, value, callback) => {
  console.log(callback, 'callback');
  const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (regMobile.test(value)) {
    return callback();
  }
  callback(new Error('Please input the correct mobile number!'));
}
//验证规则

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
      //弹窗的属性
      open: false,//模态弹窗的状态
      disabled: false,
      //弹窗的位置
      bounds: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
      },
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
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
  //弹窗事件
  //点击添加用户
  handleCreateRole = () => {
    this.setState({
      open: true
    })
  }
  handleOk = async () => {
    const { data: res } = await addUser(this.formRef.current.getFieldsValue());
    if (res.meta.status !== 201) {
      message.error('添加用户失败!');
    }
    message.success('添加用户成功!');
    this.getUserList();
    this.setState({
      open: false
    })

  }
  handleCancel = () => {
    message.success('取消添加用户!')
    this.setState({
      open: false
    })
  }
  onFinish = (value) => {
    console.log('Finish', value);
  }
  //弹窗ref
  draggleRef = React.createRef();
  //表单ref
  formRef = React.createRef();
  onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = this.draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    this.setState({
      bounds: {
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      }
    })
  };
  render() {
    const { selectionType, usersList, pagination, loading, open, disabled, bounds } = this.state;
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
    const prefixSelector = (
      <Form.Item name="prefix" noStyle initialValue="+86">
        <Select style={{ width: 70 }}>
          <Option value="87">+87</Option>
        </Select>
      </Form.Item>
    );
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
        <Modal
          title={
            <div
              style={{
                width: '100%',
                cursor: 'move',
              }}
              onMouseOver={() => {
                if (disabled) {
                  this.setState({
                    disabled: false
                  })
                }
              }}
              onMouseOut={() => {
                this.setState({
                  disabled: true
                })
              }}
              onFocus={() => { }}
              onBlur={() => { }}
            >
              添加用户
            </div>
          }
          open={open}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          modalRender={(modal) => (
            <Draggable
              disabled={disabled}
              bounds={bounds}
              onStart={(event, uiData) => this.onStart(event, uiData)}
            >
              <div ref={this.draggleRef}>{modal}</div>
            </Draggable>
          )}
        >
          <Form ref={this.formRef} onFinish={this.onFinish}>
            <Form.Item
              name="username"
              label="Name"
              rules={[
                {
                  required: true, message: 'The username lenght at least four characters!'
                }, {
                  min: 4, message: 'The username lenght at least four characters!'
                }, {
                  max: 12, message: 'The username length at most twelve characters!'
                }, {
                  pattern: /^[a-zA-Z0-9_]+$/, message: 'The username is made of English,digitals,and underscroes'
                }
              ]}
            >
              <Input type='text' maxLength={17} />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true, message: 'Please input your password!',
                }, {
                  min: 4, message: 'The username lenght at least four characters!'
                }, {
                  max: 12, message: 'The username length at most twelve characters!'
                }, {
                  pattern: /^[a-zA-Z0-9_]+$/, message: 'The username is made of English,digitals,and underscroes'
                }
              ]}
              hasFeedback
            >
              <Input.Password maxLength={17} />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please input your phone number!' },
                { validator: MobileRule, validateTrigger: 'blur' }
              ]}
            >
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            </Form.Item>

          </Form>
        </Modal>
      </div >
    )
  }
}

export default Role;