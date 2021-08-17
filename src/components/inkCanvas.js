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
      //console.log("resized function called:" +
      //            window.innerWidth + " " + window.innerHeight)
      paper.view.viewSize = new Size(window.innerWidth, window.innerHeight);
    };
    resizeHandler();
    paper.view.on('resize', resizeHandler);
    Path.prototype.hasBeenTined = false;
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
      <div>
        <canvas id="paperCanvas" ref={ ref => { this.canvas=ref; } } resize="true"></canvas>
      </div>
    ); 
  }
}
export default InkCanvas
