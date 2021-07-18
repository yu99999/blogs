(window.webpackJsonp=window.webpackJsonp||[]).push([[83],{624:function(e,t,v){"use strict";v.r(t);var _=v(6),o=Object(_.a)({},(function(){var e=this,t=e.$createElement,v=e._self._c||t;return v("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[v("h2",{attrs:{id:"为什么需要-websocket"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#为什么需要-websocket"}},[e._v("#")]),e._v(" 为什么需要 WebSocket")]),e._v(" "),v("p",[e._v("与 HTTP 一样，WebSocket 是一种基于 TCP 的应用层协议，那为什么要再出这样的一个协议呢？")]),e._v(" "),v("p",[e._v('WebSocket 与 HTTP2 一样，都是为了解决 HTTP 某方面的缺陷而诞生的。HTTP2 针对的是队头阻塞，WebSocket 针对的是"请求-应答"的通信模式。')]),e._v(" "),v("p",[e._v('我们知道，"请求-应答"是一种'),v("strong",[e._v("半双工")]),e._v("的通信模式，并且它是一种被动的通信，服务器被动地响应客户端，无法主动发送数据，而 WebSocket 是"),v("strong",[e._v("全双工")]),e._v("的通信，服务器具有主动推送数据给客户端的能力。")]),e._v(" "),v("blockquote",[v("ul",[v("li",[e._v("半双工：通信双方都能够收发数据，但是同一时刻只能有一个方向传输。例如对讲机")]),e._v(" "),v("li",[e._v("全双工：通信双方都能够同时收发数据。例如电话")])])]),e._v(" "),v("p",[e._v("在 WebSocket 出现之前，在浏览器实现实时通信这类需要"),v("strong",[e._v("服务器推送")]),e._v("的应用，一般会采用"),v("strong",[e._v("轮询")]),e._v("技术，不断地向服务器发送 HTTP 请求，询问有没有数据，有的话服务器就用响应报文来回应。当轮询的频率比较高时，就可以近似地实现实时通信的效果了。")]),e._v(" "),v("p",[e._v("轮询的缺点非常明显，重复发送无效查询耗费了大量的带宽和 CPU 资源。因此，WebSocket 这种全双工通信模式的协议也就应运而生了。")]),e._v(" "),v("h2",{attrs:{id:"websocket-的特点"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#websocket-的特点"}},[e._v("#")]),e._v(" WebSocket 的特点")]),e._v(" "),v("ol",[v("li",[v("strong",[e._v("全双工")]),e._v("通信协议，客户端和服务器都可以随时向对方发送数据")]),e._v(" "),v("li",[e._v("默认端口与 HTTP 一样是 80 和 443")]),e._v(" "),v("li",[e._v("协议标识符是 ws 和 wss，分别表示明文和加密的 WebSocket 协议")]),e._v(" "),v("li",[e._v("WebSocket 需要经过握手后才能正式收发数据，握手阶段采用 HTTP 协议")]),e._v(" "),v("li",[e._v("WebSocket 握手后处于持久连接的状态，直到某一方主动断开")])]),e._v(" "),v("p",[e._v("下面讲讲 WebSocket 的握手过程：")]),e._v(" "),v("ol",[v("li",[e._v("WebSocket 握手是一个标准的 HTTP GET 请求，但是需要带上几个协议升级的专用头字段\n"),v("ul",[v("li",[e._v("Connection: Upgrade，表示协议升级")]),e._v(" "),v("li",[e._v("Upgrade: websocket，表示要升级到 WebSocket 协议")]),e._v(" "),v("li",[e._v("Sec-WebSocket-Version，表示 WebSocket 的版本")]),e._v(" "),v("li",[e._v("Sec-WebSocket-Key，作为简单的认证密钥")])])]),e._v(" "),v("li",[e._v('服务器收到 HTTP 后，看到升级协议的相关字段，就会构造一个特殊的 "101 Switching Protocols" 响应报文，并且会带上一个专用头字段\n'),v("ul",[v("li",[e._v("Sec-WebSocket-Accept，根据 Sec-WebSocket-Key 经过摘要计算得到")])])]),e._v(" "),v("li",[e._v("客户端收到响应后，用同样的算法去对比 Sec-WebSocket-Key 和 Sec-WebSocket-Accept 的值是否相等，如果相等就说明返回的报文确实是刚才握手时连接的服务器，认证成功。")]),e._v(" "),v("li",[e._v("以后的传输便是借助 TCP 传输信道进行全双工通信")])]),e._v(" "),v("h2",{attrs:{id:"websocket-与-http-的区别"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#websocket-与-http-的区别"}},[e._v("#")]),e._v(" WebSocket 与 HTTP 的区别")]),e._v(" "),v("p",[e._v("共同点：")]),e._v(" "),v("ul",[v("li",[v("p",[e._v("都一样基于 TCP 协议，实现可靠传输，并且都是应用层协议。")])]),e._v(" "),v("li",[v("p",[e._v("端口号都是 80 和 443")])])]),e._v(" "),v("p",[e._v("不同点：")]),e._v(" "),v("ul",[v("li",[e._v("WebSocket 需要浏览器和服务器握手建立连接，而 HTTP 是直接发送数据")]),e._v(" "),v("li",[e._v("WebSocket 是全双工通信，HTTP 是半双工通信")]),e._v(" "),v("li",[e._v("WebSocket 协议使用 ws 和 wss，HTTP 使用 http 和 https")])])])}),[],!1,null,null,null);t.default=o.exports}}]);