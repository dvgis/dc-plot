/**
 * @Author: Caven
 * @Date: 2020-08-30 17:22:21
 */

import Draw from './Draw'

import GatheringPlaceGraphics from '../graphics/GatheringPlaceGraphics'

const { Transform } = DC

const { Cesium } = DC.Namespace

const DEF_STYLE = {
  material: Cesium.Color.YELLOW.withAlpha(0.6),
  fill: true
}

class DrawGatheringPlace extends Draw {
  constructor(plot, style) {
    super(plot)
    this._positions = []
    this._floatingAnchor = undefined
    this._style = {
      ...DEF_STYLE,
      ...style
    }
    this._graphics = new GatheringPlaceGraphics()
    this._mountEntity()
  }

  _mountEntity() {
    this._delegate = new Cesium.Entity({
      polygon: {
        ...this._style,
        hierarchy: new Cesium.CallbackProperty(() => {
          if (this._positions.length > 1) {
            this._graphics.positions = this._positions
            return this._graphics.hierarchy
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
      this._createAnchor(e.surfacePosition)
      this._floatingAnchor = this._createAnchor(e.surfacePosition)
    }
    this._positions.push(e.surfacePosition)
    this._graphics.positions = this._positions
    this._createAnchor(e.surfacePosition)
    if (len > 2) {
      this._positions.pop()
      this._unbindEvent()
      let gatheringPlace = new DC.GatheringPlace(
        Transform.transformCartesianArrayToWGS84Array(this._positions)
      )
      gatheringPlace.setStyle(this._style)
      this._plot.plotEvent.raiseEvent(gatheringPlace)
    }
  }

  _mouseMoveHandler(e) {
    this._plot.viewer.tooltip.showAt(e.windowPosition, '单击选择点位')
    if (this._floatingAnchor) {
      this._floatingAnchor.position.setValue(e.surfacePosition)
      this._positions.pop()
      this._positions.push(e.surfacePosition)
    }
  }
}

export default DrawGatheringPlace
