import React from 'react';
import paper, { Path, Point } from 'paper'
import { Button, Popover, Switch, InputNumber, Collapse } from "antd";
import { Typography, Space } from 'antd';
import './styles/inkTineLines.css'

const { Text } = Typography;
const { Panel } = Collapse;

class InkTineLines extends React.Component {
    state = {
        currentLine: Path,
        //Line options
        alpha: 0, 
        lambda: 0,
        //Spacing options
        disableSpacing: true,
        spacingValue: 80,
        virtualSpacingLines: []
    }

    constructor(props) {
        super(props);
        this.state.alpha = this.props.alpha;
        this.state.lambda = this.props.lambda;
    }

    componentDidMount() {
        this.state.currentLine = new Path();
        this.frameUpdateInterval = setInterval(() => this.frameUpdate(), 10);
    }

    frameUpdate() {
        this.state.currentLine.isTool = true;
        paper.view.onMouseDown = (event) => {
            this.state.currentLine.remove();
            this.state.currentLine = new Path(
                {
                    strokeColor: '#40a9ff',
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
            var blot = this.props.allItems.children[i].segments;
            var newBlot = [];
            for (let j = 0; j < blot.length; j++) {
                let oldPoint = blot[j].point;
                let newPoint =
                    this.tineLineDisplacementFormula(oldPoint,
                        this.state.alpha, this.state.lambda, this.state.currentLine);

                if (this.state.disableSpacing == false)
                {
                    for (let v = 0; v < this.state.virtualSpacingLines.length; v++)
                    {
                        //console.log("Running virtual line sim")
                        newPoint = this.tineLineDisplacementFormula(newPoint,
                            this.state.alpha, this.state.lambda, this.state.virtualSpacingLines[v]);
                    }
                }

                let newSegment = new paper.Segment();
                newSegment.point = newPoint;
                newBlot.push(newSegment);
            }

            let newPath = new Path(newBlot); //Assigning points manually doesn't seem to work, so I'll copy style and replace object
            newPath.style = blot.style;
            this.props.animate(this.props.allItems.children[i], newPath);
        }
    }

    tineLineDisplacementFormula(point, alpha, lambda, line) {
        //Required values: L(tine line), N(unit vector perpendicular to L), A(point on L), M(L unit vector)
        // P′= P + (((αλ)/(d+λ)) * M), where d = (P−A)⋅ N and α,λ control the maximum shift and sharpness of the shift gradient

        //Getting vector from the path
        let L = new Point(line.lastSegment.point).subtract(new Point(line.firstSegment.point));
        //Defining N
        let L2 = line.lastSegment.point.subtract(point);
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
        let A = line.firstSegment.point;
        //Defining D
        let d = (new Point(point).subtract(A)).dot(N);
    /*    
        if (this.state.disableSpacing == false) {
            let smallestDistance = d;
            //This loop checks the virtual point to get the minimum distance from arbitrary lines
            for (let i = 0; i < this.state.virtualSpacingLines.length; i++) { //This uses the same logic as before
                //Getting vector from the virtual path
                let vL = new Point(this.state.virtualSpacingLines[i].lastSegment.point).subtract(new Point(this.state.virtualSpacingLines[i].firstSegment.point));
                let vL2 = this.state.virtualSpacingLines[i].lastSegment.point.subtract(point);

                let vcrossProduct = ((vL.x * vL2.y) - (vL.y * vL2.x));
                let vN = vL;
                if (vcrossProduct >= -1) { //N needs to point in the approximate direction of the circle point
                    vN = vN.rotate(-90);
                } else {
                    vN = vN.rotate(90);
                }
                let vA = this.state.virtualSpacingLines[i].firstSegment.point;
                let candidateD = Math.abs((new Point(point).subtract(vA)).dot(vN));
                if (candidateD < smallestDistance) {
                    smallestDistance = candidateD;
                }
            }

            let s = this.state.spacingValue;
            d = s / 2 - Math.abs((smallestDistance % s) - s / 2);
        } 
    */
        let pointPrimeX = point.x + (((alpha * lambda) / (d + lambda)) * M.x);
        let pointPrimeY = point.y + (((alpha * lambda) / (d + lambda)) * M.y);
        return (new Point(pointPrimeX, pointPrimeY));
    }

    drawSpacedLines() {
        for (let i = 0; i < this.state.virtualSpacingLines.length; i++) {
            this.state.virtualSpacingLines[i].remove();
        }
        this.state.virtualSpacingLines = [];

        let L = new Point(this.state.currentLine.lastSegment.point).subtract(new Point(this.state.currentLine.firstSegment.point));
        let clockwiseL = new Point(L.y, -L.x).normalize().multiply(this.state.spacingValue);
        let counterClockwiseL = new Point(-L.y, L.x).normalize().multiply(this.state.spacingValue);

        let firstNewSegment, lastNewSegment, newPath;
        for (let i = 1; i < (Math.max(window.innerWidth, window.innerHeight) / this.state.spacingValue); i++) {
            firstNewSegment = this.state.currentLine.firstSegment.point.add(clockwiseL.multiply(i));
            lastNewSegment = this.state.currentLine.lastSegment.point.add(clockwiseL.multiply(i));
           
            newPath = new Path()
            newPath.isTool = true;
            newPath.add(firstNewSegment);
            newPath.add(lastNewSegment);
            newPath.style = this.state.currentLine.style;
            this.state.virtualSpacingLines.push(newPath);

            firstNewSegment = this.state.currentLine.firstSegment.point.add(counterClockwiseL.multiply(i));
            lastNewSegment = this.state.currentLine.lastSegment.point.add(counterClockwiseL.multiply(i));
            
            newPath = new Path();
            newPath.isTool = true;
            newPath.add(firstNewSegment);
            newPath.add(lastNewSegment);
            newPath.style = this.state.currentLine.style;
            this.state.virtualSpacingLines.push(newPath);
        }
        
    }

    onLineOptionsChange(param, value) 
    {
        //alpha = Parameter 0
        //lambda = Parameter 1
        switch (param) {
            case 0:
                this.setState({ alpha: value });
                break;
            case 1:
                this.setState({ lambda: value });
                break;
          }
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
        if (this.state.disableSpacing == true && this.state.currentLine.segments.length != 0)
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
         <Collapse defaultActiveKey={['0']} ghost>
            <Panel header="Line Options">
                <Text>Alpha:</Text>
                    <InputNumber min={50} max={200} step={5} defaultValue={this.state.amplitude} onChange={this.onLineOptionsChange.bind(this, 0)}/>
                <br></br>
                <Text>Lambda:</Text><br></br>
                    <InputNumber min={1} max={50} defaultValue={this.state.phase} onChange={this.onLineOptionsChange.bind(this, 1)}/>
                <br></br>
            </Panel>
            <Panel header="Spacing Options">
                <Switch checkedChildren="Spaced" unCheckedChildren="Not Spaced" onClick={() => {this.onAllowingSpacing() }} /><br /><br />
                <Text disabled={this.state.disableSpacing}>Spacing Between Lines:</Text><InputNumber disabled={this.state.disableSpacing} min={50} max={200} defaultValue={this.state.spacingValue} onChange={this.onChangeSpacingValue.bind(this)} onPressEnter={this.onChangeSpacingValue.bind(this)} />
            </Panel>
        </Collapse>
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
        this.state.currentLine.remove();
        paper.view.off('mousedown'); //Removes mouse listeners whilst preserving view and project.
        paper.view.off('mouseup');
        for (let i = 0; i < this.props.allItems.children.length; i++) {
            this.props.allItems.children[i].hasBeenTined = true;
        }
    }
}
export default InkTineLines