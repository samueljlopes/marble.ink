import React from 'react';
import paper, { Path, Point } from 'paper'
import { Button, Popover, InputNumber, Collapse, Switch, Typography } from "antd";
import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)

const { Text } = Typography;
const { Panel } = Collapse;

class InkCircularTineLines extends React.Component {
    state = {
        currentLine: Path,
        currentCircle: Path.Circle,
        //Line options
        alpha: 0, 
        lambda: 0,
        //Arc Options
        changeDirection: false,
    }

    constructor(props) {
        super(props);
        this.state.alpha = this.props.alpha;
        this.state.lambda = this.props.lambda;
    }

    componentDidMount() {
        this.state.currentLine = new Path();
        this.state.currentCircle = new Path.Circle();
        //this.state.currentLine.visible = false;
        this.frameUpdateInterval = setInterval(() => this.frameUpdate(), 10);
    }

    frameUpdate() {
        this.state.currentLine.visible = false;
        this.state.currentCircle.isTool = true;

        paper.view.onMouseDown = (event) => {
            this.state.currentLine = new Path();
            this.state.currentLine.add(event.point);
            this.setState({ currentLine: this.state.currentLine });
        }
        
        paper.view.onMouseDrag = (event) => {
            let L = new Point(event.point).subtract(new Point(this.state.currentLine.firstSegment.point));
            this.state.currentCircle.remove();
            this.state.currentCircle = new Path.Circle( 
            {
                center : this.state.currentLine.firstSegment.point, 
                radius : L.length, 
                strokeColor: '#40a9ff',
                strokeWidth: 5,
                strokeCap: 'round',
                dashArray: [4, 10],
            });
        }

        paper.view.onMouseUp = (event) => {
            this.state.currentLine.add(event.point);

            this.setState({ currentLine: this.state.currentLine });
            let L = new Point(this.state.currentLine.lastSegment.point).subtract(new Point(this.state.currentLine.firstSegment.point));  
            this.state.currentCircle.radius = L.length
        }

        if (this.state.changeDirection)
        {
            this.state.currentCircle.style.dashOffset += 1;
        }
        else
        {
            this.state.currentCircle.style.dashOffset -= 1;
        }
    }

    circularTineLineDisplacement() {
        for (let i = 0; i < this.props.allItems.children.length; i++) {
            var blot = this.props.allItems.children[i];
            var newBlot = [];
            for (let j = 0; j < blot.segments.length; j++) {
                let oldPoint = blot.segments[j].point;
                let newPoint =
                    this.circularTineLineDisplacementFormula(oldPoint);
                
                let newSegment = new paper.Segment();
                newSegment.point = newPoint;
                newBlot.push(newSegment);
            }
            let newPath = new Path(newBlot); //Assigning points manually doesn't seem to work, so I'll copy style and replace object
            newPath.style = blot.style;

            this.props.animate(this.props.allItems.children[i], newPath);
        }
    }

    circularTineLineDisplacementFormula(oldPoint) 
    {
        //P' = C + (P - C)(cos(theta) sin(theta)
        //                 -sin(theta) cos(theta))
        //theta = l/(|P - C|)
        //l = (alpha * lambda)/(d + lambda)
        //d = ||P - C| - r|
        let PminusC = oldPoint.subtract(this.state.currentLine.firstSegment.point)
        let d = Math.abs(PminusC.length - this.state.currentCircle.radius)

        let l = (this.state.alpha * this.state.lambda)/(d + this.props.lambda)
        let theta = l/(PminusC.length);
        if (this.state.changeDirection)
        {
            theta = -theta
        }

        let circularMatrix = new math.matrix([[Math.cos(theta), Math.sin(theta)], [-Math.sin(theta), Math.cos(theta)]]);
        let PminusCMatrix = new math.matrix([PminusC.x, PminusC.y]);
        let partialNewPointMatrix = math.multiply(PminusCMatrix, circularMatrix); 
        let partialNewPoint = new Point(partialNewPointMatrix.subset(math.index(0)), partialNewPointMatrix.subset(math.index(1)));
        
        let newPoint = this.state.currentLine.firstSegment.point.add(partialNewPoint)
        return newPoint;
    }

    onLineOptionsChange(param, value) 
    {
        //amplitude = Parameter 0
        //phase = Parameter 1
        switch (param) {
            case 0:
                this.setState({ alpha: value });
                break;
            case 1:
                this.setState({ lambda: value });
                break;
          }
    }

    render() {
        let confirmButton;
        if (this.state.currentLine.visible == false) {
            confirmButton = <Button type="primary" onClick={() => this.circularTineLineDisplacement()}
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
            <Panel header="Arc Options">
                <Switch checkedChildren="Reverse Polarity" unCheckedChildren="Un-Reverse Polarity" 
                onClick={() => {this.setState({changeDirection : !this.state.changeDirection})}} /><br /><br />
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
        this.state.currentCircle.remove();
        paper.view.off('mousedown'); //Removes mouse listeners whilst preserving view and project.
        paper.view.off('mouseup');
        paper.view.off('mousedrag');
    }
}
export default InkCircularTineLines