import React, { Component } from 'react';
import paper, {Path} from 'paper'
class InkTineLines extends React.Component 
{
    state = {currentLine: Path}
    constructor(props) {
        super(props);
    }

    componentDidMount() 
    {
        this.state.currentLine = new Path();
        this.frameUpdateInterval = setInterval(() => this.frameUpdate(), 10);
    }

    frameUpdate() 
    { 
        paper.view.onMouseDown = (event) => {
            this.state.currentLine.visible = false;
            this.state.currentLine = new Path(
                {
                    strokeColor: new paper.Color(0, 0, 1),
                    strokeWidth:  5,
                    strokeCap : 'round',
                    dashArray : [4,10],
                });
            this.state.currentLine.add(event.point); 
        }

        paper.view.onMouseUp = (event) => {
            this.state.currentLine.add(event.point);
        }
        this.state.currentLine.style.dashOffset -= 1; //Adds a little animation to the dashes
    }

    render() 
    {
        return (
        <div></div>            
        );
    }

    componentWillUnmount() 
    {
        clearInterval(this.frameUpdateInterval);
        this.state.currentLine.visible = false;
        paper.view.off('mousedown'); //Removes mouse listeners whilst preserving view and project.
        paper.view.off('mouseup');
    }
}
export default InkTineLines