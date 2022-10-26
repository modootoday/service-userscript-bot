// ==UserScript==
// @namespace    https://bot.datalab.tools
// @name         품앗이봇 확장 프로그램
// @description  품앗이봇에 고급 기능을 추가합니다.
// @copyright    2022, modoo.today
// @license      Apache-2.0
// @version      2.0.2
// @author       https://modoo.today
// @updateURL    https://modootoday.github.io/service-userscript-bot/loader.user.js
// @downloadURL  https://modootoday.github.io/service-userscript-bot/loader.user.js
// @connect      *
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://bot.datalab.tools/monkey/gm-add-script.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.33/moment-timezone.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/eventemitter3/4.0.7/index.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/smooth-scroll/16.1.3/smooth-scroll.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/smooth-scroll/16.1.3/smooth-scroll.polyfills.min.js
// ==/UserScript==

// ==OpenUserJS==
// @author naverians
// ==/OpenUserJS==
(function(window) {
    (window.__tools_datalab_bot__ = true, GM_addScript(()=>window.__tools_datalab_bot__ = true));
    async function scrolls$action() {
        const animateScrollPromise = (selector, options) => {
            const scroll = new SmoothScroll();
            return new Promise((resolve) => {
                function handler() { document.removeEventListener('scrollStop', handler, false); resolve(); }
                document.addEventListener('scrollStop', handler, false);
                scroll.animateScroll(selector, options);
            })
        }
        const animateScrollElements = async () => {
            const element = _.sample(document.querySelectorAll('[id]'));
            await animateScrollPromise(element, {
                speedAsDuration: true,
                speed: _.random(30000, 60000),
                speedAsDuration: true,
                easing: _.sample(['Linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint']),
                topOnEmptyHash: false,
                updateURL: false,
                popstate: false,
            })
            await Promise.delay(_.random(500, 5000));
            return animateScrollElements();
        }
        return animateScrollElements();
    }
    async function message$action(event) {
        const { action, data } = Object.assign({}, event.data);
        if(location.origin == 'https://bot.datalab.tools') {
            if(action == 'bot:open') {
                if(window.__tools_datalab_bot__) {
                    GM_setValue('bot.datalab.tools:idx', 0);
                    GM_setValue('bot.datalab.tools:ref', data.ref);
                    GM_setValue('bot.datalab.tools:dst', data.dst);
                    window.tabUrl = new URL(`/${data.ref || data.dst}`, location.origin);
                    try { window.tab = window.tab && window.tab.close(); } finally { window.tab = undefined; }
                    window.tab = GM_openInTab(window.tabUrl.toString(), { active: true, setParent: true });
                    window.tab.name = '__tools_datalab_bot__';
                }
            }
            if(action == 'bot:exit') {
                if(window.__tools_datalab_bot__) {
                    try { window.tab = window.tab && window.tab.close(); } finally { window.tab = undefined; }
                }
            }
        }
    }
    if(window.name == '__tools_datalab_bot__' && location.origin != 'https://bot.datalab.tools') {
        let idx = Number(GM_getValue('bot.datalab.tools:idx', 0));
        let ref = String(GM_getValue('bot.datalab.tools:ref', ''));
        let dst = String(GM_getValue('bot.datalab.tools:dst', ''));
        function idx0 () {
            if(!ref) {
                GM_setValue('bot.datalab.tools:idx', 1);
                return idx1();
            }
            setTimeout(()=>{
                GM_setValue('bot.datalab.tools:idx', 1);
                const next = _.sample(Array.from(document.querySelectorAll('a')).filter(link=>(link.href == dst) || link.href.includes(dst) || dst.includes(link.href)));
                if(!next) { location.href = dst; } else { next.target="_top"; next.click(); }
            }, 1000 * 5);
            scrolls$action();
        }
        function idx1 () {
            setTimeout(()=>{
                GM_setValue('bot.datalab.tools:idx', 2);
                window.postMessage({ action: 'bot.exit' }, '*');
            }, 1000 * 60 * 5);
            scrolls$action();
        }
        if(idx == 0) { idx0(); }else if(idx == 1) { idx1(); }else { window.postMessage({ action: 'bot.exit' }, '*') };
        setTimeout(()=>window.postMessage({ action: 'bot.exit' }, '*'), 1000 * 60 * 10);
    }
    window.addEventListener('message', (event) => (message$action(event), true), false);
})(window);
