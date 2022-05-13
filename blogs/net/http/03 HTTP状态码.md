---
title: 03 HTTP状态码
date: 2021-03-12
categories:
 - 网络协议
tags:
 - HTTP
---



HTTP 状态码分成五类，用数字的第一位表示分类：

+ 1xx：提示信息，表示是协议处理的中间状态，还需要进一步的操作
+ 2xx：成功
+ 3xx：重定向，请求资源发生改动
+ 4xx：客户端错误
+ 5xx：服务端错误



## 1xx

**101 Switching Protocols**：表示客户端要求更改协议，比如将 HTTP 升级为 WebSocket，如果服务端也同意变更协议，就会发送状态码 101



## 2xx

**200 OK**：表示一切正常，通常在响应体重放有数据

**204 No Content**：一切正常，但响应体中没有数据

**206 Partial Content**：是 HTTP 分块下载或断点续传的基础，客户端要求获取资源的部分数据。通常会有 **Content-Range** 头字段来表示数据的具体范围



## 3xx

**301 Moved Permanently**：永久重定向，访问的资源已经不存在，需要改用新的 URL 再次访问

**302 Found**：临时重定向

> 浏览器默认会对**永久重定向**进行缓存优化，当下次访问时直接改用新的 URL 进行访问

**304 Not Modified**：缓存重定向，当协商缓存命中时会返回这个状态码



## 4xx

**400 BadRequest**：通用的错误码，表示客户端错误

**401 BadRequest**：请求要求身份验证

**403 Forbidden**：权限不足，实际上不是客户端出错而是服务端禁止访问资源。原因很多，比如法律禁止、服务器拒绝接收请求等

**404 Not Found**：表示资源在服务器上没有找到

**405 Method Not Allowed**：不允许使用某些方法操作资源。例如只能用 GET 就不能用 POST

**406 Not Acceptable**：资源无法满足客户端请求的条件，例如请求中文但是只有英文

**408 Request Timeout**：请求超时



## 5xx

**500 Internal Server Error**：与400类似，是个通用的错误码，表示服务端错误

**501 Not Implemented**：服务器不支持当前请求所需要的功能

**502 Bad Gateway**：通常是网关或代理服务器返回的错误码，表示当前服务器正常，但去访问后端服务器时发生了错误

**503 Service Unavailable**：表示服务器很忙，暂时无法响应