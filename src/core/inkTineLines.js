import React, { Component } from 'react';
import paper, { Path, Point } from 'paper'
import { Button } from "antd";
import './inkTineLines.css'

class InkTineLines extends React.Component {
    state = { currentLine: Path }
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.state.currentLine = new Path();
        this.frameUpdateInterval = setInterval(() => this.frameUpdate(), 10);
    }

    frameUpdate() {
        paper.view.onMouseDown = (event) => {
            this.state.currentLine.visible = false;
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
        }
        this.state.currentLine.style.dashOffset -= 1; //Adds a little animation to the dashes
    }

    tineLineDisplacement(blot) { //Recycled from the inkPhysics module
        var newBlot = []
        for (let i = 0; i < blot.segments.length; i++) {
            var segment = new paper.Segment()
            segment.point =
                this.tineLineDisplacementFormula(blot.segments[i].point);
            newBlot.push(segment);
        }
        return new Path(newBlot);
    }

    tineLineDisplacementFormula(point) { 
        //Required values: L(tine line), N(unit vector perpendicular to L), A(point on L), M(L unit vector)
        // P′= P + (((αλ)/(d+λ)) * M), where d = (P−A)⋅ N and α,λ control the maximum shift and sharpness of the shift gradient
        return (new Point(pointPrimeX, pointPrimeY));
    }

    render() {
        let confirmButton;
        if (this.state.currentLine.visible == true) {
            console.log("Showing button")
            confirmButton = <Button type="primary" onClick={() => this.tineLineFormula()}
            >Confirm Line</Button>
        }
        else {
            console.log("Hiding button")
            confirmButton = <div></div>
        }

        return (
            <div className="confirmButton">
                {confirmButton}
            </div>
        );
    }

    componentWillUnmount() {
        clearInterval(this.frameUpdateInterval);
        this.state.currentLine.visible = false;
        paper.view.off('mousedown'); //Removes mouse listeners whilst preserving view and project.
        paper.view.off('mouseup');
    }
}
export default InkTineLines