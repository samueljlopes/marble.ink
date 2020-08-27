import paper, {Point, Path, Circle} from 'paper';
import React from 'react';

class InkCanvas extends React.Component
{
  state = {isMouseDown : false}
  //State is effectively a property outside the data flow, not an argument passed in
  constructor (props)
  {
    super(props);
    this.expansionRate = props.expansionRate;
  }

  componentDidMount() 
  {
    var canvas = document.getElementById('canvas'); //canvas is found in document
		paper.setup(canvas);
    let path = new Path();
    path.strokeColor = 'black';
    path.add(new Point(0,0), 
            new Point(2 * paper.view.center.x, 0), 
            new Point(2 * paper.view.center.x, 2 * paper.view.center.y), 
            new Point(0, 2 * paper.view.center.y), 
            new Point(0,0));
    
    setInterval(() => this.frameUpdate(), 1);
  }

  frameUpdate() 
  {
    paper.view.onMouseDown = (event) => {
      this.state.isMouseDown = true;
    }

    paper.view.onMouseUp = (event) => {
      this.state.isMouseDown = false;
    }
    console.log(this.state.isMouseDown);
  }

  render() 
  {
    return(
      <div>
        <canvas id = "canvas"></canvas> 
      </div>
    ); //canvas is returned to the main program
  }
}

export default InkCanvas
