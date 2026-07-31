/**
 * 短视频专区：分类筛选 + 弹层播放
 */
(function () {
  "use strict";

  var filterBtns = document.querySelectorAll("[data-video-filter]");
  var cards = document.querySelectorAll("[data-video-card]");
  var emptyHint = document.querySelector("[data-video-empty]");
  var modal = document.querySelector("[data-video-modal]");
  var modalTitle = document.querySelector("[data-video-modal-title]");
  var modalDesc = document.querySelector("[data-video-modal-desc]");
  var modalVideo = document.querySelector("[data-video-modal-video]");
  var modalPlaceholder = document.querySelector("[data-video-modal-placeholder]");
  var modalCloseEls = document.querySelectorAll("[data-video-modal-close]");
  var lastFocus = null;

  function applyFilter(category) {
    var visible = 0;
    cards.forEach(function (card) {
      var match = category === "all" || card.getAttribute("data-category") === category;
      card.classList.toggle("is-hidden", !match);
      if (match) visible += 1;
    });
    if (emptyHint) {
      emptyHint.classList.toggle("is-visible", visible === 0);
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var category = btn.getAttribute("data-video-filter") || "all";
      filterBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      applyFilter(category);
    });
  });

  function openModal(card) {
    if (!modal || !modalVideo) return;
    lastFocus = document.activeElement;

    var title = card.getAttribute("data-title") || "视频播放";
    var desc = card.getAttribute("data-desc") || "";
    var src = card.getAttribute("data-src") || "";
    var poster = card.getAttribute("data-poster") || "";

    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.querySelectorAll("source").forEach(function (s) {
      s.remove();
    });

    if (src) {
      modalVideo.poster = poster;
      modalVideo.src = src;
      modalVideo.style.display = "block";
      if (modalPlaceholder) modalPlaceholder.classList.remove("is-visible");
      modalVideo.load();
      var playPromise = modalVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          /* 自动播放可能被拦截，保留控件供手动播放 */
        });
      }
    } else {
      modalVideo.removeAttribute("poster");
      modalVideo.style.display = "none";
      if (modalPlaceholder) modalPlaceholder.classList.add("is-visible");
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var closeBtn = modal.querySelector(".video-modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal || !modalVideo) return;
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  document.querySelectorAll("[data-video-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest("[data-video-card]");
      if (card) openModal(card);
    });
  });

  modalCloseEls.forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.hidden) {
      closeModal();
    }
  });
})();
