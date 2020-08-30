/**
 * @Author: Caven
 * @Date: 2020-08-29 21:30:41
 */

import Draw from './Draw'

const { Transform } = DC

const { Cesium } = DC.Namespace

const DEF_STYLE = {
  material: Cesium.Color.YELLOW.withAlpha(0.6)
}

class DrawRectangle extends Draw {
  constructor(plot, style) {
    super(plot)
    this._positions = []
    this._style = {
      ...DEF_STYLE,
      ...style
    }
    this._mountEntity()
  }

  _mountEntity() {
    this._delegate = new Cesium.Entity({
      rectangle: {
        ...this._style,
        coordinates: new Cesium.CallbackProperty(time => {
          if (this._positions.length > 1) {
            return Cesium.Rectangle.fromCartesianArray(this._positions)
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
      this.createAnchor(e.surfacePosition)
      this._floatingAnchor = this._createAnchor(e.surfacePosition)
    }
    this._positions.push(e.surfacePosition)
    this.createAnchor(e.surfacePosition)
    if (len > 1) {
      this._positions.pop()
      this.unbindEvent()
      let rectangle = new DC.Rectangle(
        Transform.transformCartesianArrayToWGS84Array(this._positions)
      )
      rectangle.setStyle(this._style)
      this._plot.plotEvent.raiseEvent(rectangle)
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

export default DrawRectangle
