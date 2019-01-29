# 完成一个音乐客户端

最近完成一个音乐移动客户端，在此做一下项目总结：

这个音乐移动客户端实现了管理后台功能，使用了七牛作为歌曲数据存储数据库，leanCloud 存储歌曲、歌手、歌单信息；样式借鉴了网易云音乐的 UI。

主要就是从创建后台，上传内容，数据库记录相关数据，前端从云端数据库获取数据，然后渲染到页面上，整个流程都走了一遍，学习收获了不少，不仅仅是对一些工具的使用（七牛/leanCloud 等）更熟悉，一些 API （jQuery/原生js/audio 等）更了解，重要的是一些编程思想（如 eventHub/MVC）的了解与应用较之前更深入，

**项目地址**：[GitHub](https://github.com/no1harm/Neteasy-music-demo)

**预览地址**：[项目预览](https://no1harm.github.io/Neteasy-music-demo/src/index.html)

**实现功能**：

- 一个管理后台，其中的主要功能包括了歌手/歌单/歌曲的增删改查，并实时更新 leanCloud 云端数据库

- 可在首页查看推荐歌单、热门歌手、最新音乐三个模块

![index](https://ws1.sinaimg.cn/large/006cedGGgy1fzlk0ma7b4j309h0g3whj.jpg)

- 可在搜索页面搜索歌手、歌曲、歌单，并将搜索结果实时展示，同时展示历史搜索信息

![search](https://ws1.sinaimg.cn/large/006cedGGgy1fzlk1ao9ugj309h0gvq3w.jpg)

- 歌单页面，可查看歌单基本信息，所属歌曲，并跳转到歌曲播放页面

![playlist](https://ws1.sinaimg.cn/large/006cedGGgy1fzlk0zm2jdj309h0gvdi2.jpg)

- 歌手页面，可查看歌手基本信息，所属歌曲，并跳转到歌曲播放页面

![singer](https://ws1.sinaimg.cn/large/006cedGGgy1fzlk1nehkrj309h0hewlw.jpg)

- 歌曲播放页面，可播放、暂停，支持歌词滚动、调节歌曲播放进度

![song](https://ws1.sinaimg.cn/large/006cedGGgy1fzlk1uzxqjj309h0gv0xk.jpg)

**所用技术栈**：

jQuery / 七牛 / leanCloud / ajax

**收获知识**：

- 加深对于发布-订阅者模式的理解，熟悉 eventHub 的使用

- 加深对于 MVC 思想的理解，了解其和与 MVVM 思想（如 Vue）之间的差异

- 了解更多 jQuery 的 API

- 了解了音频（audio 元素）播放事件（通过 audio 的 API 实现了歌词滚动、歌曲播放进度调整等）

- 熟悉对于 leanCloud 的使用（增删改查）

---

以下是项目完成过程中所做的笔记：

## [完成一个音乐客户端 - 1](https://github.com/no1harm/Neteasy-music-demo/blob/master/docs/1-1.md)

关键词：leanCloud / 七牛 / nodejs / uptoken / upload / 获取文件外链 / encodeURIComponent / encodeURI / eventHub / on / emit / Object.assign / 深拷贝 / 存储 / 更新歌曲

内容包括：

- 如何初始化 leanCloud 实例

- 七牛上传文件的基本设置

- 如何获取七牛上传文件的外链

- encodeURI 与 encodeURIComponent 的区别

- 如何通过 eventHub 传递信息

- 使用 Object.assign() 进行对象属性更新

- 进行数据传递时注意选择深拷贝 `JSON.parse(JSON.stringify(data))`

- 使用 leanCloud 存储/更新对象

## [完成一个音乐客户端 - 2](https://github.com/no1harm/Neteasy-music-demo/blob/master/docs/1-2.md)

关键词：import / Module / window.location.search / URL / substring / filter / split / audio / play / pause / filter / blur / ended / 歌词滚动 / 正则表达式 / data- / match / setAttribute / timeupdate / currentTime / getBoundingClientRect / alert / 移动端调试 / onerror / console.log / vConsole

内容包括：

- 如何在项目中未使用 webpack 的情况下中模拟模块化导入

- 通过 URL 参数获取数据（`window.location.search`）

- 使用 leanCloud 获取对象

- 如何设置背景模糊（`filter:blur()`）

- audio 的播放与暂停

- 如何通过 audio 的 timeupdate 事件实现歌词滚动

- 项目如何在移动端调试

- window.onerror() 在调试中的使用方式

- 如何使用 vConsole

## [完成一个音乐客户端 - 3](https://github.com/no1harm/Neteasy-music-demo/blob/master/docs/1-3.md)

关键词： 一对多 / Promise 遍历 / Promise.all() / 获取表单数据 / reduce / checkbox / 数据获取重复 / keypress / keyCode / focus / blur / leanCloud 关键字查询 / 高度自适应 / contenteditable / audio 歌曲进度条 / loadedmetadata / 歌曲时长 / 进度条拖拽功能 / 隐藏滚动条 /

内容包括：

- 在 leanCloud 中使用一对多绑定歌曲到歌单

- 遍历中生成 Promise 对象该怎么处理（`Promise.all()`）

- 使用 reduce 获取表单数据

- 如何使用 jQuery 获取/设置 checkbox 的值

- 在遍历中数据设置重复的问题

- 输入框在 focus 和 blur 状态下的 placeholder 的切换

- 搜索功能的实现（输入值的获取/过滤）

- 使用 leanCloud 根据字符串查询对象，进行搜索

- 使用 jQuery 清空输入框并设置焦点

- CSS 设置评论框随评论内容增加高度自适应（`contenteditable="true"`）

- 实现歌曲进度条思路（包括进度显示，进度条拖拽调整歌曲进度）

- 获取音频时长为 NaN 的解决方法（监听 audio 的 loadedmetadata）

- 使用 CSS 如何隐藏滚动条

- 使用 localStorage 实现搜索历史展示

## [完成一个音乐客户端 - 4](https://github.com/no1harm/Neteasy-music-demo/blob/master/docs/1-4.md)

关键词： 优化 / 单页面 / url hash / history.back / XSS / loading / loaders.css / 多对多

- 如何返回上一页而不刷新（单页面应用/url hash）

- 判断输入字符合法化

- 使用 loaders.css 制作 loading 动画

- 清除搜索历史功能

- 如何使用中间表实现多对多（一个歌单内有多首歌曲，一首歌曲可以同时存在多个歌单内）
