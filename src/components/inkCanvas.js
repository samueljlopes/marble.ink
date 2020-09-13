import paper, { Point, Path} from 'paper';
import React from 'react';

class InkCanvas extends React.Component {
  //State is effectively a property outside the data flow, not an argument passed in
  constructor(props) {
    super(props);
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
    Path.prototype.hasBeenTined = false;
  }

  setupCanvas() {
    paper.setup('canvas');
  }

  render() //recalled every time setState is called elsewhere in the code
  {
    return (
      <div>
        <canvas id="canvas" width={window.innerWidth} height={window.innerHeight}></canvas>
      </div>
    ); //canvas is returned to the main program
  }
}

export default InkCanvas
