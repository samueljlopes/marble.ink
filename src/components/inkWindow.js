import React, { Component } from 'react';
import './inkWindow.css';
import InkCanvas from './inkCanvas.js'
import InkPhysics from './inkPhysics.js'
import InkTineLines from '../core/inkTineLines.js'
import { Radio } from "antd";
import 'antd/dist/antd.css';
import paper from 'paper';


class InkWindow extends Component {
  state = {
    optionsDrawerValue: 0,
    allItems: paper.Group
  }

  componentDidMount() {
    paper.install(window);
    this.setState({ allItems: new paper.Group() })
  }

  onChangeOptionsDrawerValue = (event) => {
    this.setState({ optionsDrawerValue: event.target.value })
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
        currentCanvasTool = <InkTineLines allItems={this.state.allItems} addItemToAllItems={this.addItemToAllItems} alpha={80} lambda={8}></InkTineLines>
        break;
      default:
        currentCanvasTool = <InkPhysics expansionRate={1} 
        allItems={this.state.allItems} addItemToAllItems={this.addItemToAllItems}></InkPhysics>
    }

    return (
      <div>
        <div className="mainCanvas">
          <InkCanvas></InkCanvas>
          <div className="optionsDrawer">
            <OptionsDrawer value={this.state.optionsDrawerValue} onChange={this.onChangeOptionsDrawerValue}></OptionsDrawer>
          </div>
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

export default InkWindow;
