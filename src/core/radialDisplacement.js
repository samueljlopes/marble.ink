
class RadialDisplacement {
    main() {
    }
    
    getInnerPointsRecursive(givenObject, scale, existingPoints) {
        if (existingPoints == null) { existingPoints = [] }
        else { givenObject.remove(); }
    
        var scaledObject = givenObject.clone()
        scaledObject.scale(scale);
        if ((scaledObject.bounds.height * scaledObject.bounds.width) < 1) {
          return (existingPoints);
        }
        else {
          existingPoints.push(...scaledObject.segments);
          return this.getInnerPointsRecursive(scaledObject, scale - 0.01, existingPoints);
        }
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