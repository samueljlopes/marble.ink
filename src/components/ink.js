import paper, { Point, Path, Circle, Group } from 'paper';
import React from 'react';
import { create, all } from 'mathjs'

const config = {}
const math = create(all, config)

class InkCanvas extends React.Component {
  state = {
    isMouseDown: false,
    testDisplacement: true,
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
      circle.flatten(0.01); //This is a bit of a cheat. The number of anchor points on the circle primitive is 4, so the flatten command establishes more anchor points.
      circle.selected = true;

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

    if (this.state.allItems.children.length == 3 && this.state.testDisplacement == true) {
      let radius = Math.sqrt(this.state.allItems.children[1].area / Math.PI)
      let innerSegments = this.getInnerPoints(this.state.allItems.children[0], 0.99, null);
      console.log(innerSegments);

      for (let i = 0; i < this.state.allItems.children[0].segments.length; i++) {
        this.state.allItems.children[0].segments[i].point =
          this.radialDisplacementFormula(this.state.allItems.children[0].segments[i].point, this.state.allItems.children[1].position, radius);
        //An odd shape is achieved when the formula is applied. 
      }
      this.setState({ testDisplacement: false });
    }
  }

  getInnerPoints(givenObject, scale, existingPoints) {
    if (existingPoints == null) { existingPoints = [] }
    else { givenObject.remove(); }

    var scaledObject = givenObject.clone()
    scaledObject.scale(scale);
    if ((scaledObject.bounds.height * scaledObject.bounds.width) < 1) {
      return (existingPoints);
    }
    else {
      existingPoints.push(...scaledObject.segments);
      return this.getInnerPoints(scaledObject, scale - 0.01, existingPoints);
    }
  }

  radialDisplacementFormula(point, center, radius) {
    //console.log(point + " " + center + " " + radius);
    var pointPrimeX = center.x + ((point.x - center.x) * Math.sqrt(1 + (Math.pow(radius, 2) / Math.pow(Math.abs(point.x - center.x), 2))));
    var pointPrimeY = center.y + ((point.y - center.y) * Math.sqrt(1 + (Math.pow(radius, 2) / Math.pow(Math.abs(point.y - center.y), 2))));
    return (new Point(pointPrimeX, pointPrimeY));
  }

  render() //recalled every time setState is called elsewhere in the code
  {
    return (
      <div>
        <canvas id="canvas" width="1200" height="1000"></canvas>
      </div>
    ); //canvas is returned to the main program
  }
}

export default InkCanvas
