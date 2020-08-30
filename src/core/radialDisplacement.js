
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
            (point - center).dot(math.sqrt(1 + (math.pow(radius, 2) / math.abs(math.pow(point - center, 2)))));
        return (pointPrime);
    }

    getInnerPoints(givenObject) { //Only works if fillcolor is black
        var raster = givenObject.rasterize();
        raster.visible = false;
        var quantiseFactor = 25;
    
        raster.onLoad = function() {
          var allInnerPoints = []
          raster.size = new paper.Size(raster.width / quantiseFactor, raster.height / quantiseFactor);
          for (var y = 0; y < raster.height; y++) {
            for (var x = 0; x < raster.width; x++) {
              // Get the color of the pixel:
              var color = raster.getPixel(x, y);
              if (color.alpha == 1) {
                var pathCenter = new Point(((x / raster.width) * raster.bounds.width * quantiseFactor) + (raster.position.x - ((raster.bounds.width / 2) * quantiseFactor)),
                  ((y / raster.height) * raster.bounds.height * quantiseFactor) + (raster.position.y - ((raster.bounds.height / 2) * quantiseFactor)));
                //console.log(pathCenter);
                allInnerPoints.push(pathCenter);
              }
            }
          }
          this.setState({innerPointsBuffer : allInnerPoints});
        }.bind(this); //Makes it refer back to object
      }
}