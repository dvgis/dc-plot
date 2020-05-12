/*
 * @Author: Caven
 * @Date: 2020-04-03 10:13:42
 * @Last Modified by: Caven
 * @Last Modified time: 2020-05-12 14:28:35
 */

const install = function (DC) {
  if (!DC || !DC.init) {
    throw new Error('Plot: Missing DC Base')
  }

  if (!DC.ready) {
    throw new Error('Plot: Missing DC Core')
  }

  DC.init(() => {
    DC.Plot = require('./core/Plot')
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.DC) {
  install(window.DC)
}

module.exports = {
  install,
}
