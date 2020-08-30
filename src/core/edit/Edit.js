/**
 * @Author: Caven
 * @Date: 2020-08-30 23:50:53
 */

const { Cesium } = DC.Namespace

class Edit {
  constructor(plot) {
    this._plot = plot
    this._overlay = undefined
    this._anchors = []
    this._delegate = undefined
    this._pickedAnchor = undefined
    this._isMoving = false
  }

  _mountEntity() {}

  _mountAnchor() {}

  _mouseClickHandler(e) {}

  _mouseMoveHandler(e) {}

  _mouseRightClickHandler(e) {}

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

  createAnchor(position, index, isMid = false, isCenter = false) {
    let image = isMid
      ? this._plot.options.icon_midAnchor
      : isCenter
      ? this._plot.options.icon_center
      : this._plot.options.icon_anchor
    let anchor = this._plot.anchorLayer.add({
      position: position,
      billboard: {
        image: image,
        width: 12,
        height: 12,
        eyeOffset: new Cesium.ConstantProperty(
          new Cesium.Cartesian3(0, 0, -500)
        ),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      },
      properties: {
        isMid: isMid,
        index: index
      }
    })
    this._anchors.push(anchor)
  }

  computeMidPosition(p1, p2) {
    let c1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(p1)
    let c2 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(p2)
    let cm = new Cesium.EllipsoidGeodesic(c1, c2).interpolateUsingFraction(0.5)
    return Cesium.Ellipsoid.WGS84.cartographicToCartesian(cm)
  }

  start() {
    this.bindEvent()
  }
}

export default Edit
