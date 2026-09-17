/* 皓镧资产官网 · 全站电话呼叫组件
 * 用法：任意元素加 data-tel="0762-3103909"（建议同时写 href="tel:..."，脚本未加载时也能直接拨号）
 * 脚本会自动注入样式与确认弹窗，点击后弹窗确认再拉起系统拨号，并提供复制号码。
 */
(function () {
  'use strict';

  /* ---------- 1. 注入样式 ---------- */
  if (!document.getElementById('hlCallStyle')) {
    var st = document.createElement('style');
    st.id = 'hlCallStyle';
    st.textContent =
      '.js-call { cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }\n' +
      'a.js-call { color: inherit; }\n' +
      'footer .js-call, .footer-info .js-call { color: #D4A574; }\n' +
      '.drawer-foot .js-call { color: #C8102E; font-weight: 600; }\n' +
      '.hl-call-mask {\n' +
      '  position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1400;\n' +
      '  background: rgba(20,28,40,.55); display: flex; align-items: center; justify-content: center;\n' +
      '  padding: 20px; opacity: 0; visibility: hidden; transition: opacity .22s;\n' +
      '}\n' +
      '.hl-call-mask.open { opacity: 1; visibility: visible; }\n' +
      '.hl-call-dialog {\n' +
      '  width: 100%; max-width: 340px; background: #fff; border-radius: 14px;\n' +
      '  border: 1.5px solid rgba(201,169,97,.6); box-shadow: 0 18px 50px rgba(20,28,40,.28);\n' +
      '  padding: 22px 18px 16px; text-align: center;\n' +
      '  transform: translateY(14px) scale(.96); transition: transform .22s;\n' +
      '}\n' +
      '.hl-call-mask.open .hl-call-dialog { transform: translateY(0) scale(1); }\n' +
      '.hl-call-icon {\n' +
      '  width: 52px; height: 52px; margin: 0 auto 14px; border-radius: 50%;\n' +
      '  display: flex; align-items: center; justify-content: center;\n' +
      '  background: linear-gradient(135deg, #E6C094 0%, #D4A574 100%); color: #fff;\n' +
      '}\n' +
      '.hl-call-icon svg { width: 24px; height: 24px; }\n' +
      '.hl-call-title { font-family: "STSong","SimSun",serif; font-size: 18px; color: #1F3A2E; letter-spacing: 1px; }\n' +
      '.hl-call-num {\n' +
      '  margin: 10px 0 4px; font-family: "STSong",serif; font-size: 26px;\n' +
      '  font-weight: 700; color: #C8102E; letter-spacing: 1px;\n' +
      '}\n' +
      '.hl-call-desc { font-size: 12px; color: #6B7280; line-height: 1.8; }\n' +
      '.hl-call-actions { display: flex; gap: 10px; margin-top: 18px; }\n' +
      '.hl-call-actions > * {\n' +
      '  flex: 1; height: 44px; border-radius: 8px; font-size: 15px; text-decoration: none;\n' +
      '  display: inline-flex; align-items: center; justify-content: center;\n' +
      '  font-family: inherit; cursor: pointer; transition: opacity .2s;\n' +
      '}\n' +
      '.hl-call-cancel { background: #fff; border: 1.5px solid rgba(201,169,97,.6); color: #1F3A2E; }\n' +
      '.hl-call-go {\n' +
      '  background: linear-gradient(135deg, #D4AF37 0%, #C9A961 100%);\n' +
      '  color: #fff; font-weight: 600; border: none;\n' +
      '}\n' +
      '.hl-call-copy {\n' +
      '  margin-top: 10px; width: 100%; height: 38px; border: none; background: none;\n' +
      '  font-family: inherit; font-size: 13px; color: #6B7280; cursor: pointer;\n' +
      '}\n' +
      '.hl-call-copy:hover { color: #C8102E; }\n' +
      '@media (max-width: 760px) {\n' +
      '  .hl-call-num { font-size: 23px; }\n' +
      '  .hl-call-dialog { padding: 20px 16px 14px; }\n' +
      '}';
    (document.head || document.documentElement).appendChild(st);
  }

  /* ---------- 2. 创建弹窗 ---------- */
  var mask, numEl, goEl, copyEl, cur = '';

  function build() {
    mask = document.createElement('div');
    mask.className = 'hl-call-mask';
    mask.id = 'hlCallMask';
    mask.innerHTML =
      '<div class="hl-call-dialog" role="dialog" aria-modal="true" aria-labelledby="hlCallTitle">' +
      '  <div class="hl-call-icon">' +
      '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
      '      <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>' +
      '    </svg>' +
      '  </div>' +
      '  <div class="hl-call-title" id="hlCallTitle">呼叫确认</div>' +
      '  <div class="hl-call-num"></div>' +
      '  <div class="hl-call-desc">工作时间：周一至周五 8:30–12:00、14:00–18:30<br />其他时段可添加客服微信留言</div>' +
      '  <div class="hl-call-actions">' +
      '    <button class="hl-call-cancel" type="button">取消</button>' +
      '    <button class="hl-call-go" type="button">立即呼叫</button>' +
      '  </div>' +
      '  <button class="hl-call-copy" type="button">复制号码</button>' +
      '</div>';
    document.body.appendChild(mask);

    numEl = mask.querySelector('.hl-call-num');
    goEl = mask.querySelector('.hl-call-go');
    copyEl = mask.querySelector('.hl-call-copy');

    mask.querySelector('.hl-call-cancel').addEventListener('click', close);
    goEl.addEventListener('click', function () {
      if (!cur) return;
      close();
      window.location.href = 'tel:' + cur;
    });
    copyEl.addEventListener('click', function () {
      var btn = this, txt = cur;
      function done() {
        btn.textContent = '已复制 ✓';
        setTimeout(function () { btn.textContent = '复制号码'; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = txt;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
    mask.addEventListener('click', function (e) {
      if (e.target === mask) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mask.classList.contains('open')) close();
    });
  }

  function open(tel) {
    if (!tel) return;
    cur = tel;
    numEl.textContent = tel;
    mask.classList.add('open');
    document.body.style.overflow = 'hidden';
    goEl.focus();
  }

  function close() {
    mask.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---------- 3. 事件委托：所有带 data-tel 的元素 ---------- */
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    build();

    document.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('[data-tel]') : null;
      if (!el) return;
      e.preventDefault();
      open(el.getAttribute('data-tel'));
    });

    // 键盘支持（非链接元素按 Enter / 空格）
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      var el = document.activeElement;
      if (!el || !el.getAttribute) return;
      if (el.tagName === 'A' || el.tagName === 'BUTTON') return;
      if (el.getAttribute('data-tel')) {
        e.preventDefault();
        open(el.getAttribute('data-tel'));
      }
    });
  });
})();
