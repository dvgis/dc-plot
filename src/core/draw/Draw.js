/**
 * @Author: Caven
 * @Date: 2020-01-31 19:45:32
 */

const { Cesium } = DC.Namespace

class Draw {
  constructor(plot) {
    this._plot = plot
    this._delegate = undefined
    this._floatingAnchor = undefined
  }

  _mountEntity() {}

  _mouseClickHandler() {}

  _mouseMoveHandler() {}

  _mouseRightClickHandler() {}

  bindEvent() {
    this._plot.viewer.on(
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
      this._mouseClickHandler,
      this
    )

    this._plot.viewer.on(
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
      this._mouseMoveHandler,
      this
    )

    this._plot.viewer.on(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK,
      this._mouseRightClickHandler,
      this
    )
  }

  unbindEvent() {
    this._plot.viewer.off(
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
      this._mouseClickHandler,
      this
    )

    this._plot.viewer.off(
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
      this._mouseMoveHandler,
      this
    )

    this._plot.viewer.off(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK,
      this._mouseRightClickHandler,
      this
    )
  }

  createAnchor(position, isCenter = false) {
    return this._plot.overlayLayer.add({
      position: position,
      billboard: {
        image: isCenter
          ? this._plot.options.icon_center
          : this._plot.options.icon_anchor,
        width: this._plot.options.icon_size[0],
        height: this._plot.options.icon_size[1],
        eyeOffset: new Cesium.Cartesian3(0, 0, -500),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    })
  }

  start() {
    this.bindEvent()
  }
}

export default Draw
