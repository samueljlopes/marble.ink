import React, { Component } from 'react';
import paper, { Path, Point } from 'paper'
import { Button, Popover, Switch, InputNumber } from "antd";
import { Typography, Space } from 'antd';
import './styles/inkTineLines.css'

const { Text } = Typography;

//TODO: Add tweening: Unclear whether this should be called from a seperate animation component 
class InkTineLines extends React.Component {
    state = {
        currentLine: Path,
        disableSpacing: true,
        spacingValue: 50,
        virtualSpacingLines: []
    }

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

            for (let i = 0; i < this.state.virtualSpacingLines.length; i++) {
                this.state.virtualSpacingLines[i].remove();
            }
            this.state.virtualSpacingLines = [];
        }

        paper.view.onMouseUp = (event) => {
            this.state.currentLine.add(event.point);
            this.setState({ currentLine: this.state.currentLine });
            if (this.state.disableSpacing == false) {
                this.drawSpacedLines();
            }
        }
        this.state.currentLine.style.dashOffset -= 1; //Adds a little animation to the dashes
        for (let i = 0; i < this.state.virtualSpacingLines.length; i++) {
            this.state.virtualSpacingLines[i].style.dashOffset = this.state.currentLine.style.dashOffset
        }
    }

    tineLineDisplacement() {
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
            //newPath.join(null, 10);
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
        if (this.state.disableSpacing == false) {
            let smallestDistance = d;
            //This loop checks the virtual point to get the minimum distance from arbitrary lines
            for (let i = 0; i < this.state.virtualSpacingLines.length; i++) { //This uses the same logic as before
                //Getting vector from the virtual path
                let vL = new Point(this.state.virtualSpacingLines[i].lastSegment.point).subtract(new Point(this.state.virtualSpacingLines[i].firstSegment.point));
                let vL2 = this.state.virtualSpacingLines[i].lastSegment.point.subtract(point);

                let vcrossProduct = ((vL.x * vL2.y) - (vL.y * vL2.x));
                let vN = vL;
                if (vcrossProduct > 0) { //N needs to point in the approximate direction of the circle point
                    vN = vN.rotate(-90);
                } else {
                    vN = vN.rotate(90);
                }
                let vA = this.state.virtualSpacingLines[i].firstSegment.point;
                let candidateD = (new Point(point).subtract(vA)).dot(vN);
                if (candidateD < smallestDistance) {
                    smallestDistance = candidateD;
                }
            }

            let s = this.state.spacingValue;
            d = s / 2 - Math.abs((smallestDistance % s) - s / 2);
        }
        let pointPrimeX = point.x + (((alpha * lambda) / (d + lambda)) * M.x);
        let pointPrimeY = point.y + (((alpha * lambda) / (d + lambda)) * M.y);
        return (new Point(pointPrimeX, pointPrimeY));
    }

    onChangeSpacingValue(value) {
        if (value > 25) //Tends to crash if value is any lower
        {
            this.setState({ spacingValue: value });
        }
        this.drawSpacedLines();
    }

    onAllowingSpacing() 
    {
        this.setState({ disableSpacing: !this.state.disableSpacing}); 
        if (this.state.disableSpacing == true)
        {
            this.drawSpacedLines();
        }
        else
        {
            for (let i = 0; i < this.state.virtualSpacingLines.length; i++) {
                this.state.virtualSpacingLines[i].remove();
            }
        }
    }

    drawSpacedLines() {
        for (let i = 0; i < this.state.virtualSpacingLines.length; i++) {
            this.state.virtualSpacingLines[i].remove();
        }
        this.state.virtualSpacingLines = [];
        let L = new Point(this.state.currentLine.lastSegment.point).subtract(new Point(this.state.currentLine.firstSegment.point));
        let clockwiseL = new Point(L.y, -L.x).normalize().multiply(this.state.spacingValue);
        let counterClockwiseL = new Point(-L.y, L.x).normalize().multiply(this.state.spacingValue);

        for (let i = 0; i < (Math.max(window.innerWidth, window.innerHeight) / this.state.spacingValue); i++) {
            let firstNewSegment, lastNewSegment, newPath;
            if (i == 0) {
                firstNewSegment = this.state.currentLine.firstSegment.point.add(clockwiseL);
                lastNewSegment = this.state.currentLine.lastSegment.point.add(clockwiseL);
            }
            else {
                firstNewSegment = this.state.virtualSpacingLines[this.state.virtualSpacingLines.length - 1].firstSegment.point.add(clockwiseL);
                lastNewSegment = this.state.virtualSpacingLines[this.state.virtualSpacingLines.length - 1].lastSegment.point.add(clockwiseL);
            }
            newPath = new Path(
                {
                    strokeColor: new paper.Color(0, 0, 1),
                    strokeWidth: 5,
                    strokeCap: 'round',
                    dashArray: [4, 10],
                });
            newPath.add(firstNewSegment);
            newPath.add(lastNewSegment);
            this.state.virtualSpacingLines.push(newPath);
        }

        for (let i = 0; i < (Math.max(window.innerWidth, window.innerHeight) / this.state.spacingValue); i++) {
            let firstNewSegment, lastNewSegment, newPath;
            if (i == 0) {
                firstNewSegment = this.state.currentLine.firstSegment.point.add(counterClockwiseL);
                lastNewSegment = this.state.currentLine.lastSegment.point.add(counterClockwiseL);
            }
            else {
                firstNewSegment = this.state.virtualSpacingLines[this.state.virtualSpacingLines.length - 1].firstSegment.point.add(counterClockwiseL);
                lastNewSegment = this.state.virtualSpacingLines[this.state.virtualSpacingLines.length - 1].lastSegment.point.add(counterClockwiseL);
            }
            newPath = new Path(
                {
                    strokeColor: new paper.Color(0, 0, 1),
                    strokeWidth: 5,
                    strokeCap: 'round',
                    dashArray: [4, 10],
                });
            newPath.add(firstNewSegment);
            newPath.add(lastNewSegment);
            this.state.virtualSpacingLines.push(newPath);
        }
        console.log("Simulation run. Length of sim array:" + this.state.virtualSpacingLines.length);
    }

    render() {
        let confirmButton;
        if (this.state.currentLine.visible == true) {
            confirmButton = <Button type="primary" onClick={() => this.tineLineDisplacement()}
            >Confirm Line</Button>
        }
        else {
            confirmButton = <div></div>
        }

        let spacedDrawerContent = <div>
            <Switch checkedChildren="Spaced" unCheckedChildren="Not Spaced" onClick={() => {this.onAllowingSpacing() }} /><br /><br />
            <Text disabled={this.state.disableSpacing}>Spacing Between Lines:</Text><InputNumber disabled={this.state.disableSpacing} min={50} max={200} defaultValue={50} onChange={this.onChangeSpacingValue.bind(this)} onPressEnter={this.onChangeSpacingValue.bind(this)} />
        </div>;
        let spacedDrawer = <Popover title="Options" trigger="click" content={spacedDrawerContent}><Button>Options</Button></Popover>

        return (
            <div className="confirmButton">
                {spacedDrawer}
                <br></br><br></br>
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
    }
}
export default InkTineLines