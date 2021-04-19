const sideBar = require('./sideBar');
const path = require('path')

module.exports = {
  "title": "小德的博客",
  "description": "写点东西",
  "dest": "public",
  "base": "/",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/avatar.png"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "主页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "时间线",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      // {
      //   "text": "Docs",
      //   "icon": "reco-message",
      //   "items": [
      //     {
      //       "text": "vuepress-reco",
      //       "link": "/docs/theme-reco/"
      //     }
      //   ]
      // },
      {
        "text": "Contact",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/yudeshengya/yudeshengya.github.io",
            "icon": "reco-github"
          }
        ]
      }
    ],
    "sidebar": sideBar,
    "subSidebar": 'auto',
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    "friendLink": [
      {
        "title": "vuepress-theme-reco",
        "desc": "A simple and beautiful vuepress Blog & Doc theme.",
        "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        "link": "https://vuepress-theme-reco.recoluan.com"
      }
    ],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "小德",
    "authorAvatar": "/avatar.png",
    "record": "xxxx",
    "startYear": "2021",
  },
  "markdown": {
    "lineNumbers": true
  },
  "locales": {
    '/': {
      lang: 'zh-CN'
    }
  },
  "configureWebpack": {
    "resolve": {
      "alias": {
        '@img': path.join(process.cwd(), '/image')  // 将路径替换为 @img/
      }
    }
  }
}