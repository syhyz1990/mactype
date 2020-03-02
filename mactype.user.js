// ==UserScript==
// @name              Mactype助手
// @namespace         https://github.com/syhyz1990/mactype
// @version           1.0.0
// @icon              https://www.baiduyun.wiki/mactype.png
// @description       配合 Mactype 实现Chrome，Edge等不支持关闭 DirectWrite 浏览器的字体渲染支持
// @author            syhyz1990
// @license           MIT
// @supportURL        https://github.com/syhyz1990/mactype
// @updateURL         https://www.baiduyun.wiki/mactype.user.js
// @downloadURL       https://www.baiduyun.wiki/mactype.user.js
// @match             *://*/*
// @run-at            document-start
// @grant             GM_addStyle
// ==/UserScript==

(function () {
  'use strict'
  GM_addStyle(`
    body,input,textarea {
        text-shadow: 0px 0px 1px #ACACAC;
    }
`)
})()
