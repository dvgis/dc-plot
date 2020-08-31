# DC-Plot

[**🇨🇳 中文**](./README_zh.md) | [**🇬🇧English**](./README.md)

> DC-SDK plotting tools, such as point, line, surface drawing and some military object drawing.

> [Home Page](http://dc.dvgis.cn)

```warning
Tips：This SDK is JS+GIS framework package. Developers need to have some front-end technology and GIS related technology
```

## Installation

> CDN

```html
<!--Basic Package-->
<script src="libs/dc-sdk/dc.base.min.js"></script>
<!--Core Package-->
<script src="libs/dc-sdk/dc.core.min.js"></script>
<!--Overlay Package-->
<script src="libs/dc-overlay/dc.overlay.min.js"></script>
<!--Plot Package-->
<script src="libs/dc-plot/dc.plot.min.js"></script>
<!--Main Style Sheet -->
<link href="libs/dc-sdk/dc.core.min.css" rel="stylesheet" type="text/css" />
```

> NPM / YARN

```shell
   yarn add @dvgis/dc-sdk @dvgis/dc-overlay @dvgis/dc-plot
   npm install @dvgis/dc-sdk @dvgis/dc-overlay @dvgis/dc-plot
```

```js
import 'dvgis/dc-sdk/dist/dc.base.min' //Basic Package
import 'dvgis/dc-sdk/dist/dc.core.min' //Core Package
import 'dvgis/dc-overlay/dist/dc.overlay.min' //Overlay Package
import 'dvgis/dc-plot/dist/dc.plot.min' //Plot Package
import 'dvgis/dc-sdk/dist/dc.core.min.css' // Main Style Sheet
```

## Setting

> Vue

```js
// vue.config.js

const path = require('path')
const CopywebpackPlugin = require('copy-webpack-plugin')
const dvgisDist = './node_modules/@dvgis'

module.exports = {
  // other settings
  chainWebpack: config => {
    config.resolve.alias.set('dvgis', path.resolve(__dirname, dvgisDist))
    config.plugin('copy').use(CopywebpackPlugin, [
      [
        {
          from: path.join(dvgisDist, 'dc-sdk/dist/resources'),
          to: 'libs/dc-sdk/resources'
        }
      ]
    ])
  }
}
```

## Start

```js
DC.ready(() => {
  let viewer = new DC.Viewer(divId) // divId is the Id attribute value of a div node. If it is not passed in, the 3D scene cannot be initialized
})
```

## Documentation

[DC Api](https://resource.dvgis.cn/dc-api)

[Cesium Api](https://cesium.com/docs/cesiumjs-ref-doc/)

## Demo

![picture](http://dc.dvgis.cn/examples/images/overlay/plot-overlay.png)

## Copyright statement

```warning
1. The framework is a basic platform, completely open source, which can be modified and reconstructed by any individual or institution without our authorization.
2. A series of targeted plug-ins and tools will be added later, and an appropriate amount of open source.
3. Free and permanent use by any person or institution subject to the following conditions:
  1) complete package reference;
  2) reserve this copyright information in the console output
We reserve the right of final interpretation of this copyright information.
```

## Thanks
