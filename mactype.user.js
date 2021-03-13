// ==UserScript==
// @name              Mactype助手
// @namespace         https://github.com/syhyz1990/mactype
// @version           2.0.6
// @icon              https://www.baiduyun.wiki/mactype.png
// @description       Windows下的浏览器浏览网页时文字往往发虚，颜色很淡，看不清楚。有了它可以让浏览器中显示的文字更加清晰，支持Chrome ，360 ，QQ ，Firfox ，Edge  等浏览器。
// @author            YouXiaoHou
// @license           MIT
// @homepage          https://www.baiduyun.wiki/tool/install-mactype.html
// @supportURL        https://github.com/syhyz1990/mactype
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@10.15.5/dist/sweetalert2.all.min.js
// @require           https://js.users.51.la/21053225.js
// @updateURL         https://www.baiduyun.wiki/mactype.user.js
// @downloadURL       https://www.baiduyun.wiki/mactype.user.js
// @match             *://*/*
// @noframes
// @run-at            document-start
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';
    let util = {
        getValue(name) {
            return GM_getValue(name);
        },
        setValue(name, value) {
            GM_setValue(name, value);
        },
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

        addStyle() {
            let val = util.getValue('current_val');
            const styleDom = document.getElementById('mactype-style');
            styleDom && styleDom.remove();
            let style = document.createElement('style');
            style.id = 'mactype-style';
            style.type = 'text/css';
            style.innerHTML = `.mactype-popup { font-size: 14px!important; } *:not(pre) {-webkit-text-stroke: ${val}px !important;text-stroke: ${val}px !important;} ::selection {color: #fff;background: #338fff;} ::-moz-selection {color: #fff;background: #338fff;}`;
            document.documentElement.appendChild(style);
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
                customClass: {
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
                },
                footer: '<div><div style="text-align: center;">点击这里查看 <a href="https://www.baiduyun.wiki/tool/install-mactype.html" target="_blank">使用说明</a>，配合 <a href="https://www.baiduyun.wiki/tool/install-mactype.html#增强显示" target="_blank">XHei字体</a> 更清晰</div><div style="margin-top: 5px;font-size: 12px;display: flex;align-items: center;color: #999;">（可点击 <svg style="margin: 0 5px;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024"><path d="M514.2 41.4c84.5 0 168.9-.7 253.4.3 45.3.5 86.7 15.4 123.5 42.1 37.6 27.2 64.1 62.8 79.8 106.4 8.5 23.6 13 48 13 73.2 0 166.7 1.4 333.5-.6 500.2-.9 78.3-37.5 139.9-103.7 182.8-38 24.6-80 35.1-125.1 35.1-161.3-.2-322.7.7-484-.4-92.9-.6-161.5-43.8-204.2-126.5-15-29-22.2-60.5-22.2-93.2-.2-167-.8-333.9.3-500.9.4-66.8 28.2-122.4 78.9-166.3 25-21.6 53.7-36.7 85.5-44.9 17.4-4.5 35.6-7.4 53.5-7.6 84-.8 168-.3 251.9-.3zm411.3 690.2c.8-103.6-82.9-191.6-191.1-191.5-106.7.1-190.9 85.1-191.3 191.5-.3 104.8 85.7 190.7 190.2 191.3 105.9.6 192.9-86.2 192.2-191.3zM293.8 540.5c-107.7.2-186.9 85.9-191.2 181.9-5.1 114.4 87.4 200.7 191.1 200.5 102.9-.2 191.3-83 191.4-191 .1-105.9-84.3-190.9-191.3-191.4z"/></svg> 图标 -> Mactype 助手 -> 设置 打开本页面）</div></div>',
                inputAttributes: {
                    min: 0,
                    max: 1.5,
                    step: 0.1
                },
                inputValue: util.getValue('current_val')
            }).then((res) => {
                util.setValue('has_init', true);
                if (res.isConfirmed) {
                    util.setValue('current_val', res.value);
                    this.addStyle();
                }
                if (res.isDismissed && res.dismiss === "cancel") {
                    util.setValue('current_val', 0);
                    this.addStyle();
                }
            });

            document.getElementById('swal2-input').addEventListener('change',(e)=>{
                util.setValue('current_val', e.target.value);
                this.addStyle();
            })
        },

        registerMenuCommand() {
            let whiteList = util.getValue('white_list');
            let host = location.host;
            if (whiteList.includes(host)) {
                GM_registerMenuCommand('本站状态：已禁用', () => {
                    let index = whiteList.indexOf(host);
                    whiteList.splice(index, 1);
                    util.setValue('white_list', whiteList)
                    history.go(0);
                });
            } else {
                GM_registerMenuCommand('本站状态：已启用', () => {
                    whiteList.push(host);
                    util.setValue('white_list', whiteList)
                    history.go(0);
                });
            }
            GM_registerMenuCommand('设置', () => {
                this.showSetting();
            });
        },

        init() {
            this.initValue()
            !util.getValue('has_init') && this.showSetting();
            this.registerMenuCommand();
            if (util.getValue('white_list').includes(location.host)) {
                return;
            }
            this.addStyle();
        }
    };
    main.init();
})();
