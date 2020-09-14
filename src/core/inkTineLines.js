import React, { Component } from 'react';
import paper, { Path, Point } from 'paper'
import { Button, Popover } from "antd";
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

    tineLineDisplacement() {
        console.log(this.props.allItems);
        for (let i = 0; i < this.props.allItems.children.length; i++) {
            this.props.allItems.children[i].visible = false;
        }

        for (let i = 0; i < this.props.allItems.children.length; i++) {
            var blot = this.props.allItems.children[i];
            var newBlot = [];
            for (let j = 0; j < blot.segments.length; j++) {
                let oldPoint = blot.segments[j].point;
                let newPoint =
                    this.tineLineDisplacementFormula(oldPoint,
                        this.props.alpha, this.props.lambda);
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

    tineLineDisplacementFormula(point, alpha, lambda) {
        //Required values: L(tine line), N(unit vector perpendicular to L), A(point on L), M(L unit vector)
        // P′= P + (((αλ)/(d+λ)) * M), where d = (P−A)⋅ N and α,λ control the maximum shift and sharpness of the shift gradient

        //Getting vector from the path
        let L = new Point(this.state.currentLine.lastSegment.point).subtract(new Point(this.state.currentLine.firstSegment.point));
        //Defining N
        let L2 = this.state.currentLine.lastSegment.point.subtract(point);
        let crossProduct = ((L.x * L2.y) - (L.y * L2.x));
        let N = L;
        if (crossProduct > 0) { //N needs to point in the approximate direction of the circle point
            N = N.rotate(-90);
        } else {
            N = N.rotate(90);
        }
        N = N.normalize();
        //Defining M
        let M = L;
        M = M.normalize();
        //Defining A
        let A = this.state.currentLine.firstSegment.point;
        //Defining D
        let d = (new Point(point).subtract(A)).dot(N);
        let pointPrimeX = point.x + (((alpha * lambda) / (d + lambda)) * M.x);
        let pointPrimeY = point.y + (((alpha * lambda) / (d + lambda)) * M.y);
        return (new Point(pointPrimeX, pointPrimeY));
    }

    render() {
        let confirmButton;
        if (this.state.currentLine.visible == true) {
            console.log("Showing button")
            confirmButton = <Button type="primary" onClick={() => this.tineLineDisplacement()}
            >Confirm Line</Button>
        }
        else {
            confirmButton = <div></div>
        }
        let spacedDrawer = <Popover title="Options" trigger="click"><Button>Options</Button></Popover>

        return (
            <div className="confirmButton">
                {spacedDrawer}
                <br/> <br/>
                {confirmButton}
            </div>
        );
    }

    componentWillUnmount() {
        clearInterval(this.frameUpdateInterval);
        this.state.currentLine.visible = false;
        paper.view.off('mousedown'); //Removes mouse listeners whilst preserving view and project.
        paper.view.off('mouseup');
        for (let i = 0; i < this.props.allItems.children.length; i++)
        {
            this.props.allItems.children[i].hasBeenTined = true;
        }
    }
}
export default InkTineLines