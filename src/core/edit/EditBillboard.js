/**
 * @Author: Caven
 * @Date: 2020-08-30 22:04:36
 */

import Edit from './Edit'

const { Transform } = DC

const { Cesium } = DC.Namespace

class EditBillboard extends Edit {
  constructor(plot, overlay) {
    super(plot)
    this._overlay = overlay
    this._position = undefined
    this._mountEntity()
  }

  _mountEntity() {
    this._delegate = new Cesium.Entity()
    this._delegate.merge(this._overlay.delegate)
    this._overlay.show = false
    this._position = this._delegate.position.getValue(Cesium.JulianDate.now())
    this._delegate.position = new Cesium.CallbackProperty(() => {
      return this._position
    })
    this._plot.overlayLayer.add(this._delegate)
  }

  _mouseMoveHandler(e) {
    this._plot.viewer.tooltip.showAt(e.windowPosition, '右击结束编辑')
    this._position = e.surfacePosition
  }

  _mouseRightClickHandler(e) {
    this.unbindEvent()
    this._overlay.position = Transform.transformCartesianToWGS84(this._position)
    this._overlay.show = true
    this._plot.plotEvent.raiseEvent(this._overlay)
  }
}

export default EditBillboard
