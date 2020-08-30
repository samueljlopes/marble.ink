import paper,{ Point, Path, Circle, Group, Segment } from 'paper'
import React from 'react';

class InkUI extends React.Component {
    render() {
        return (
            <button className="InkUI" onClick={() => this.blotPhysics(this.props.allItems)}>
                {"Run Physics Simulation"}
            </button>
        );
    }

    blotPhysics(allItems) {
        //Ink blot physics
        console.log(allItems)
        if (allItems.children.length > 1) {
            var allInkBlots = allItems.children;
            var allTransformations = [];

            for (let i = 1; i < allInkBlots.length; i++) {
                let center = allInkBlots[i].position;
                let radius = Math.sqrt(allInkBlots[i].area / Math.PI);
                for (let j = i - 1; j >= 0; j--) {
                    console.log("blot " + i + " acting on blot " + j);
                    var transformation;
                    if (allTransformations[j] == undefined) {
                        transformation = this.radialDisplacement(allInkBlots[j], center, radius);
                    } else {
                        console.log("using previous transformations")
                        transformation = this.radialDisplacement(allTransformations[j], center, radius)
                    }
                    transformation.selected = true;
                    allTransformations[j] = (transformation);
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