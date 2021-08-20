import React, { Component } from 'react';

import 'antd/dist/antd.css';
import './styles/headerNavigation.css'
import { Layout, Typography, Menu } from 'antd';

const { Title } = Typography;
const { Header } = Layout;

class HeaderNavigation extends Component {
  state = {
    currentMenuItem: 0,
  };

  handleClick = e => {
    this.setState({ currentmenuItem: e.key });
  };

  render() {
    return (
      <div>
        <Header>
          <div className="headerTitle">
            <Title className="marbleFont">marble.ink</Title>
          </div>
          <Menu theme="dark" className="headerMenu" mode="horizontal" defaultSelectedKeys={['0']}>
              <Menu.Item key={0}>Canvas</Menu.Item>
              <Menu.Item key={1}>About Me</Menu.Item>
          </Menu>
        </Header>
      </div>
    );
  }
}
export default HeaderNavigation