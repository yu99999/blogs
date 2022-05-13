const {createSideBar} = require('./utils')

const JAVASCRIPT_PATH = '/blogs/javascript';
const NET_PATH = '/blogs/net';
const BROWSER_PATH = '/blogs/browser';
const PERFORMANCE_PATH = '/blogs/performance';
const ALGORITHM_PATH = '/blogs/algorithm';
const CSS_PATH = '/blogs/css'
const EXTEND_PATH = '/blogs/extend'


module.exports = {
  '/blogs': [
    {
      title: 'JavaScript',
      sidebarDepth: 2,
      children: [
        createSideBar('JS基础', JAVASCRIPT_PATH + '/js-base'),
        createSideBar('JS原理', JAVASCRIPT_PATH + '/js-theory'),
        createSideBar('JS引擎', JAVASCRIPT_PATH + '/js-v8'),
        createSideBar('JS异步', JAVASCRIPT_PATH + '/js-async')
      ]
    },
    {
      title: '计算机网络',
      sidebarDepth: 2,
      children: [
        createSideBar('HTTP', NET_PATH + '/http'),
        createSideBar('TCP', NET_PATH + '/tcp'),
        createSideBar('其他', NET_PATH + '/other'),
      ]
    },
    {
      title: '浏览器',
      sidebarDepth: 2,
      children: [
        createSideBar('浏览器基础', BROWSER_PATH + '/browser-base'),
        createSideBar('浏览器渲染', BROWSER_PATH + '/browser-render'),
        createSideBar('浏览器安全', BROWSER_PATH + '/browser-secure')
      ]
    },
    {
      title: 'CSS',
      sidebarDepth: 2,
      children: [
        createSideBar('CSS基础', CSS_PATH + '/base'),
        createSideBar('CSS布局', CSS_PATH + '/layout')
      ]
    },
    createSideBar('性能相关', PERFORMANCE_PATH),
    createSideBar('算法', ALGORITHM_PATH),
    createSideBar('扩展', EXTEND_PATH),
    
  ]
}