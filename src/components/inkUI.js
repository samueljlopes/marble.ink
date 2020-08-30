import paper, { Point, Path, Circle, Group, Segment } from 'paper'
import React from 'react';

class InkUI extends React.Component {

    state = { allTransformations: [] }
    componentDidMount() {
        setInterval(() => this.blotPhysics(this.props.allItems, this.props.isMouseDown), 10);
    }

    render() {
        return (
            <button className="InkUI" onClick={() => this.blotPhysics(this.props.allItems, true)}>
                {"Run Physics Simulation"}
            </button>
        );
    }

    blotPhysics(allItems, isMouseDown) {
        //Ink blot physics
        if (isMouseDown) {
            if (this.state.allTransformations.length > 0) {
                this.state.allTransformations.forEach(function (entry) {
                    entry.remove();
                });
            }

            if (allItems.children.length > 1) {
                var allInkBlots = allItems.children;
                for (let i = 1; i < allInkBlots.length; i++) {
                    let center = allInkBlots[i].position;
                    let radius = Math.sqrt(Math.sqrt(allInkBlots[i].area / Math.PI));
                    for (let j = i - 1; j >= 0; j--) {
                        var transformation;
                        if (this.state.allTransformations[j] == undefined) {
                            transformation = this.radialDisplacement(allInkBlots[j], center, radius);
                        } else {
                            transformation = this.radialDisplacement(this.state.allTransformations[j], center, radius);
                            this.state.allTransformations[j].remove();
                        }
                        transformation.fillColor = 'black';
                        this.state.allTransformations[j] = (transformation);
                    }
                }
                for (let i = 0; i < allItems.children.length; i++) {
                    if (this.state.allTransformations[i] != undefined) {
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