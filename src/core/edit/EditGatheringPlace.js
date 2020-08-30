/**
 * @Author: Caven
 * @Date: 2020-08-30 23:46:07
 */

import Edit from './Edit'
import GatheringPlaceGraphics from '../graphics/GatheringPlaceGraphics'

const { Transform } = DC

const { Cesium } = DC.Namespace

class EditGatheringPlace extends Edit {
  constructor(plot, overlay) {
    super(plot)
    this._overlay = overlay
    this._positions = []
    this._graphics = new GatheringPlaceGraphics()
    this._mountEntity()
    this._mountAnchor()
  }

  _mountEntity() {
    this._delegate = new Cesium.Entity()
    this._delegate.merge(this._overlay.delegate)
    this._overlay.show = false
    this._delegate.polygon.hierarchy = new Cesium.CallbackProperty(() => {
      if (this._positions.length > 1) {
        this._graphics.positions = this._positions
        return this._graphics.hierarchy
      } else {
        return null
      }
    }, false)
    this._plot.overlayLayer.add(this._delegate)
  }

  _mountAnchor() {
    this._positions = [].concat(
      Transform.transformWGS84ArrayToCartesianArray(this._overlay.positions)
    )
    this._positions.forEach((item, index) => {
      this.createAnchor(item, index)
    })
  }

  _mouseClickHandler(e) {
    if (this._isMoving) {
      this._isMoving = false
      if (this._pickedAnchor && this._pickedAnchor.position) {
        this._pickedAnchor.position.setValue(e.surfacePosition)
        let properties = this._pickedAnchor.properties.getValue(
          Cesium.JulianDate.now()
        )
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
    this._plot.viewer.tooltip.showAt(
      e.windowPosition,
      '点击锚点移动,右击结束编辑'
    )
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
    this._overlay.positions = Transform.transformCartesianArrayToWGS84Array(
      this._positions
    )
    this._overlay.show = true
    this._plot.plotEvent.raiseEvent(this._overlay)
  }
}

export default EditGatheringPlace
