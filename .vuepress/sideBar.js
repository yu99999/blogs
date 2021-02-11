const {createSideBar} = require('./utils')

const JAVASCRIPT_PATH = '/blogs/javascript';
const NET_PATH = '/blogs/net';
const BROWSER_PATH = '/blogs/browser';
const PERFORMANCE_PATH = '/blogs/performance';
const ALGORITHM_PATH = '/blogs/algorithm'


module.exports = {
  '/blogs': [
    {
      title: 'JavaScript',
      sidebarDepth: 2,
      children: [
        createSideBar('JS基础', JAVASCRIPT_PATH + '/js-base'),
        createSideBar('JS原理', JAVASCRIPT_PATH + '/js-theory'),
        createSideBar('V8引擎', JAVASCRIPT_PATH + '/js-v8')
      ]
    },
    {
      title: '浏览器',
      sidebarDepth: 2,
      children: [
        createSideBar('浏览器基础', BROWSER_PATH + '/browser-base'),
        createSideBar('浏览器渲染', BROWSER_PATH + '/browser-render')
      ]
    },
    createSideBar('性能相关', PERFORMANCE_PATH),
    createSideBar('算法', ALGORITHM_PATH),
    
  ]
}