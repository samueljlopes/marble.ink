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

    if (this.state.allItems.children.length == 3) {
      var raster = this.state.allItems.children[0].rasterize();
      // Hide the raster:
      this.state.allItems.children[0].visible = false;
      raster.visible = false;

      //var quantiseCoeffecient = 2
      var quantiseFactor = 25 //quantiseFactor * this.state.allItems.children[0].area ;
      raster.on('load', function () {
        raster.size = new paper.Size(raster.width / quantiseFactor, raster.height / quantiseFactor);
        for (var y = 0; y < raster.height; y++) {
          for (var x = 0; x < raster.width; x++) {
            // Get the color of the pixel:
            var color = raster.getPixel(x, y);
            if (color.alpha == 1) {
              var pathCenter = new Point(((x / raster.width) * raster.bounds.width * quantiseFactor) + (raster.position.x - ((raster.bounds.width / 2) * quantiseFactor)),
                ((y / raster.height) * raster.bounds.height * quantiseFactor) + (raster.position.y - ((raster.bounds.height / 2) * quantiseFactor)));
              // Create a circle shaped path:
              var path = new Path.Circle({
                center: pathCenter,
                radius: 4
              });
              console.log("center: " + pathCenter);
              path.fillColor = color;
              path.selected = true;
            }
          }
        }
      });
    }
  }

  radialDisplacement() {
    let radius = Math.sqrt(this.state.allItems.children[1].area / Math.PI)
    for (let i = 0; i < this.state.allItems.children[0].segments.length; i++) {
      this.state.allItems.children[0].segments[i].point =
        this.radialDisplacementFormula(this.state.allItems.children[0].segments[i].point, this.state.allItems.children[1].position, radius);
      //Toy example: checking to see whether anchor point can be altered
      this.setState({ testDisplacement: false });
    }
  }

  radialDisplacementFormula(point, center, radius) {
    console.log(point + " " + center + " " + radius);
    var pointPrimeX = center.x + ((point.x - center.x) * Math.sqrt(1 + (radius * radius / Math.pow(Math.abs(point.x - center.x), 2))));
    var pointPrimeY = center.y + ((point.y - center.y) * Math.sqrt(1 + (radius * radius / Math.pow(Math.abs(point.y - center.y), 2))));
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
