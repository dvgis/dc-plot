/**
 * @Author: Caven
 * @Date: 2020-08-29 19:26:06
 */

import DrawPoint from './draw/DrawPoint'
import DrawPolyline from './draw/DrawPolyline'
import DrawPolygon from './draw/DrawPolygon'
import DrawCircle from './draw/DrawCircle'
import DrawRectangle from './draw/DrawRectangle'
import DrawBillboard from './draw/DrawBillboard'
import DrawAttackArrow from './draw/DrawAttackArrow'
import DrawDoubleArrow from './draw/DrawDoubleArrow'
import DrawFineArrow from './draw/DrawFineArrow'
import DrawGatheringPlace from './draw/DrawGatheringPlace'
import DrawTailedAttackArrow from './draw/DrawTailedAttackArrow'

import EditPoint from './edit/EditPoint'
import EditPolyline from './edit/EditPolyline'

const IMG_CIRCLE_RED = require('./images/circle_red.png')

const IMG_CIRCLE_BLUE = require('./images/circle_blue.png')

const IMG_CIRCLE_YELLOW = require('./images/circle_yellow.png')

const { OverlayType } = DC

const { Cesium } = DC.Namespace

const DEF_OPTS = {
  icon_center: IMG_CIRCLE_YELLOW,
  icon_anchor: IMG_CIRCLE_RED,
  icon_midAnchor: IMG_CIRCLE_BLUE,
  icon_size: [12, 12]
}

class Plot {
  constructor(viewer, options = {}) {
    this._viewer = viewer
    this._options = {
      ...DEF_OPTS,
      ...options
    }
    this._plotEvent = new Cesium.Event()
    this._callback = undefined
    this._drawWorker = undefined
    this._editWorker = undefined
    this._overlayLayer = new Cesium.CustomDataSource('plot-overlay-layer')
    this._viewer.dataSources.add(this._overlayLayer)
    this._anchorLayer = new Cesium.CustomDataSource('plot-anchor-layer')
    this._viewer.dataSources.add(this._anchorLayer)
    this._state = undefined
  }

  get viewer() {
    return this._viewer
  }

  get options() {
    return this._options
  }

  get plotEvent() {
    return this._plotEvent
  }

  get overlayLayer() {
    return this._overlayLayer.entities
  }

  get anchorLayer() {
    return this._anchorLayer.entities
  }

  _completeCallback(overlay) {
    this._drawWorker = undefined
    this._editWorker = undefined
    this._viewer.tooltip.enable = false
    this._overlayLayer.entities.removeAll()
    this._anchorLayer.entities.removeAll()
    this._callback && this._callback.call(this, overlay)
  }

  _bindEvent(callback) {
    this._plotEvent.removeEventListener(this._completeCallback, this)
    this._callback = callback
    this._plotEvent.addEventListener(this._completeCallback, this)
  }

  _createDrawWorker(type, style) {
    switch (type) {
      case OverlayType.POINT:
        this._drawWorker = new DrawPoint(this, style)
        break
      case OverlayType.POLYLINE:
        this._drawWorker = new DrawPolyline(this, style)
        break
      case OverlayType.POLYGON:
        this._drawWorker = new DrawPolygon(this, style)
        break
      case OverlayType.CIRCLE:
        this._drawWorker = new DrawCircle(this, style)
        break
      case OverlayType.RECTANGLE:
        this._drawWorker = new DrawRectangle(this, style)
        break
      case OverlayType.BILLBOARD:
        this._drawWorker = new DrawBillboard(this, style)
        break
      case OverlayType.ATTACK_ARROW:
        this._drawWorker = new DrawAttackArrow(this, style)
        break
      case OverlayType.DOUBLE_ARROW:
        this._drawWorker = new DrawDoubleArrow(this, style)
        break
      case OverlayType.FINE_ARROW:
        this._drawWorker = new DrawFineArrow(this, style)
        break
      case OverlayType.TAILED_ATTACK_ARROW:
        this._drawWorker = new DrawTailedAttackArrow(this, style)
        break
      case OverlayType.GATHERING_PLACE:
        this._drawWorker = new DrawGatheringPlace(this, style)
        break
      default:
        break
    }
  }

  _createEditWorker(overlay) {
    let info = {
      viewer: this._viewer,
      plotEvent: this._plotEvent,
      layer: this._markerLayer,
      overlay: overlay
    }
    switch (overlay.type) {
      case OverlayType.POINT:
        this._editWorker = new EditPoint(info)
        break
      case OverlayType.POLYLINE:
        this._editWorker = new EditPolyline(info)
        break
      case OverlayType.POLYGON:
        this._drawWorker = new DrawPolygon(info)
        break
      case OverlayType.CIRCLE:
        this._drawWorker = new DrawCircle(info)
        break
      case OverlayType.RECT:
        this._drawWorker = new DrawRectangle(info)
        break
      default:
        break
    }
  }

  draw(type, callback, style) {
    this._state = 'draw'
    this._viewer.tooltip.enable = true
    this._bindEvent(callback)
    this._createDrawWorker(type, style)
    this._drawWorker && this._drawWorker.start()
  }

  edit(overlay, callback) {
    this._state = 'edit'
    this._viewer.tooltip.enable = true
    this._bindEvent(callback)
    this._createEditWorker(overlay)
    this._editWorker && this._editWorker.start()
  }

  destroy() {
    this._plotEvent.removeEventListener(this._completeCallback, this)
    this._viewer.dataSources.remove(this._overlayLayer)
    this._viewer.dataSources.remove(this._anchorLayer)
    this._viewer = undefined
    this._plotEvent = undefined
  }
}

export default Plot
