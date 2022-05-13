---
title: 11 实现AJAX
date: 2021-08-08
categories:
 - JavaScript
tags:
 - JS API原理
---





## AJAX 是什么

**AJAX（Asynchronous JavaScript and XML）是一种在无需重新加载整个网页的情况下，能够更新部分网页的技术。**

通过与服务器进行少量数据交换，AJAX 可以使网页实现异步更新，对页面的某部分进行更新，而无需重新加载整个页面。

AJAX 通信的步骤如下：

1. 创建 XMLHttpRequest 实例
2. 发出 HTTP 请求
3. 服务器返回 XML 或 JSON 格式的字符串
4. JS 解析响应，并更新局部页面

AJAX 通信中最主要的便是 XMLHttpRequest 实例

## XMLHttpRequest 实例

XMLHttpRequest 实例有许多属性，具体可以查看 [MDN XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)。其中有几个重要的属性要注意

+ readyState：返回 XMLHttpRequest 代理当前所处的状态。状态的值如下

| 值   | 状态             | 描述                                              |
| ---- | ---------------- | ------------------------------------------------- |
| 0    | UNSENT           | 代理被创建，但尚未调用 open() 方法。              |
| 1    | OPENED           | open() 方法已经被调用。                           |
| 2    | HEADERS_RECEIVED | send() 方法已经被调用，并且头部和状态已经可获得。 |
| 3    | LOADING          | 下载中； responseText 属性已经包含部分数据。      |
| 4    | DONE             | 下载操作已完成。                                  |

+ status：服务器响应的 HTTP 状态码
+ responseText：从服务器接收到的响应字符串
+ onreadystatechange：事件，监听 readyState 的变化
+ open()：可指定 HTTP 请求的参数，可接收五个参数
  + method：HTTP 方法
  + url：目标 URL
  + async：布尔值，表示是否异步，默认为 true
  + user：用于认证的用户名
  + password：用于认证的密码
+ send()：发出 HTTP 请求方法，可传递参数作为请求体
+ setRequestHeader()：设置请求头
+ getResponseHeader()：获取响应头



## 手写 AJAX

按照 AJAX 通信的步骤可以很简单地写出来

```js
function ajax(method, url, body){
  return new Promise((resolve, reject) => {
    // 创建 XMLHttpRequest 实例
    const xhr = new XMLHttpRequest();
    // 指定 HTTP 的方法以及 URL
    xhr.open(method, url, true);
    xhr.onreadystatechange = function(){  // 监听 readyState 的改变
      if(xhr.readyState === 4){   // 当请求完成时
        if(xhr.status >= 200 && xhr.status < 300){  // 状态码为成功状态码
          resolve(JSON.parse(xhr.responseText))
        }else{
          reject(JSON.parse(xhr.responseText))
        }
      }
    }
    // 发起请求
    xhr.send(body)
  })
}
```

那么便可以通过下面这样使用 AJAX

```js
ajax("get", "https://jsonplaceholder.typicode.com/todos/1")
.then(v => {
  console.log(v)
})
```

