# DC-Plot

[**🇨🇳 中文**](./README_zh.md) | [**🇬🇧English**](./README.md)

> DC-SDK 标绘工具，如点、线、面绘制和一些军事对象绘制。

> [主页](http://dc.dvgis.cn)

```warning
Tips：本框架是 JS+GIS 的框架包。开发者需要有一定的前端技术和 GIS 相关技术
```

## 安装

> CDN

```html
<!--基础包-->
<script src="libs/dc-sdk/dc.base.min.js"></script>
<!--核心包-->
<script src="libs/dc-sdk/dc.core.min.js"></script>
<!--要素包 -->
<script src="libs/dc-overlay/dc.overlay.min.js"></script>
<!--标绘包 -->
<script src="libs/dc-plot/dc.plot.min.js"></script>
<!--主要样式-->
<link href="libs/dc-sdk/dc.core.min.css" rel="stylesheet" type="text/css" />
```

> NPM / YARN

```shell
   yarn add @dvgis/dc-sdk @dvgis/dc-overlay @dvgis/dc-plot
   npm install @dvgis/dc-sdk @dvgis/dc-overlay @dvgis/dc-plot
```

```js
import 'dvgis/dc-sdk/dist/dc.base.min' //基础包
import 'dvgis/dc-sdk/dist/dc.core.min' //核心包
import 'dvgis/dc-overlay/dist/dc.overlay.min' //要素包
import 'dvgis/dc-plot/dist/dc.plot.min' //标绘包
import 'dvgis/dc-sdk/dist/dc.core.min.css' // 主要样式
```

## 配置

> Vue

```js
// vue.config.js vue 文件

const path = require('path')
const CopywebpackPlugin = require('copy-webpack-plugin')
const dvgisDist = './node_modules/@dvgis'

module.exports = {
  // 其他配置
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

## 开始

```js
DC.ready(() => {
  let viewer = new DC.Viewer(divId) // divId 为一个div节点的Id属性值，如果不传入，会无法初始化3D场景
})
```

## 文档

[DC Api](https://resource.dvgis.cn/dc-api)

[Cesium Api](https://cesium.com/docs/cesiumjs-ref-doc/)

## 示例

## 版权声明

```warning
1.框架是一个基本平台，完全开源，任何个人和机构可以修改、重构，无需经过我方授权。
2.后期会添加一系列针对性的插件和工具，会适量的开源。
3.任何个人和机构在遵守下列条件的前提下可以永久免费使用:
   1)程序包完整引用；
   2)保留此版权信息在控制台输出 我方保留对此版权信息的最终解释权。
```

## 感谢
