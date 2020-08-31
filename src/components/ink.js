import paper, { Point, Path, Group} from 'paper';
import React from 'react';
import { create, all } from 'mathjs'
import InkPhysics from './inkPhysics.js'

const config = {}
const math = create(all, config)

class InkCanvas extends React.Component {
  state = {
    isMouseDown: false,
    allItems: paper.Group
  }
  //State is effectively a property outside the data flow, not an argument passed in
  constructor(props) {
    super(props);
    this.expansionRate = parseInt(props.expansionRate, 10);
  }

  componentDidMount() {
    this.setupCanvas();
    let path = new Path(); //This is to test the size of the canvas 
    path.strokeColor = 'black';
    path.add(new Point(0, 0),
      new Point(2 * paper.view.center.x, 0),
      new Point(2 * paper.view.center.x, 2 * paper.view.center.y),
      new Point(0, 2 * paper.view.center.y),
      new Point(0, 0));
    setInterval(() => this.frameUpdate(), 10);
  }

  setupCanvas() {
    paper.setup('canvas');
    this.setState({ allItems: new Group() })
  }

  addItemToAllItems(paperItem) {
    let currentAllItems = this.state.allItems;
    currentAllItems.addChild(paperItem);
    this.setState({ allItems: currentAllItems });
  }

  frameUpdate() {
    paper.view.onMouseDown = (event) => {
      let circle = new Path.Circle({ center: event.point, radius: 10, fillColor: 'black' })
      circle.flatten(0.0001); //This is a bit of a cheat. The number of anchor points on the circle primitive is 4, so the flatten command establishes more anchor points.

      this.setState({ isMouseDown: true });
      this.addItemToAllItems(circle);
    }

    paper.view.onMouseUp = (event) => {
      this.setState({ isMouseDown: false });
    }

    if (this.state.isMouseDown && this.state.allItems.children.length > 0) {
      let length = this.state.allItems.children.length;
      let currentBlot = this.state.allItems.children[length - 1];
      currentBlot.scale(0.01 + this.expansionRate);
      this.state.allItems.children[length - 1] = currentBlot;
    }
  }

  render() //recalled every time setState is called elsewhere in the code
  {
    return (
      <div>
        <canvas id="canvas" width={window.innerWidth} height={window.innerHeight} resize></canvas>
        <InkPhysics allItems={this.state.allItems} isMouseDown={this.state.isMouseDown} ></InkPhysics>
      </div>
    ); //canvas is returned to the main program
  }
}

export default InkCanvas
