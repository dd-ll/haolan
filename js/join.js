/**
 * 加入我们 — 投递表单校验
 * 无后端：校验通过后 localStorage 暂存 + 成功提示 + 可选 mailto
 */
(function () {
  "use strict";

  var HR_EMAIL = "hr@example.com";
  var STORAGE_KEY = "haolan_join_applications";

  var form = document.getElementById("join-apply-form");
  if (!form) return;

  var nameInput = document.getElementById("join-name");
  var phoneInput = document.getElementById("join-phone");
  var positionSelect = document.getElementById("join-position");
  var resumeInput = document.getElementById("join-resume");
  var successEl = document.getElementById("join-form-success");
  var mailtoLink = document.getElementById("join-mailto-link");

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
      setError(nameInput, "join-name-error", "请填写姓名");
      return false;
    }
    if (value.length < 2) {
      setError(nameInput, "join-name-error", "姓名至少 2 个字符");
      return false;
    }
    setError(nameInput, "join-name-error", "");
    return true;
  }

  function validatePhone() {
    var value = (phoneInput.value || "").trim().replace(/\s+/g, "");
    if (!value) {
      setError(phoneInput, "join-phone-error", "请填写联系电话");
      return false;
    }
    if (!phonePattern.test(value)) {
      setError(phoneInput, "join-phone-error", "请输入有效的手机号或座机号");
      return false;
    }
    setError(phoneInput, "join-phone-error", "");
    return true;
  }

  function validatePosition() {
    var value = positionSelect.value || "";
    if (!value) {
      setError(positionSelect, "join-position-error", "请选择意向岗位");
      return false;
    }
    setError(positionSelect, "join-position-error", "");
    return true;
  }

  function validateResume() {
    var value = (resumeInput.value || "").trim();
    if (!value) {
      setError(resumeInput, "join-resume-error", "请填写简历说明或经历简述");
      return false;
    }
    if (value.length < 10) {
      setError(resumeInput, "join-resume-error", "请至少写 10 个字，便于我们了解您");
      return false;
    }
    setError(resumeInput, "join-resume-error", "");
    return true;
  }

  function buildMailto(data) {
    var subject = "皓镧资产-简历投递-" + data.position + "-" + data.name;
    var body =
      "姓名：" +
      data.name +
      "\n电话：" +
      data.phone +
      "\n意向岗位：" +
      data.position +
      "\n\n简历说明：\n" +
      data.resume +
      "\n\n（请将简历附件一并发送）";
    return (
      "mailto:" +
      HR_EMAIL +
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
      position: data.position,
      resume: data.resume,
      savedAt: new Date().toISOString(),
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      /* 存储失败不影响投递引导 */
    }
  }

  function showSuccess(data, mailtoHref) {
    if (!successEl) return;
    successEl.hidden = false;
    successEl.innerHTML =
      "信息已校验并暂存至本机。请将简历发送至 <strong>" +
      HR_EMAIL +
      "</strong>（待替换正式邮箱）。" +
      ' <a href="' +
      mailtoHref +
      '">打开邮件客户端</a> 可自动带入您填写的内容。';
  }

  /* 岗位卡「投递此岗」预填 */
  document.querySelectorAll("[data-job-apply]").forEach(function (link) {
    link.addEventListener("click", function () {
      var job = link.getAttribute("data-job-apply");
      if (job && positionSelect) {
        positionSelect.value = job;
        setError(positionSelect, "join-position-error", "");
      }
    });
  });

  nameInput.addEventListener("blur", validateName);
  phoneInput.addEventListener("blur", validatePhone);
  positionSelect.addEventListener("change", validatePosition);
  resumeInput.addEventListener("blur", validateResume);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var okName = validateName();
    var okPhone = validatePhone();
    var okPosition = validatePosition();
    var okResume = validateResume();

    if (!(okName && okPhone && okPosition && okResume)) {
      var firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim().replace(/\s+/g, ""),
      position: positionSelect.value,
      resume: resumeInput.value.trim(),
    };

    saveLocal(data);

    var mailtoHref = buildMailto(data);
    if (mailtoLink) mailtoLink.setAttribute("href", mailtoHref);
    showSuccess(data, mailtoHref);
    successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
