/**
 * 全站公共交互：移动端导航菜单
 */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var overlay = document.querySelector(".nav-overlay");

  if (!header || !toggle || !nav) return;

  function openNav() {
    document.body.classList.add("is-nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "关闭菜单");
    if (overlay) overlay.hidden = false;
  }

  function closeNav() {
    document.body.classList.remove("is-nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "打开菜单");
    if (overlay) overlay.hidden = true;
  }

  function toggleNav() {
    if (document.body.classList.contains("is-nav-open")) {
      closeNav();
    } else {
      openNav();
    }
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleNav();
  });

  if (overlay) {
    overlay.addEventListener("click", closeNav);
  }

  nav.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (link && document.body.classList.contains("is-nav-open")) {
      closeNav();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("is-nav-open")) {
      closeNav();
      toggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 769px)").matches) {
      closeNav();
    }
  });
})();
