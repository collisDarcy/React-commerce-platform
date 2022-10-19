import React, { Component } from 'react'
import { acquireRole, acquireRoleAuthority } from '../../api/index.js';
import { message, Table, Tooltip, Popconfirm, Modal, Tree } from 'antd';
import { FormOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import './index.css';
const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          {
            title: '0-0-0-0',
            key: '0-0-0-0',
          },
          {
            title: '0-0-0-1',
            key: '0-0-0-1',
          },
          {
            title: '0-0-0-2',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {
            title: '0-0-1-0',
            key: '0-0-1-0',
          },
          {
            title: '0-0-1-1',
            key: '0-0-1-1',
          },
          {
            title: '0-0-1-2',
            key: '0-0-1-2',
          },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      {
        title: '0-1-0-0',
        key: '0-1-0-0',
      },
      {
        title: '0-1-0-1',
        key: '0-1-0-1',
      },
      {
        title: '0-1-0-2',
        key: '0-1-0-2',
      },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];
class Authority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleList: [],//所有角色的列表数据
      rightsList: [],//获取用户权限数据
      setRightDialogVisible: false,//控制分配权限对话框的显示与隐藏
      //树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defaultKeys: [],//默认选中的节点的id值数组
      roleId: '',//当前即将分配权限的角色id
      loading: false,
      disabled: false,
      //弹窗的位置
      bounds: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
      },
      //tree图的属性
      expandedKeys: ['0-0-0', '0-0-1'],
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      autoExpandParent: true
    }
  }
  componentDidMount() {
    this.getRolesList();
  }
  //获取角色列表数据
  getRolesList = async () => {
    const { data: res } = await acquireRole();
    if (res.meta.status !== 200) {
      return message.error('角色列表获取失败!');
    }
    message.success('角色列表获取成功!');
    this.setState({
      roleList: res.data
    })
  }
  // handleEditVisible = () => {
  //   console.log('111');
  // }
  handleSetRoleVisible = async (record) => {
    console.log('record', record);
    const { defaultKeys } = this.state;
    const { data: res } = await acquireRoleAuthority();
    if (res.meta.status !== 200) {
      return message.error('获取当前角色权限失败!');
    }
    message.success('获取当前角色权限成功!');

    this.setState({
      setRightDialogVisible: true,
      rightsList: res.data
    })
    //将得到的数据转换
    this.getLeafKeys(record, defaultKeys);
  }
  //通过递归的方式获取角色下的子级权限
  getLeafKeys = (currentRecord, arr) => {
    if (!currentRecord.children) {
      return arr.push(currentRecord.id);
    }
    currentRecord.children.forEach((item) => this.getLeafKeys(item, arr));
  }
  //这是删除的确定和取消
  // onConfirm = () => {
  //   message.success('删除成功!');
  // }
  // onCancel = () => {
  //   message.success('取消分配角色!');
  //   this.setState({
  //     setRightDialogVisible: false
  //   })
  // }
  handleCurrentAuthorityOk = () => {
    this.setState({
      setRightDialogVisible: false,
      defaultKeys: []
    })
  }
  handleCurrentAuthorityCancel = () => {
    this.setState({
      setRightDialogVisible: false,
      defaultKeys: []
    })
  }
  //tree树图的方法
  onExpand = (expandedKeysValue) => {
    console.log('expandedKeysValue');
    this.setState({
      expandedKeys: expandedKeysValue,
      autoExpandParent: false
    })
  }
  onCheck = (checkedKeysValue) => {
    console.log('selectedKeysValue', checkedKeysValue);
    this.setState({
      checkedKeys: checkedKeysValue
    })
  }
  onSelect = (selectedKeysValue) => {
    console.log('selectedKeysValue', selectedKeysValue);
    this.setState({
      selectedKeys: selectedKeysValue
    })
  }
  //弹窗移动的ref
  draggleRef = React.createRef();
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
    const { roleList, loading, setRightDialogVisible, disabled, bounds, expandedKeys, checkedKeys, selectedKeys, autoExpandParent, rightsList } = this.state;
    console.log(rightsList, '23');
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center'
      },
      {
        title: '用户身份',
        dataIndex: 'roleName',
        align: 'center'
      },
      {
        title: '身份描述',
        dataIndex: 'roleDesc',
        align: 'center'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        render: (state, record) => {
          return (
            <div className='tableLast'>
              <span onClick={() => this.handleEditVisible(record)}>
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
              <span onClick={() => this.handleSetRoleVisible(record)}>
                <Tooltip placement='top' title='分配权限'>
                  <SettingOutlined />
                </Tooltip>
              </span>
            </div >
          )

        }
      },
    ];
    return (
      <div className="autorityContent">
        <Table
          bordered
          columns={columns}
          dataSource={[...roleList]}
          loading={loading}
          pagination={false}
          onChange={this.handleTableChange}
        />
        {/* 控制角色权限的对话框的显示与隐藏 */}
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
              分配角色权限
            </div>
          }
          open={setRightDialogVisible}
          onOk={this.handleCurrentAuthorityOk}
          onCancel={this.handleCurrentAuthorityCancel}
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
          <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
            treeData={rightsList}
          />
        </Modal>
      </div>


    )
  }
}
export default Authority;