/**
 * @Author: Caven
 * @Date: 2020-08-29 21:24:55
 */

import Draw from './Draw'

const { Transform } = DC

const { Cesium } = DC.Namespace

const DEF_STYLE = {
  material: Cesium.Color.YELLOW.withAlpha(0.6),
  fill: true
}

class DrawCircle extends Draw {
  constructor(plot, style) {
    super(plot)
    this._positions = []
    this._radius = 0
    this._style = {
      ...DEF_STYLE,
      ...style
    }
    this._mountEntity()
  }

  _mountEntity() {
    this._delegate = new Cesium.Entity({
      polygon: {
        ...this._style,
        hierarchy: new Cesium.CallbackProperty(() => {
          if (this._positions.length > 1) {
            this._radius = Cesium.Cartesian3.distance(
              this._positions[0],
              this._positions[1]
            )
            if (this._radius <= 0) {
              return null
            }
            let cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions(
              {
                center: this._positions[0],
                semiMajorAxis: this._radius,
                semiMinorAxis: this._radius,
                rotation: 0,
                granularity: 0.005
              },
              false,
              true
            )
            let pnts = Cesium.Cartesian3.unpackArray(cep.outerPositions)
            pnts.push(pnts[0])
            return new Cesium.PolygonHierarchy(pnts)
          } else {
            return null
          }
        }, false)
      }
    })
    this._plot.overlayLayer.add(this._delegate)
  }

  _mouseClickHandler(e) {
    let len = this._positions.length
    if (len === 0) {
      this._positions.push(e.surfacePosition)
      this.createAnchor(e.surfacePosition, true)
      this._floatingAnchor = this._createAnchor(e.surfacePosition)
    }
    this._positions.push(e.surfacePosition)
    if (len > 0) {
      this.createAnchor(e.surfacePosition)
    }
    if (len > 1) {
      this._positions.pop()
      this.unbindEvent()
      let circle = new DC.Circle(
        Transform.transformCartesianToWGS84(this._positions[0]),
        this._radius
      )
      circle.setStyle(this._style)
      this._plot.plotEvent.raiseEvent(circle)
    }
  }

  _mouseMoveHandler(e) {
    this._plot.viewer.tooltip.showAt(e.windowPosition, '左击选择点位')
    if (this._floatingAnchor) {
      this._floatingAnchor.position.setValue(e.surfacePosition)
      this._positions.pop()
      this._positions.push(e.surfacePosition)
    }
  }
}

export default DrawCircle
