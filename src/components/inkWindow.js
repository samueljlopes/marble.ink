import React, { Component } from 'react';
import paper from 'paper';

import InkCanvas from './inkCanvas.js'
import InkTool from './inkTool.js'
import { Radio, Button} from "antd";

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

  onUndo = () => 
  {
    let previousState = this.state.allItemsHistory.pop();
    paper.project.activeLayer.remove();
    paper.project.activeLayer.importJSON(previousState);

    let newAllItems = paper.project.activeLayer.children[0];
    this.setState({ allItems: newAllItems})
  }

  render() {
    return (
        <div className="mainCanvas">
          <InkCanvas></InkCanvas>
          <div className="optionsDrawer">
            <OptionsDrawer value={this.state.optionsDrawerValue} 
            onChange={this.onChangeOptionsDrawerValue}></OptionsDrawer>
            <br></br><br></br>
            <Button disabled={false} onClick={this.onUndo}>Undo</Button><Button disabled>Redo</Button>
          </div>

          <InkTool type={this.state.optionsDrawerValue} 
          allItems={this.state.allItems}
          allItemsHistory={this.state.allItemsHistory} 
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
