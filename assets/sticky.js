/* 顶部导航滚动吸顶 / 滚动后收紧 —— 全站共享 */
(function () {
  'use strict';
  var bar = document.querySelector('.topbar');
  if (!bar) return;

  var THRESHOLD = 24;
  var ticking = false;

  function update() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (y > THRESHOLD) bar.classList.add('compact');
    else bar.classList.remove('compact');
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
