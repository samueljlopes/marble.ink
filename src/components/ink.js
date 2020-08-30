import paper, { Point, Path, Group} from 'paper';
import React from 'react';
import { create, all } from 'mathjs'
import InkUI from './inkUI.js'

const config = {}
const math = create(all, config)

class InkCanvas extends React.Component {
  state = {
    isMouseDown: false,
    allDisplacements: [],
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
  }

  blotPhysics() 
  {
    //Ink blot physics
    if (this.state.allItems.children.length > 1 && this.state.isMouseDown == true)
    {
      for (let i = 0; i < this.state.allDisplacements.length; i++)
      {
        this.state.allDisplacements[i].remove();
      }

      var allInkBlots = this.state.allItems.children;
      var allTransformations = [];
    
      for (let i = 1; i < allInkBlots.length; i++) {
        let center = allInkBlots[i].position;
        let radius = Math.sqrt(allInkBlots[i].area / Math.PI);
        for (let j = i - 1; j >= 0; j--)
        {
          console.log("blot " + i + " acting on blot " + j);
          var transformation;
          if (allTransformations[j] == undefined)
          {
            transformation = this.radialDisplacement(allInkBlots[j], center, radius); 
          } else 
          {
            console.log("using previous transformations")
            transformation = this.radialDisplacement(allTransformations[j], center, radius)
          }
          transformation.selected = true;
          allTransformations[j] = (transformation);
        }
      }
      this.setState({allDisplacements : allTransformations});
    }
  }

  radialDisplacement(blot, center, radius) 
  {
    var newBlot = []
    for (let i = 0; i < blot.segments.length; i++) {
      var segment = new paper.Segment()
      segment.point =
        this.radialDisplacementFormula(blot.segments[i].point, center, radius);    
      newBlot.push(segment);   
    }
    return new Path(newBlot);
  }

  radialDisplacementFormula(point, center, radius) {
    let magnitude = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y,2));    
    var pointPrimeX = center.x + ((point.x - center.x) * Math.sqrt(1 + (Math.pow(radius, 2) / Math.pow(magnitude, 2))));
    var pointPrimeY = center.y + ((point.y - center.y) * Math.sqrt(1 + (Math.pow(radius, 2) / Math.pow(magnitude, 2))));
    return (new Point(pointPrimeX, pointPrimeY));
  }

  render() //recalled every time setState is called elsewhere in the code
  {
    return (
      <div>
        <canvas id="canvas" width="1200" height="1000"></canvas>
        <InkUI allItems={this.state.allItems} isMouseDown={this.state.isMouseDown} ></InkUI>
      </div>
    ); //canvas is returned to the main program
  }
}

export default InkCanvas
