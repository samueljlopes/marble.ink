
class RadialDisplacement {
    main() {
        let allInkBlot = this.state.allItems;
        for (var i = 0; i < allInkBlot.children.length; i++) {
            for (var j = 0; j < allInkBlot.children.length; j++) {
                if (i != j) {
                    this.showIntersections(allInkBlot.children[i], allInkBlot.children[j]);
                }
            }
        }
    }

    radialDisplacementFormula(point, center, radius) {
        var pointPrime = center +
            ((point - center) *
                math.sqrt(1 + (math.pow(radius, 2) / math.abs(math.pow(point - center, 2)))));
        return (pointPrime);
    }
}