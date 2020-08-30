/**
 * @Author: Caven
 * @Date: 2020-08-29 20:29:59
 */

import Draw from './Draw'

const { Transform } = DC

const { Cesium } = DC.Namespace

const DEF_STYLE = {
  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
}

class DrawPoint extends Draw {
  constructor(plot, style) {
    super(plot)
    this._position = Cesium.Cartesian3.ZERO
    this._style = {
      image: plot.options.icon_anchor,
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
      billboard: {
        ...this._style
      }
    })
    this._plot.overlayLayer.add(this._delegate)
  }

  _mouseClickHandler(e) {
    this._position = e.surfacePosition
    this._unbindEvent()
    let billboard = new DC.Billboard(
      Transform.transformCartesianToWGS84(this._position),
      this._style.image
    )
    billboard.setStyle(this._style)
    this._plot.plotEvent.raiseEvent(billboard)
  }

  _mouseMoveHandler(e) {
    this._plot.viewer.tooltip.showAt(e.windowPosition, '单击选择点位')
    this._position = e.surfacePosition
  }
}

export default DrawPoint
