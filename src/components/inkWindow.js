import React, { Component } from 'react';
import './inkWindow.css';
import InkCanvas from './inkCanvas.js'
import InkPhysics from '../core/inkPhysics.js'
import InkTineLines from '../core/inkTineLines.js'
import InkCurvedTineLines from '../core/inkCurvedTineLines.js'
import InkCircularTineLines from '../core/inkCircularTineLines.js'
import OptionsDrawer from './optionsDrawer.js'
import {Button} from "antd";
import 'antd/dist/antd.css';
import paper from 'paper';


class InkWindow extends Component {
  state = {
    optionsDrawerValue: 0,
    allItems: paper.Group,
    history : [],
  }

  componentDidMount() {
    paper.install(window);
    this.setState(
      {
        allItems : new paper.Group(),
      })
  }

  onChangeOptionsDrawerValue = (event) => {
    this.setState({ optionsDrawerValue: event.target.value })
  }

  saveStateinHistory() 
  {
    // let currentAllItems = this.state.allItems;
    // let currentHistory = this.state.history;
    // let currentAllItemsClone = currentAllItems.clone()
    // currentAllItemsClone.visible = false;

    // currentHistory.push(currentAllItemsClone);
    // this.setState(
    //   { 
    //     history : currentHistory
    //   })
  }

  addItemToAllItems = (paperItem) => {
    //React likes all state-ful objects immutable, and discourages mutating state directly.
    let currentAllItems = this.state.allItems;
    currentAllItems.addChild(paperItem);
    this.setState(
    { 
        allItems: currentAllItems
    })
    this.saveStateinHistory();
  }

  onUndo() 
  {
    for (let i = 0; i < this.state.allItems.children.length; i++) 
    {
      console.log(i);
      this.state.allItems.children[i].visible = false;
    }

    // this.state.allItems.remove();
    // let currentHistory = this.state.history;

    // let previousAllItems = currentHistory.pop();
    // this.setState(
    //   { 
    //     allItems : previousAllItems,
    //     history : currentHistory
    //   })

    // paper.project._needsUpdate = true;
    // paper.project.view.update();
  }

  render() {
    let currentCanvasTool;
    switch(this.state.optionsDrawerValue) {
      case 0:
        currentCanvasTool = <InkPhysics expansionRate={1} 
        allItems={this.state.allItems} addItemToAllItems={this.addItemToAllItems}></InkPhysics>
        break;
      case 1:
        currentCanvasTool = <InkTineLines allItems={this.state.allItems} saveStateinHistory={this.saveStateinHistory.bind(this)} alpha={80} lambda={8}></InkTineLines>
        break;
      case 2:
        currentCanvasTool = <InkCurvedTineLines allItems={this.state.allItems} addItemToAllItems={this.addItemToAllItems} alpha={80} lambda={8}></InkCurvedTineLines>
        break;
      case 3 : 
        currentCanvasTool = <InkCircularTineLines allItems={this.state.allItems} addItemToAllItems={this.addItemToAllItems} alpha={80} lambda={8}></InkCircularTineLines>
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
            <br></br><br></br>
            <Button onClick={this.onUndo.bind(this)}>Undo</Button>
          </div>
          {currentCanvasTool}
        </div>
      </div>
    );
  }
}
export default InkWindow;
