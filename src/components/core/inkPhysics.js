import paper, { Point, Path } from 'paper'
import React from 'react';
import './styles/inkPhysics.css'
import { CompactPicker } from 'react-color';

class InkPhysics extends React.Component {

    state = {
        allTransformations: [],
        isMouseDown: false,
        inkBlotColour: '#000000'
    }

    componentDidMount() {
        this.frameUpdateInterval = setInterval(() =>
            this.frameUpdate(), 10);
    }

    handleChangeComplete = (color) => {
        this.setState({ inkBlotColour: color.hex });
    };

    render() {
        return (
            <div className="colorPicker">
                <CompactPicker onChangeComplete={this.handleChangeComplete}></CompactPicker>
            </div>
        );
    }

    frameUpdate() {
        if (this.props.allItems.children != undefined) {
            paper.view.onMouseDown = (event) => {
                let circle = new Path.Circle({ center: event.point, radius: 10, fillColor: this.state.inkBlotColour })
                circle.flatten(0.0001); //This is a bit of a cheat. The number of anchor points on the circle primitive is 4, so the flatten command establishes more anchor points.

                this.setState({ isMouseDown: true });
                this.props.addItemToAllItems(circle);

                this.blotPhysicsInterval = setInterval(() => this.blotPhysics(), 10);
            }

            paper.view.onMouseUp = (event) => {
                this.setState({ isMouseDown: false });
                clearInterval(this.blotPhysicsInterval);
                if (this.state.allTransformations.length > 0) {
                    for (let i = 0; i < this.state.allTransformations.length; i++)
                    {
                        this.props.allItems.children[i] = this.state.allTransformations[i];
                        this.state.allTransformations[i].remove();
                    }
                    
                    //Super hacky, but makes program not re-alter transformations (otherwise it was treating them
                    //as very misshapen circular ink blots!)
                    for (let i = 0; i < this.props.allItems.children.length; i++) {
                        this.props.allItems.children[i].hasBeenTined = true;
                    }
                }
                this.state.allTransformations = [];
                this.props.addToHistory();
            }

            if (this.state.isMouseDown && this.props.allItems.children.length > 0) {
                let length = this.props.allItems.children.length;
                let currentBlot = this.props.allItems.children[length - 1];
                currentBlot.scale(0.01 + this.props.expansionRate);
                this.props.allItems.children[length - 1] = currentBlot;
            }
        }
    }

    blotPhysics() {
        //Ink blot physics. Shall be commented for posterity
        if (this.state.isMouseDown && this.props.allItems.children != undefined) { //Only sims when mouse is down
            if (this.state.allTransformations.length > 0) {
                this.state.allTransformations.forEach(function (entry) {
                    entry.remove(); //Remove previous frame's transformations
                });
            }
            this.state.allTransformations = []; //Clearing array

            if (this.props.allItems.children.length > 1) { //Checks if there are two or more blots
                for (let i = 1; i < this.props.allItems.children.length; i++) { //Goes forward throught the blots, first to last
                    let center = this.props.allItems.children[i].position; //Gets center
                    let radius = Math.sqrt(this.props.allItems.children[i].area / Math.PI); //Area is conserved so radius will always be the same
                    for (let j = i - 1; j >= 0; j--) { //Goes backwards through the array - the last blot impacts all prevous blots
                        if (this.props.allItems.children[j].hasBeenTined == false || this.props.allItems.children[i].hasBeenTined == false) {
                            var transformation;
                            if (this.state.allTransformations[j] == undefined) { //Checks for an existing transformation. If not, applies formula to circle
                                transformation = this.radialDisplacement(this.props.allItems.children[j], center, radius);
                            } else {
                                transformation = this.radialDisplacement(this.state.allTransformations[j], center, radius); //Uses existing transformation
                                this.state.allTransformations[j].remove(); //Removes previous from canvas
                            }
                            transformation.fillColor = this.props.allItems.children[j].fillColor;
                            this.state.allTransformations[j] = (transformation); //Places all blots' transformation into a array
                        }
                    }
                }
                for (let i = 0; i < this.props.allItems.children.length; i++) {
                    if (this.state.allTransformations[i] != undefined) { //Checks whether to render the circle or the transformation
                        this.props.allItems.children[i].visible = false;
                    }
                }
            }
        }
    }

    radialDisplacement(blot, center, radius) {
        var newBlot = []
        for (let i = 0; i < blot.segments.length; i++) {
            var segment = new paper.Segment()
            segment.point =
                this.radialDisplacementFormula(blot.segments[i].point, center, radius);
            newBlot.push(segment);
        }
        return new Path(newBlot);
    }

    radialDisplacementFormula(point, center, radius) {
        let magnitude = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
        var pointPrimeX = center.x + ((point.x - center.x) * Math.sqrt(1 + (Math.pow(radius, 2) / Math.pow(magnitude, 2))));
        var pointPrimeY = center.y + ((point.y - center.y) * Math.sqrt(1 + (Math.pow(radius, 2) / Math.pow(magnitude, 2))));
        return (new Point(pointPrimeX, pointPrimeY));
    }

    componentWillUnmount() {
        clearInterval(this.frameUpdateInterval);
        clearInterval(this.blotPhysicsInterval);
        paper.view.off('mousedown');
        paper.view.off('mouseup');
        if (this.state.allTransformations.length > 0) {
            for (let i = 0; i < this.state.allTransformations.length; i++) {
                this.props.allItems.children[i] = this.state.allTransformations[i];
                this.state.allTransformations[i].remove();
            }
        }
    }
}
export default InkPhysics