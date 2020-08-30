/**
 * @Author: Caven
 * @Date: 2020-01-31 16:25:29
 */

import Draw from './Draw'

const { Transform } = DC

const { Cesium } = DC.Namespace

const DEF_STYLE = {
  pixelSize: 10,
  outlineColor: Cesium.Color.BLUE,
  outlineWidth: 5,
  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
}

class DrawPoint extends Draw {
  constructor(plot, style) {
    super(plot)
    this._position = Cesium.Cartesian3.ZERO
    this._style = {
      ...DEF_STYLE,
      ...style
    }
    this._mountEntity()
  }

  _mountEntity() {
    this._delegate = new Cesium.Entity({
      position: new Cesium.CallbackProperty(() => {
        return this._position
      }, false),
      point: {
        ...this._style
      }
    })
    this._plot.overlayLayer.add(this._delegate)
  }

  _mouseClickHandler(e) {
    this._position = e.surfacePosition
    this.unbindEvent()
    let point = new DC.Point(
      Transform.transformCartesianToWGS84(this._position)
    )
    point.setStyle(this._style)
    this._plot.plotEvent.raiseEvent(point)
  }

  _mouseMoveHandler(e) {
    this._position = e.surfacePosition
    this._plot.viewer.tooltip.showAt(e.windowPosition, '单击选择点位')
  }
}

export default DrawPoint
