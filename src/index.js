/**
 * @Author: Caven
 * @Date: 2020-04-03 19:13:42
 */

const install = function(DC) {
  if (!DC || !DC.init) {
    throw new Error('Plot: Missing DC Base')
  }

  if (!DC.ready) {
    throw new Error('Plot: Missing DC Core')
  }

  DC.init(() => {
    require('./Plot.Loader')
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.DC) {
  install(window.DC)
}

module.exports = {
  install
}
