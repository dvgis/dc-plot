/**
 * @Author: Caven
 * @Date: 2020-08-29 20:54:37
 */

import Draw from './Draw'

const { Transform } = DC

const { Cesium } = DC.Namespace

const DEF_STYLE = {
  width: 3,
  material: Cesium.Color.YELLOW.withAlpha(0.6)
}

class DrawPolyline extends Draw {
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
      polyline: {
        ...this._style,
        positions: new Cesium.CallbackProperty(() => {
          return this._positions
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
  }

  _mouseMoveHandler(e) {
    this._plot.viewer.tooltip.showAt(e.windowPosition, '单击选择点位,右击结束')
    if (this._floatingAnchor) {
      this._floatingAnchor.position.setValue(e.surfacePosition)
      this._positions.pop()
      this._positions.push(e.surfacePosition)
    }
  }

  _mouseRightClickHandler(e) {
    this.unbindEvent()
    let polyline = new DC.Polyline(
      Transform.transformCartesianArrayToWGS84Array(this._positions)
    )
    polyline.setStyle(this._style)
    this._plot.plotEvent.raiseEvent(polyline)
  }
}

export default DrawPolyline
