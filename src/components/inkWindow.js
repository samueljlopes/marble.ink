import React, { Component } from 'react';
import paper from 'paper';

import InkCanvas from './inkCanvas.js'
import InkTool from './inkTool.js'
import { Radio, Button } from "antd";

import '../../node_modules/antd/dist/antd.css';
import './styles/inkWindow.css';

class InkWindow extends Component {
  state = {
    optionsDrawerValue: 0,
    allItems: paper.Group,
    allItemsHistory: []
    
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

  addToHistory = () => {
    let currentAllItemsHistory = this.state.allItemsHistory;
    currentAllItemsHistory.push(this.state.allItems.exportJSON());
    this.setState({ allItemsHistory: currentAllItemsHistory });
    console.log(currentAllItemsHistory.length)
  }

  onUndo = () => {
    if (this.state.allItemsHistory.length >= 1) {
      let previousState = this.state.allItemsHistory.pop();
      paper.project.activeLayer.remove();
      paper.project.activeLayer.importJSON(previousState);

      let newAllItems = paper.project.activeLayer.children[0];
      //The only thing that should be restored is a single group, so just grab the first element in the enclosing array
      this.setState({ allItems: newAllItems })
    }
  }

  render() {
    const historyLength = this.state.allItemsHistory.length
    return (
      <div className="mainCanvas">
        <InkCanvas></InkCanvas>
        <div className="options">
          <OptionsDrawer value={this.state.optionsDrawerValue}
            onChange={this.onChangeOptionsDrawerValue}></OptionsDrawer>
          <br></br>
          <Button disabled={historyLength === 0 || historyLength === undefined} className='optionsUndo' onClick={this.onUndo}>Undo</Button>
        </div>

        <InkTool type={this.state.optionsDrawerValue}
          allItems={this.state.allItems}
          addItemToAllItems={this.addItemToAllItems.bind(this)}
          addToHistory={this.addToHistory.bind(this)}></InkTool>
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
          Straight Tine Lines
        </Radio.Button>
        <Radio.Button style={radioStyle} value={2}>
          Curved Tine Lines
        </Radio.Button>
        <Radio.Button style={radioStyle} value={3}>
          Circular Tine Lines
        </Radio.Button>
      </Radio.Group>
    );
  }
}

export default InkWindow;
