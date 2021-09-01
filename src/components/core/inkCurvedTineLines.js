import React from 'react';
import paper, { Path, Point } from 'paper';
import { Button, Popover, InputNumber, Collapse, Typography } from "antd";

const { Text } = Typography;
const { Panel } = Collapse;

class InkCurvedTineLines extends React.Component { 
    state = {
        currentLine: Path,
        virtualCurvedPath : Path,
        //Curved line parameters
        amplitude: 50, 
        phase: 0, 
        wavelength: 0.1, 
    }

    componentDidMount() {
        this.state.currentLine = new Path();
        this.state.virtualCurvedPath = new Path();
        this.frameUpdateInterval = setInterval(() => this.frameUpdate(), 10);
    }

    frameUpdate() {
        this.state.currentLine.visible = false;

        paper.view.onMouseDown = (event) => {
            this.state.virtualCurvedPath.isTool = false;
            this.state.virtualCurvedPath.remove();

            this.state.currentLine = new Path(
                {
                    strokeColor: '#40a9ff',
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
            
            let newVirtualCurvedPath = this.drawVirtualCurvedPath(this.state.currentLine);
            newVirtualCurvedPath.isTool = true;
            this.setState({ virtualCurvedPath: newVirtualCurvedPath});
        }
        
        //Adds a little animation to the dashes
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
            //newPath.join(null, 10);
            newPath.style = blot.style;

            this.props.animate(this.props.allItems.children[i], newPath)
        }
    }

    drawVirtualCurvedPath(straightLine, remove = true) 
    {
        let complexity = 100; //Needed to display the sine curve.
        if (remove)
        {
            this.state.virtualCurvedPath.remove();
        }

        let virtualCurvedPath = new Path();
        for (let i = 0; i < complexity; i++) {
            var offset = i / complexity * straightLine.length;
            var point = straightLine.getPointAt(offset);
            var normal = straightLine.getNormalAt(offset);
            normal = normal.multiply(this.displacementFormula(offset));
            virtualCurvedPath.add(point.add(normal));
        }
        virtualCurvedPath.style = straightLine.style;
        return virtualCurvedPath;
    }

    onOptionsChange(param, value) 
    {
        //amplitude = Parameter 0
        //phase = Parameter 1
        //wavelength = Parameter 2
        switch (param) {
            case 0:
                this.setState({ amplitude: value });
                break;
            case 1:
                this.setState({ phase: value });
                break;
            case 2:
                this.setState({ wavelength: value });
                break;
          }
        let newVirtualCurvedPath = this.drawVirtualCurvedPath(this.state.currentLine, true);
        this.setState({ virtualCurvedPath: newVirtualCurvedPath});
    }

    render() {
        let confirmButton;
        if (this.state.virtualCurvedPath.visible == true) {
            confirmButton = <Button type="primary" onClick={() => this.curvedTineLineDisplacement()}
            >Confirm Line</Button>
        }
        else {
            confirmButton = <div></div>
        }
        
        let optionsDrawerContent = <div>
        <Collapse defaultActiveKey={['0']} ghost>
            <Panel header="Curved Line Options">
                <Text>Amplitude:</Text>
                    <InputNumber min={20} max={200} step={5} defaultValue={this.state.amplitude} onChange={this.onOptionsChange.bind(this, 0)}/>
                <br></br>
                <Text>Phase:</Text><br></br>
                    <InputNumber min={0} max={100} defaultValue={this.state.phase} onChange={this.onOptionsChange.bind(this, 1)}/>
                <br></br>
                <Text>Wavelength:</Text>
                    <InputNumber min={0.01} max={1} step={0.01} defaultValue={this.state.wavelength} onChange={this.onOptionsChange.bind(this, 2)}/>
            </Panel>
        </Collapse>
        </div>;
        let optionsDrawer = <Popover title="Options" trigger="click" content={optionsDrawerContent}><Button>Options</Button></Popover>

        return (
           <div className="confirmButton">
                {optionsDrawer}
                <br></br><br></br>
                <div>
                    {confirmButton}
                </div>
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
        this.state.virtualCurvedPath.remove();
    }
}
export default InkCurvedTineLines;