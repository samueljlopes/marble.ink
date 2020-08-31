import paper, { Point, Path, Circle, Group, Segment } from 'paper'
import React from 'react';

class InkUI extends React.Component {

    state = { allTransformations: [] }
    componentDidMount() {
        setInterval(() => this.blotPhysics(this.props.allItems, this.props.isMouseDown), 10);
    }

    render() {
        return (
            {/* <button className="InkUI" onClick={() => this.blotPhysics(this.props.allItems, true)}>
                {"Run Physics Simulation"}
            </button> */}
        );
    }

    blotPhysics(allItems, isMouseDown) {
        //Ink blot physics. Shall be commented for posterity
        if (isMouseDown) { //Only sims when mouse is down
            if (this.state.allTransformations.length > 0) {
                this.state.allTransformations.forEach(function (entry) {
                    entry.remove(); //Remove previous frame's transformations
                });
            }
            this.state.allTransformations = []; //Clearing array

            if (allItems.children.length > 1) { //Checks if there are two or more blots
                for (let i = 1; i < allItems.children.length; i++) { //Goes forward throught the blots, first to last
                    let center = allItems.children[i].position; //Gets center
                    let radius = Math.sqrt(allItems.children[i].area / Math.PI); //Area is conserved so radius will always be the same
                    for (let j = i - 1; j >= 0; j--) { //Goes backwards through the array - the last blot impacts all prevous blots
                        var transformation; 
                        if (this.state.allTransformations[j] == undefined) { //Checks for an existing transformation. If not, applies formula to circle
                            transformation = this.radialDisplacement(allItems.children[j], center, radius);
                        } else {
                            transformation = this.radialDisplacement(this.state.allTransformations[j], center, radius); //Uses existing transformation
                            this.state.allTransformations[j].remove(); //Removes previous from canvas
                        }
                        transformation.fillColor = 'black';
                        this.state.allTransformations[j] = (transformation); //Places all blots' transformation into a array
                    }
                }
                for (let i = 0; i < allItems.children.length; i++) {
                    if (this.state.allTransformations[i] != undefined) { //Checks whether to render the circle or the transformation
                        allItems.children[i].visible = false;
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
}
export default InkUI