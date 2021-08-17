import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import InkWindow from './components/inkWindow.js'
import { Layout  } from 'antd';
const { Header } = Layout;

class App extends Component {
  render() {
    return (
      <div>
          <Header></Header>
          <InkWindow></InkWindow>
      </div>
    );
  }
}

export default App;
