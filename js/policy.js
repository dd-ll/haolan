/**
 * ???????? Tab ?? +??????
 */
(function () {
  "use strict";

  /* ???? */
  document.querySelectorAll("[data-policy-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".policy-item");
      if (!item) return;
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ???? Tab */
  var tabBtns = document.querySelectorAll("[data-knowledge-tab]");
  var panels = document.querySelectorAll("[data-knowledge-panel]");

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-knowledge-tab");
      tabBtns.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      panels.forEach(function (panel) {
        var active = panel.getAttribute("data-knowledge-panel") === id;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });

  /* ????????? 2 ????? */
  document.querySelectorAll("[data-load-more]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panelId = btn.getAttribute("data-load-more");
      var panel = document.querySelector('[data-knowledge-panel="' + panelId + '"]');
      if (!panel) return;
      var hidden = panel.querySelectorAll(".knowledge-card.is-hidden");
      var showCount = 2;
      for (var i = 0; i < hidden.length && i < showCount; i++) {
        hidden[i].classList.remove("is-hidden");
      }
      if (panel.querySelectorAll(".knowledge-card.is-hidden").length === 0) {
        btn.hidden = true;
      }
    });
  });
})();
