import React, { Component } from 'react';
import paper, { Path, Point } from 'paper';
import { Button, Popover, Switch, InputNumber } from "antd";
import { Typography, Space } from 'antd';
import InkTineLines from './inkTineLines.js'

const { Text } = Typography;
class InkCurvedTineLines extends InkTineLines { //I did think about writing an entirely new method, but:
    //According to the paper, its just a displacement function after an initial straight line pass.
    //So, it is much easier to simply inherit the class and call those methods.
    //However, this is not considered best practise. I cannot find a reasonable explanation why not other than 'we don't think you need to'.
    //This is a problem which inheritance is best placed to solve, however.
    state = {
        currentLine: Path,
        virtualCurvedPath : Path,
        amplitude: 50,
        wavelength: 0.1,
        phase: 0,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("curved tine line mounted")
        this.state.currentLine = new Path();
        this.state.virtualCurvedPath = new Path();
        this.frameUpdateInterval = setInterval(() => this.frameUpdate(), 10);
    }

    frameUpdate() {
        paper.view.onMouseDown = (event) => {
            this.state.currentLine.visible = false;
            this.state.virtualCurvedPath.visible = false;
            this.state.currentLine = new Path(
                {
                    strokeColor: new paper.Color(0, 0, 1),
                    strokeWidth: 5,
                    strokeCap: 'round',
                    dashArray: [4, 10],
                });
            this.state.currentLine.add(event.point);
            this.setState({ currentLine: this.state.currentLine });
        }

        paper.view.onMouseUp = (event) => {
            this.state.currentLine.add(event.point);
            this.setState({ currentLine: this.state.currentLine });

            let complexity = 100; //Needed to display the sine curve.
            this.state.virtualCurvedPath = new Path();
            for (let i = 0; i < complexity; i++) {
                var offset = i / complexity * this.state.currentLine.length;
                var point = this.state.currentLine.getPointAt(offset);
                var normal = this.state.currentLine.getNormalAt(offset);
                normal = normal.multiply(this.displacementFormula(offset));
                this.state.virtualCurvedPath.add(point.add(normal));
            }
            this.state.virtualCurvedPath.style = this.state.currentLine.style;
        }
        this.state.currentLine.style.dashOffset -= 1; //Adds a little animation to the dashes
        this.state.virtualCurvedPath.style.dashOffset -= 1;
    }

    displacementFormula(v) {
        return this.state.amplitude * Math.sin((this.state.wavelength * v) + this.state.phase);
    }

    curvedTineLineDisplacement() 
    {
        var normal = this.state.currentLine.getNormalAt(0);
        let t = Math.atan(normal.y / normal.x);

        for (let i = 0; i < this.props.allItems.children.length; i++) {
            this.props.allItems.children[i].visible = false;
        } 

        for (let i = 0; i < this.props.allItems.children.length; i++) {
            var blot = this.props.allItems.children[i];
            var newBlot = [];
            for (let j = 0; j < blot.segments.length; j++) {
                let oldPoint = blot.segments[j].point;
                let sineCoefficient = this.displacementFormula(oldPoint.dot(new Point(Math.sin(t), -Math.cos(t))));
                let newPoint = oldPoint.add(new Point(Math.cos(t), Math.sin(t)).multiply(sineCoefficient));

                let newSegment = new paper.Segment();
                newSegment.point = newPoint;
                newBlot.push(newSegment);
            }
            let newPath = new Path(newBlot); //Assigning points manually doesn't seem to work, so I'll copy style and replace object
            newPath.join(null, 10);
            newPath.style = blot.style;
            this.props.allItems.children[i] = newPath;
        }
    }

    onConfirm() 
    {
        //this.tineLineDisplacement();
        this.curvedTineLineDisplacement();
    }

    render() {
        let confirmButton;
        if (this.state.currentLine.visible == true) {
            confirmButton = <Button type="primary" onClick={() => this.onConfirm()}
            >Confirm Line</Button>
        }
        else {
            confirmButton = <div></div>
        }
        
        return (
           <div class="confirmButton">
               {confirmButton}
           </div>
        );
    }

    componentWillUnmount() {
        clearInterval(this.frameUpdateInterval);
        this.state.currentLine.visible = false;
        paper.view.off('mousedown'); //Removes mouse listeners whilst preserving view and project.
        paper.view.off('mouseup');
        for (let i = 0; i < this.props.allItems.children.length; i++) {
            this.props.allItems.children[i].hasBeenTined = true;
        }
        this.state.virtualCurvedPath.visible = false;
    }
}
export default InkCurvedTineLines;