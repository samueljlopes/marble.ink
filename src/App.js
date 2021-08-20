import React, { Component } from 'react';
import './App.less';

import HeaderNavigation from './components/layout/headerNavigation.js'
import InkWindow from './components/inkWindow.js'
class App extends Component {
  render() {
    return (
      <div>
          <HeaderNavigation></HeaderNavigation>
          <InkWindow></InkWindow>
      </div>
    );
  }
}

export default App;
