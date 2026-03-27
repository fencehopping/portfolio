(function () {
  var form = document.getElementById("wf-form-Contact-01-form");
  if (!form) {
    return;
  }

  function valueFor(id) {
    var field = document.getElementById(id);
    return field ? field.value.trim() : "";
  }

  function toggleState(formState) {
    var done = form.parentElement.querySelector(".w-form-done");
    var fail = form.parentElement.querySelector(".w-form-fail");

    if (done) {
      done.style.display = formState === "done" ? "block" : "none";
    }
    if (fail) {
      fail.style.display = formState === "fail" ? "block" : "none";
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = valueFor("Contact-01-name");
    var email = valueFor("Contact-01-email");
    var message = valueFor("Contact-01-message");

    if (!name || !email || !message) {
      toggleState("fail");
      return;
    }

    var subject = "Portfolio inquiry from " + name;
    var body = [
      "Name: " + name,
      "Email: " + email,
      "",
      message
    ].join("\n");

    var mailtoUrl =
      "mailto:nickholroyd@gmail.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);

    toggleState("done");
    window.location.href = mailtoUrl;
  });
})();
