/*
 * @Author: Caven
 * @Date: 2020-03-17 18:23:25
 * @Last Modified by: Caven
 * @Last Modified time: 2020-05-11 23:13:36
 */
import Edit from './Edit'

const { Transform } = DC

const { Cesium } = DC.Namespace

class EditCircle extends Edit {
  constructor(plot, overlay) {
    super(plot)
    this._overlay = overlay
    this._center = undefined
    this._radius = 0
    this._positions = []
    this._mountEntity()
    this._mountAnchor()
  }

  _mountEntity() {
    let now = Cesium.JulianDate.now()
    this._radius = this._overlay.radius
    let entity = new Cesium.Entity({
      polygon: {
        material: this._overlay.delegate.material
      }
    })
    this._center = this._overlay.delegate.position.getValue(now)
    this._positions = [].concat([
      this._center,
      this._computeCirclePoints(this._center, this._radius)[0]
    ])
    entity.polygon.hierarchy = new Cesium.CallbackProperty(time => {
      if (this._positions.length > 1) {
        this._radius = Cesium.Cartesian3.distance(
          this._positions[0],
          this._positions[1]
        )
        if (this._radius <= 0) {
          return null
        }
        let pnts = this._computeCirclePoints(this._positions[0], this._radius)
        pnts.push(pnts[0])
        return new Cesium.PolygonHierarchy(pnts)
      } else {
        return null
      }
    }, false)
    this._plot.overlayLayer.add(this._delegate)
  }

  _mountAnchor() {
    this._positions.forEach((item, index) => {
      this.createAnchor(item, index, false, index % 2 === 0)
    })
  }

  _computeCirclePoints(center, radius) {
    let pnts = []
    let cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions(
      {
        center: center,
        semiMajorAxis: radius,
        semiMinorAxis: radius,
        rotation: 0,
        granularity: 0.005
      },
      false,
      true
    )
    if (cep && cep.outerPositions) {
      pnts = Cesium.Cartesian3.unpackArray(cep.outerPositions)
    }
    return pnts
  }

  _mouseClickHandler(e) {
    let now = Cesium.JulianDate.now()
    if (this._isMoving) {
      this._isMoving = false
      if (this._pickedAnchor && this._pickedAnchor.position) {
        this._pickedAnchor.position.setValue(e.surfacePosition)
        let properties = this._pickedAnchor.properties.getValue(now)
        this._positions[properties.index] = e.surfacePosition
      }
    } else {
      this._isMoving = true
      if (!e.target || !e.target.id) {
        return false
      }
      this._pickedAnchor = e.target.id
    }
  }

  _mouseMoveHandler(e) {
    if (!this._isMoving) {
      return
    }
    if (this._pickedAnchor && this._pickedAnchor.position) {
      let properties = this._pickedAnchor.properties.getValue(
        Cesium.JulianDate.now()
      )
      this._pickedAnchor.position.setValue(e.surfacePosition)
      this._positions[properties.index] = e.surfacePosition
    }
  }

  _mouseRightClickHandler(e) {
    this.unbindEvent()
    this._overlay.center = Transform.transformCartesianToWGS84(
      this._positions[0]
    )
    this._overlay.radius = this._radius
    this._overlay.show = true
    this._plot.plotEvent.raiseEvent(this._overlay)
  }
}

export default EditCircle
