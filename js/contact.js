/**
 * 联系我们 — 留言表单校验
 * 无后端方案：成功提示 + localStorage 暂存 + mailto 引导 + console 打印
 */
(function () {
  "use strict";

  var SERVICE_EMAIL = "service@example.com";
  var STORAGE_KEY = "haolan_contact_messages";

  var form = document.getElementById("contact-message-form");
  if (!form) return;

  var nameInput = document.getElementById("contact-name");
  var phoneInput = document.getElementById("contact-phone");
  var contentInput = document.getElementById("contact-content");
  var successEl = document.getElementById("contact-form-success");
  var mailtoLink = document.getElementById("contact-mailto-link");

  var phonePattern = /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$|^\d{7,12}$/;

  function setError(input, errorId, message) {
    var err = document.getElementById(errorId);
    if (!err) return;
    if (message) {
      err.textContent = message;
      err.hidden = false;
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
    } else {
      err.textContent = "";
      err.hidden = true;
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
    }
  }

  function validateName() {
    var value = (nameInput.value || "").trim();
    if (!value) {
      setError(nameInput, "contact-name-error", "请填写姓名");
      return false;
    }
    if (value.length < 2) {
      setError(nameInput, "contact-name-error", "姓名至少 2 个字符");
      return false;
    }
    setError(nameInput, "contact-name-error", "");
    return true;
  }

  function validatePhone() {
    var value = (phoneInput.value || "").trim().replace(/\s+/g, "");
    if (!value) {
      setError(phoneInput, "contact-phone-error", "请填写联系方式");
      return false;
    }
    if (!phonePattern.test(value)) {
      setError(phoneInput, "contact-phone-error", "请输入有效的手机号或座机号");
      return false;
    }
    setError(phoneInput, "contact-phone-error", "");
    return true;
  }

  function validateContent() {
    var value = (contentInput.value || "").trim();
    if (!value) {
      setError(contentInput, "contact-content-error", "请填写咨询内容");
      return false;
    }
    if (value.length < 10) {
      setError(contentInput, "contact-content-error", "请至少写 10 个字，便于我们了解需求");
      return false;
    }
    setError(contentInput, "contact-content-error", "");
    return true;
  }

  function buildMailto(data) {
    var subject = "皓镧资产-在线留言-" + data.name;
    var body =
      "姓名：" +
      data.name +
      "\n联系方式：" +
      data.phone +
      "\n\n咨询内容：\n" +
      data.content;
    return (
      "mailto:" +
      SERVICE_EMAIL +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  function saveLocal(data) {
    var list = [];
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) list = JSON.parse(raw) || [];
    } catch (e) {
      list = [];
    }
    list.push({
      name: data.name,
      phone: data.phone,
      content: data.content,
      savedAt: new Date().toISOString(),
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      /* ignore */
    }
  }

  function showSuccess(mailtoHref) {
    if (!successEl) return;
    successEl.hidden = false;
    successEl.innerHTML =
      "留言已校验并暂存至本机。请通过官方电话或邮件联系我们（邮箱待替换：<strong>" +
      SERVICE_EMAIL +
      "</strong>）。" +
      ' <a href="' +
      mailtoHref +
      '">打开邮件客户端</a> 可自动带入内容。';
  }

  nameInput.addEventListener("blur", validateName);
  phoneInput.addEventListener("blur", validatePhone);
  contentInput.addEventListener("blur", validateContent);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var okName = validateName();
    var okPhone = validatePhone();
    var okContent = validateContent();

    if (!(okName && okPhone && okContent)) {
      var firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim().replace(/\s+/g, ""),
      content: contentInput.value.trim(),
    };

    saveLocal(data);
    if (typeof console !== "undefined" && console.log) {
      console.log("[皓镧资产] 留言暂存（无后端）", data);
    }

    var mailtoHref = buildMailto(data);
    if (mailtoLink) mailtoLink.setAttribute("href", mailtoHref);
    showSuccess(mailtoHref);
    successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
