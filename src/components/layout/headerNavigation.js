import React, { Component } from 'react';

import 'antd/dist/antd.css';
import './styles/headerNavigation.css'
import { Layout, Typography } from 'antd';

const { Title } = Typography;
const { Header } = Layout;

class HeaderNavigation extends Component 
{
    render() {
        return (
          <div>
              <Header>
                <Title className="marbleTitle">marble.ink</Title>
              </Header>
          </div>
        );
    }
}
export default HeaderNavigation