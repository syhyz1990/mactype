// ==UserScript==
// @name              Mactype助手
// @namespace         https://github.com/syhyz1990/mactype
// @version           2.1.7
// @icon              https://www.baiduyun.wiki/mactype.png
// @description       Windows下的浏览器浏览网页时文字往往发虚，颜色很淡，看不清楚。有了它可以让浏览器中显示的文字更加清晰，支持Chrome ，360 ，QQ ，Firfox ，Edge  等浏览器。
// @author            YouXiaoHou
// @license           MIT
// @homepage          https://www.baiduyun.wiki/tool/install-mactype.html
// @supportURL        https://github.com/syhyz1990/mactype
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@10.15.6/dist/sweetalert2.min.js
// @resource          swalStyle https://cdn.jsdelivr.net/npm/sweetalert2@10.15.6/dist/sweetalert2.min.css
// @require           https://js.users.51.la/21053225.js
// @updateURL         https://www.baiduyun.wiki/mactype.user.js
// @downloadURL       https://www.baiduyun.wiki/mactype.user.js
// @match             *://*/*
// @run-at            document-start
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// ==/UserScript==

(function () {
    'use strict';

    const fixedStyle = ['www.baidu.com']; //弹出框错乱的网站css插入到<html>而非<head>
    const customClass = {
        container: 'mactype-container',
        popup: 'mactype-popup',
        header: 'mactype-header',
        title: 'mactype-title',
        closeButton: 'mactype-close',
        icon: 'mactype-icon',
        image: 'mactype-image',
        content: 'mactype-content',
        htmlContainer: 'mactype-html',
        input: 'mactype-input',
        inputLabel: 'mactype-inputLabel',
        validationMessage: 'mactype-validation',
        actions: 'mactype-actions',
        confirmButton: 'mactype-confirm',
        denyButton: 'mactype-deny',
        cancelButton: 'mactype-cancel',
        loader: 'mactype-loader',
        footer: 'mactype-footer'
    };

    let util = {
        getValue(name) {
            return GM_getValue(name);
        },
        setValue(name, value) {
            GM_setValue(name, value);
        },
        include(str, arr) {
            for (let i = 0, l = arr.length; i < l; i++) {
                let val = arr[i];
                if (val !== '' && str.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                    return true;
                }
            }
            return false;
        },
        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            let root = this.include(location.href, fixedStyle);
            root ? doc.documentElement.appendChild(style) : doc.getElementsByTagName('head')[0].appendChild(style);
        }
    };

    let main = {
        /**
         * 配置默认值
         */
        initValue() {
            let value = [{
                name: 'current_val',
                value: 0
            }, {
                name: 'has_init',
                value: false
            }, {
                name: 'white_list',
                value: []
            }];

            value.forEach((v) => {
                util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
            });
        },

        showSetting() {
            Swal.fire({
                title: '请选择清晰度',
                icon: 'info',
                input: 'range',
                showCancelButton: true,
                confirmButtonText: '保存',
                cancelButtonText: '还原',
                showCloseButton: true,
                inputLabel: '拖动滑块观察变化，数字越大字越清晰',
                customClass,
                footer: '<div style="text-align: center;font-size: 1em">点击查看 <a href="https://www.baiduyun.wiki/tool/install-mactype.html" target="_blank">使用说明</a>，配合 <a href="https://www.baiduyun.wiki/tool/install-mactype.html#增强显示" target="_blank">XHei字体</a> 更清晰，<a href="https://www.baiduyun.wiki/tool/install-mactype.html">检查更新</a><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M445.956 138.812L240.916 493.9c-11.329 19.528-12.066 44.214 0 65.123 12.067 20.909 33.898 32.607 56.465 32.607h89.716v275.044c0 31.963 25.976 57.938 57.938 57.938h134.022c32.055 0 57.938-25.975 57.938-57.938V591.63h83.453c24.685 0 48.634-12.803 61.806-35.739 13.172-22.844 12.343-50.016 0-71.386l-199.42-345.693c-13.633-23.58-39.24-39.516-68.44-39.516-29.198 0-54.897 15.935-68.438 39.516z" fill="#d81e06"/></svg></div>',
                inputAttributes: {
                    min: 0,
                    max: 1,
                    step: 0.05
                },
                inputValue: util.getValue('current_val')
            }).then((res) => {
                util.setValue('has_init', true);
                if (res.isConfirmed) {
                    util.setValue('current_val', res.value);
                    this.changeStyle();
                }
                if (res.isDismissed && res.dismiss === "cancel") {
                    util.setValue('current_val', 0);
                    this.changeStyle();
                }
            });

            document.getElementById('swal2-input').addEventListener('change', (e) => {
                util.setValue('current_val', e.target.value);
                this.changeStyle();
            });
        },

        registerMenuCommand() {
            let whiteList = util.getValue('white_list');
            let host = location.host;
            if (whiteList.includes(host)) {
                GM_registerMenuCommand('本站状态：已禁用', () => {
                    let index = whiteList.indexOf(host);
                    whiteList.splice(index, 1);
                    util.setValue('white_list', whiteList);
                    history.go(0);
                });
            } else {
                GM_registerMenuCommand('本站状态：已启用', () => {
                    whiteList.push(host);
                    util.setValue('white_list', whiteList);
                    history.go(0);
                });
            }
            GM_registerMenuCommand('设置', () => {
                this.showSetting();
            });
        },

        changeStyle() {
            let style = document.getElementById('mactype-style');
            style && style.remove();
            this.addPluginStyle();
        },

        addPluginStyle() {
            let val = util.getValue('current_val');
            let style = `
                .mactype-popup { font-size: 14px!important }
                *:not(pre) { -webkit-text-stroke: ${val}px !important; text-stroke: ${val}px !important }
                ::selection { color: #fff;background: #338fff }
            `;
            util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
            util.addStyle('mactype-style', 'style', style);

            window.onload = () => {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('mactype-style', 'style', style);
            };
        },

        isTopWindow() {
            return window.self === window.top;
        },

        init() {
            this.initValue();
            this.isTopWindow() && !util.getValue('has_init') && this.showSetting();
            this.isTopWindow() && this.registerMenuCommand();
            if (util.getValue('white_list').includes(location.host)) {
                return;
            }
            this.addPluginStyle();
        }
    };
    main.init();
})();
