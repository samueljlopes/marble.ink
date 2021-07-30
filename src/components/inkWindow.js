import React, { Component } from 'react';
import './inkWindow.css';
import InkCanvas from './inkCanvas.js'
import InkPhysics from './inkPhysics.js'
import InkTineLines from '../core/inkTineLines.js'
import InkCurvedTineLines from '../core/inkCurvedTineLines.js'
import InkCircularTineLines from '../core/inkCircularTineLines.js'
import { Radio, Button} from "antd";
import 'antd/dist/antd.css';
import paper from 'paper';


class InkWindow extends Component {
  state = {
    optionsDrawerValue: 0,
    allItems: paper.Group,
    history: []
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
    const tool = (toolNumber) => ({
      0: <InkPhysics expansionRate={1} 
      allItems={this.state.allItems} addItemToAllItems={this.addItemToAllItems}>
      </InkPhysics>,
      1: <InkTineLines allItems={this.state.allItems} addItemToAllItems={this.addItemToAllItems} alpha={80} lambda={8}></InkTineLines>,
      2: <InkCurvedTineLines allItems={this.state.allItems} addItemToAllItems={this.addItemToAllItems} alpha={80} lambda={8}></InkCurvedTineLines>,
      3: <InkCurvedTineLines allItems={this.state.allItems} addItemToAllItems={this.addItemToAllItems} alpha={80} lambda={8}></InkCurvedTineLines>
    })[toolNumber]
    
    const currentCanvasTool = tool(this.state.optionsDrawerValue)
    //Modify with HOC here

    return (
      <div>
        <div className="mainCanvas">
          <InkCanvas></InkCanvas>
          <div className="optionsDrawer">
            <OptionsDrawer value={this.state.optionsDrawerValue} onChange={this.onChangeOptionsDrawerValue}></OptionsDrawer>
            <br></br><br></br>
            <Button disabled>Undo</Button> 
            <Button disabled>Redo</Button>
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
