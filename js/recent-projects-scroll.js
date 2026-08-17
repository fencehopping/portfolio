(function () {
  var track = document.querySelector("[data-recent-projects-track]");
  if (!track) {
    return;
  }

  function getCardStep() {
    var card = track.querySelector(".recent-project-card");
    if (!card) {
      return 320;
    }

    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap || "24");
    return card.getBoundingClientRect().width + gap;
  }

  document.querySelectorAll("[data-scroll-direction]").forEach(function (button) {
    button.addEventListener("click", function () {
      var direction = button.getAttribute("data-scroll-direction") === "left" ? -1 : 1;
      track.scrollBy({
        left: getCardStep() * direction,
        behavior: "smooth"
      });
    });
  });
})();
