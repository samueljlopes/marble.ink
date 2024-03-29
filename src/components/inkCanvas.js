import paper, { Point, Path, Size} from 'paper';
import React from 'react';
import './styles/inkCanvas.css'

class InkCanvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    paper.setup(this.canvas);
    var resizeHandler = function(event) {
      paper.view.viewSize = new Size(window.innerWidth, window.innerHeight);
    };
    resizeHandler();
    paper.view.on('resize', resizeHandler);
    //Parameters added to Path prototype
    Path.prototype.hasBeenTined = false;
    Path.prototype.isTool = false;
  }

 /*  
 findEdges() 
  {
    this.state.canvasEdge.remove();

    let path = new Path();
    path.strokeColor = 'blue';
    path.add(new Point(0, 0),
      new Point(2 * paper.view.center.x, 0),
      new Point(2 * paper.view.center.x, 2 * paper.view.center.y),
      new Point(0, 2 * paper.view.center.y),
      new Point(0, 0));
    this.setState({canvasEdge : path})
  }
 */

  render() 
  {
    return (
      <div id="canvasContainer">
        <canvas id="canvas" ref={ ref => { this.canvas=ref; } } resize="true"></canvas>
      </div>
    ); 
  }
}
export default InkCanvas
