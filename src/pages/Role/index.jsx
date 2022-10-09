import React, { Component } from 'react'
import {
  HomeOutlined, UserOutlined, PictureOutlined, FrownOutlined, IdcardOutlined, HddOutlined, GatewayOutlined, FormOutlined, DeleteOutlined, SettingOutlined
} from '@ant-design/icons';
import { Breadcrumb, Card, Table, Divider, Radio, Input, message, Switch, Tooltip } from 'antd';
import { getUserListMethod } from '../../api';
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
const columns = [
  {
    title: '索引',
    dataIndex: 'key',
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
    render: (status) => {
      //status是当前的值--mg_state
      //record是每一行的值
      return (
        <Switch checked={status} />
      )
    }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    render() {
      return (
        <div className='tableLast'>
          <span>
            <Tooltip placement='top' title='编辑'>
              <FormOutlined />
            </Tooltip>
          </span>
          <span>
            <Tooltip placement='top' title='删除'>
              <DeleteOutlined />
            </Tooltip>
          </span>
          <span>
            <Tooltip placement='top' title='设置'>
              <SettingOutlined />
            </Tooltip>
          </span>
        </div>
      )

    }
  },
];

const ButtonTitle = (
  <div className='TopHeader'>
    <Search placeholder="input search text" enterButton size='small' style={{ width: '600px' }} />
    <button className='create_role'>创建角色</button>
  </div>

)
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
      total: 0,
      selectionType: 'checkbox',
      NewUsersKeyList: [],//新的用户列表数组，使用object.assign()添加新的属性key
      pagination: 0,//分页器
    }
  }
  UNSAFE_componentWillMount() {
    this.getUserList();
  }
  componentDidMount() {
    setTimeout(() => {
      const { usersList, NewUsersKeyList } = this.state;
      console.log(usersList)
      usersList.map((item, index) => {
        return NewUsersKeyList.push(Object.assign({}, item, { key: index }));
      })
      this.setState({
        NewUsersKeyList
      })
    }, 500)
  }
  getUserList = async () => {
    const { queryInfo } = this.state;
    const { data: res } = await getUserListMethod(queryInfo);
    if (res.meta.status === 200) {
      message.success('获取管理员列表成功!');
      this.setState({
        usersList: res.data.users
      })
    } else {
      message.error('获取管理员列表失败!');
    }
  }
  render() {
    const { selectionType, NewUsersKeyList } = this.state;
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
        <footer>
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
              dataSource={[...NewUsersKeyList]}
              pagination="2"
            />
          </Card>
        </footer>
      </div >
    )
  }
}

export default Role;