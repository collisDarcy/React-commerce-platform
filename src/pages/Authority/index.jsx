import React, { Component } from 'react'
import { acquireRole, acquireRoleAuthority, updateRoleAuthority } from '../../api/index.js';
import { message, Table, Tooltip, Popconfirm, Modal, Tree } from 'antd';
import { FormOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import './index.css';

//树形数据结构数组
class Authority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleList: [],//所有角色的列表数据
      rightsList: [],//获取用户权限数据
      setRightDialogVisible: false,//控制分配权限对话框的显示与隐藏
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
      expandedKeys: [],
      checkedKeys: [],
      selectedKeys: [],
      autoExpandParent: true
    }
    this.updateAuthorityRef = React.createRef();
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
  handleSetRoleVisible = async (record) => {
    // console.log('record', record);
    const { checkedKeys } = this.state;
    const { data: res } = await acquireRoleAuthority();
    console.log('res.data', res.data);
    if (res.meta.status !== 200) {
      return message.error('获取当前角色权限失败!');
    }
    message.success('获取当前角色权限成功!');

    this.setState({
      setRightDialogVisible: true,
      rightsList: res.data,
      roleId: record.id
    })
    //当前角色拥有的权限
    this.getLeafKeys(record, checkedKeys);
    //将得到的数据转换为tree树形数据
    this.treeDataList = this.getTreeDataList(res.data);
  }

  //将得到的数组转换为树形数组结构
  getTreeDataList = (dataList) => {
    return dataList.reduce((pre, item) => {
      pre.push({
        title: item.authName,
        key: item.id,
        children: item.children ? this.getTreeDataList(item.children) : null
      })
      return pre;
    }, [])
  }

  //通过递归的方式获取角色下的子级权限--当前角色拥有的权限
  getLeafKeys = (currentRecord, arr) => {
    if (!currentRecord.children) {
      return arr.push(currentRecord.id);
    }
    currentRecord.children.forEach((item) => this.getLeafKeys(item, arr));
  }
  onConfirm = () => {
    message.success('删除成功!');
  }
  onCancel = () => {
    message.success('取消分配角色!');
    this.setState({
      setRightDialogVisible: false
    })
  }
  handleCurrentAuthorityOk = async () => {
    //发起更新权限的请求
    const IdStr = this.updateAuthorityRef.current.props.checkedKeys.join(',');//数组转字符串
    const { roleId } = this.state;
    const { data: res } = await updateRoleAuthority(roleId, IdStr);
    if (res.meta.status !== 200) {
      return message.error('更新失败!');
    }
    message.success('更新成功!');
    this.getRolesList();
    this.setState({
      setRightDialogVisible: false,
      checkedKeys: []
    })
  }
  handleCurrentAuthorityCancel = () => {
    message.success('取消更新!');
    this.setState({
      setRightDialogVisible: false,
      checkedKeys: []
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
    console.log('checkedKeyValue', checkedKeysValue);
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
    const { roleList, loading, setRightDialogVisible, disabled, bounds, selectedKeys, autoExpandParent, checkedKeys } = this.state;
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
          rowKey={(columns) => columns.id}
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
            defaultExpandParent={true}
            onExpand={this.onExpand}
            expandedKeys={checkedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
            treeData={this.treeDataList}
            ref={this.updateAuthorityRef}
          />
        </Modal>
      </div>


    )
  }
}
export default Authority;