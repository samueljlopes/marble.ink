import React, { Component } from 'react';
import './App.css';
import InkCanvas from './components/inkCanvas.js'
import InkPhysics from './components/inkPhysics.js'
import InkTineLines from './core/inkTineLines.js'
import { Radio } from "antd";
import 'antd/dist/antd.css';
import paper from 'paper';

class App extends Component {
  state = {
    optionsDrawerValue: 0,
    allItems: paper.Group
  }

  componentDidMount() {
    paper.install(window);
    this.setState({ allItems: new paper.Group() })
  }

  onChangeOptionsDrawerValue = (val) => {
    this.setState({ optionsDrawerValue: val.target.value })
  }

  addItemToAllItems = (paperItem) => {
    let currentAllItems = this.state.allItems;
    currentAllItems.addChild(paperItem);
    this.setState({ allItems: currentAllItems });
  }

  render() {
    let currentCanvasTool;
    switch(this.state.optionsDrawerValue) {
      case 0:
        currentCanvasTool = <InkPhysics expansionRate={1} 
        allItems={this.state.allItems} addItemToAllItems={this.addItemToAllItems}></InkPhysics>
        break;
      case 1:
        currentCanvasTool = <InkTineLines></InkTineLines>
        break;
      default:
        currentCanvasTool = <InkPhysics expansionRate={1} 
        allItems={this.state.allItems} addItemToAllItems={this.addItemToAllItems}></InkPhysics>
    }

    return (
      <div>
        <OptionsDrawer value={this.state.optionsDrawerValue} onChange={this.onChangeOptionsDrawerValue}></OptionsDrawer>
        <div>
          <InkCanvas></InkCanvas>
          {currentCanvasTool}
        </div>
      </div>
    );
  }
}

class OptionsDrawer extends React.Component {
  render() {
    const { value, onChange } = this.props;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px"
    };

    return (
      <Radio.Group onChange={onChange} value={value}>
        <Radio.Button style={radioStyle} value={0}>
          No Tine Lines
        </Radio.Button>
        <Radio.Button style={radioStyle} value={1}>
          Tine Lines
        </Radio.Button>
      </Radio.Group>
    );
  }
}

export default App;
