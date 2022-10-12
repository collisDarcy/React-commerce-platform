import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Switch, Descriptions, PageHeader, Statistic, Row, Modal, message } from 'antd';
import { logoutAction } from '../../pages/Login/action';
import { formateDate } from '../../utils/formateDate';
import './index.css'


const extraContent = (
  <div className='lineStatus'>
    <Statistic
      title="Status"
      value="Online"
    />
  </div>
);

const Content = ({ children, extra }) => (
  <div className="content">
    <div className="main">{children}</div>
    <div className="extra">{extra}
      <Switch />
    </div>
  </div>
);
//倒计时
const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      flag: '',
      currentTime: formateDate(Date.now()),//当前时间的字符串
      open: false,
      confirmLoading: false,
      modalText: '是否确认退出登录?'
    }
  }
  componentDidMount() {
    const { username } = this.props;
    //开启定时器--实现时间更新的功能
    this.getCurrentTime();
    this.setState({
      username
    })
  }
  //界面卸载的时候清空定时器
  componentWillUnmount() {
    clearInterval(this.IntervalTimer);
  }
  onFinish = () => {
    console.log('finished!');
  }
  //获取当前的时间的处理函数
  getCurrentTime = () => {
    this.IntervalTimer = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({
        currentTime
      })
    }, 1000)
  }
  //退出登录的处理函数
  showModal = () => {
    this.setState({
      open: true,
      modalText: '是否确认退出登录?',
      confirmLoading: false
    })
  };

  handleOk = () => {
    this.setState({
      modalText: '将在3秒后退出登录!',
      confirmLoading: true
    })
    this.timer = setTimeout(() => {
      this.setState({
        open: false,
        confirmLoading: false
      })
      this.props.logoutAction(false);
      localStorage.removeItem('token');
      this.props.history.push('/');
    }, 3000);

  };

  handleCancel = () => {
    this.setState({
      open: false
    })
    clearTimeout(this.timer);
    this.timer = null;
    message.success('取消成功!');

  };
  render() {
    const { open, confirmLoading, modalText } = this.state;
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title="Title"
        subTitle="The detailed introduction to the E-COMMERCE-PLATFORM"
        extra={[
          <Button key="3">Operation</Button>,
          <Button key="2">Operation</Button>,
          <Button key="1" type="primary" onClick={this.showModal}>
            退出
          </Button>,
          <Modal
            title="退出登录的窗口"
            open={open}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <p>{modalText}</p>
          </Modal>
        ]}
      >
        <Content extra={extraContent}>
          <Descriptions size="small" column={1}>
            <Descriptions.Item key="1" label="Author">{this.props.username}</Descriptions.Item>
            <Descriptions.Item key="2" label="Creation Time">2022/10/05</Descriptions.Item>
            <Descriptions.Item key="3" label="Current Time">{this.state.currentTime}</Descriptions.Item>
            <Descriptions.Item key="4" label="Identity">
              Admin,user,test
            </Descriptions.Item>
          </Descriptions>
          <div className='countDown'>
            <Row gutter={50}>
              <Countdown title=" Offline Time" value={deadline} onFinish={this.onFinish} />
            </Row>
          </div>
        </Content>

      </PageHeader>
    )
  }
}
const mapState = (state) => {
  const { isLogin } = state.LoginReducer;
  return {
    isLogin
  }

}
const mapDispatch = (dispatch) => ({
  logoutAction(flag) {
    dispatch(logoutAction(flag));
  }

})
export default connect(mapState, mapDispatch)(Header);