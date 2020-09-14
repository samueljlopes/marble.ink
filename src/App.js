import React, { Component } from 'react';
import './App.css';
import InkWindow from './components/inkWindow.js'
import 'antd/dist/antd.css';
import { Layout, Menu, Typography } from 'antd';

const { Content, Sider, } = Layout;
const { Title } = Typography;

class App extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <div>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider /* collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} */>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Title style={{ padding: 8, color: "#FFFFFF"}}>marble.ink</Title>
              <Menu.Item key="1">
                Canvas
            </Menu.Item>
              <Menu.Item key="2">
                About
            </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Content style={{ margin: '0px' }}>
              <InkWindow></InkWindow>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
