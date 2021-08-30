import React, { Component } from 'react';

import 'antd/dist/antd.css';
import './styles/headerNavigation.css'
import { Layout, Typography, Menu, Button} from 'antd';
import { InstagramOutlined, TwitterOutlined, ShareAltOutlined } from '@ant-design/icons';

import InkExport from './inkExport.js'

const { Title } = Typography;
const { Header } = Layout;

class HeaderNavigation extends Component {
  state = {
    currentMenuItem: 0,
    displayExportWindow: false
  };

  handleMenuClick = event => {
    this.setState({ currentMenuItem: event.key });
  };

  handleExportClick (param, event) {
    this.setState({ displayExportWindow : param})
  };
  

  render() {
    const displayExportWindow = this.state.displayExportWindow
    return (
      <div>
        <Header>
          {/*Left aligned  */}
          <div className="headerTitle">
            <Title className="marbleFont">marble.ink</Title>
          </div>

          {/*Right aligned  */}
          <InstagramOutlined style={{ fontSize: '2.5em', color: '#ffffff', float: 'right', margin: '12px' }}/>
          <TwitterOutlined style={{ fontSize: '2.5em', color: '#ffffff', float: 'right', margin: '12px' }}/>
          <Menu theme="dark" className="headerMenu" mode="horizontal" defaultSelectedKeys={['0']}>
              <Menu.Item key={0}>Canvas</Menu.Item>
              <Menu.Item key={1}>About Me</Menu.Item>
          </Menu>
          <Button type="primary" className="headerExport"
            icon={<ShareAltOutlined />} onClick={this.handleExportClick.bind(this, true)}>Export Canvas</Button>
        </Header>
        {displayExportWindow == true &&
          <InkExport onCancel={this.handleExportClick.bind(this, false)}></InkExport>
        }
      </div>
    );
  }
}
export default HeaderNavigation