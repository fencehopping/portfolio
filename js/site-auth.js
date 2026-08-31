(function () {
  var STORAGE_KEY = "pdp-authenticated";
  var PASSWORD_HASH = "6c862b9a82dbd6f8b0d2ac9e60b083c2073071bc7e27a1b125e423df7862f139";
  var GATE_PATH = "access.html";

  function normalizePath(path) {
    if (!path) {
      return "index.html";
    }

    var cleanPath = path.split("#")[0].split("?")[0];
    if (!cleanPath || cleanPath === "/") {
      return "index.html";
    }

    var parts = cleanPath.split("/");
    var fileName = parts[parts.length - 1];
    return fileName || "index.html";
  }

  function getCurrentPath() {
    return normalizePath(window.location.pathname);
  }

  function isGatePage() {
    return getCurrentPath() === GATE_PATH;
  }

  function isAuthenticated() {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function setAuthenticated() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "true");
    } catch (error) {
      return false;
    }
    return true;
  }

  function buildGateUrl(targetPath) {
    var gateUrl = new URL(GATE_PATH, window.location.href);
    gateUrl.searchParams.set("redirect", targetPath || "index.html");
    return gateUrl.toString();
  }

  function redirectToGate() {
    var targetPath = getCurrentPath();
    if (targetPath === GATE_PATH) {
      targetPath = "index.html";
    }
    window.location.replace(buildGateUrl(targetPath));
  }

  async function sha256(value) {
    var data = new TextEncoder().encode(value);
    var digest = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map(function (byte) {
        return byte.toString(16).padStart(2, "0");
      })
      .join("");
  }

  function showMessage(form, selector) {
    var done = form.parentElement.querySelector(".w-form-done");
    var fail = form.parentElement.querySelector(".w-form-fail");

    if (done) {
      done.style.display = selector === "done" ? "block" : "none";
    }
    if (fail) {
      fail.style.display = selector === "fail" ? "block" : "none";
    }
  }

  async function handleGatePage() {
    if (!isGatePage()) {
      return;
    }

    var form = document.getElementById("password-form");
    var input = document.getElementById("site-password");
    if (!form || !input) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var redirectTarget = normalizePath(params.get("redirect") || "index.html");

    if (isAuthenticated()) {
      window.location.replace(redirectTarget);
      return;
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      var password = input.value.trim();
      if (!password) {
        showMessage(form, "fail");
        return;
      }

      try {
        var submittedHash = await sha256(password);
        if (submittedHash === PASSWORD_HASH) {
          setAuthenticated();
          showMessage(form, "done");
          window.location.replace(redirectTarget);
          return;
        }
      } catch (error) {
        // If crypto fails, fall through to the error state.
      }

      input.focus();
      input.select();
      showMessage(form, "fail");
    });
  }

  function protectPage() {
    if (isGatePage()) {
      return;
    }

    if (!isAuthenticated()) {
      redirectToGate();
    }
  }

  protectPage();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleGatePage);
  } else {
    handleGatePage();
  }
})();
