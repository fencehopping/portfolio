(function () {
  var carousel = document.querySelector("[data-recent-carousel]");
  if (!carousel) {
    return;
  }

  var track = carousel.querySelector("[data-recent-projects-track]");
  var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-slide]"));
  var indexLabel = carousel.querySelector("[data-carousel-index]");
  var totalLabel = carousel.querySelector("[data-carousel-total]");
  var activeIndex = 0;
  var touchStartX = 0;
  var isAnimating = false;
  var pendingResetIndex = null;
  var transitionTimer = null;

  if (!slides.length || !track) {
    return;
  }

  var firstClone = slides[0].cloneNode(true);
  var lastClone = slides[slides.length - 1].cloneNode(true);

  [firstClone, lastClone].forEach(function (clone) {
    clone.setAttribute("data-carousel-clone", "true");
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("[id]").forEach(function (element) {
      element.removeAttribute("id");
    });
    clone.querySelectorAll("a, button").forEach(function (control) {
      control.setAttribute("tabindex", "-1");
    });
  });

  track.insertBefore(lastClone, slides[0]);
  track.appendChild(firstClone);

  var visualSlides = Array.prototype.slice.call(track.querySelectorAll("[data-carousel-slide]"));

  function formatIndex(index) {
    return String(index + 1).padStart(2, "0");
  }

  function updateSlideState(visualIndex) {
    visualSlides.forEach(function (slide, index) {
      slide.classList.toggle("is-active", index === visualIndex);
    });

    slides.forEach(function (slide, index) {
      var isCurrent = index === activeIndex;
      slide.setAttribute("aria-hidden", isCurrent ? "false" : "true");

      slide.querySelectorAll("a, button").forEach(function (control) {
        control.setAttribute("tabindex", isCurrent ? "0" : "-1");
      });
    });
  }

  function setTrackPosition(visualIndex, animate) {
    if (!animate) {
      track.style.transition = "none";
    }

    track.style.transform = "translate3d(" + (-100 * visualIndex) + "%, 0, 0)";

    if (!animate) {
      track.offsetHeight;
      track.style.removeProperty("transition");
    }
  }

  function completeTransition() {
    window.clearTimeout(transitionTimer);

    if (pendingResetIndex !== null) {
      updateSlideState(pendingResetIndex);
      setTrackPosition(pendingResetIndex, false);
      pendingResetIndex = null;
    }

    isAnimating = false;
  }

  function moveBy(direction) {
    if (isAnimating) {
      return;
    }

    isAnimating = true;

    if (direction > 0 && activeIndex === slides.length - 1) {
      activeIndex = 0;
      pendingResetIndex = 1;
      updateSlideState(visualSlides.length - 1);
      setTrackPosition(visualSlides.length - 1, true);
    } else if (direction < 0 && activeIndex === 0) {
      activeIndex = slides.length - 1;
      pendingResetIndex = slides.length;
      updateSlideState(0);
      setTrackPosition(0, true);
    } else {
      activeIndex += direction;
      updateSlideState(activeIndex + 1);
      setTrackPosition(activeIndex + 1, true);
    }

    if (indexLabel) {
      indexLabel.textContent = formatIndex(activeIndex);
    }

    transitionTimer = window.setTimeout(completeTransition, 900);
  }

  track.addEventListener("transitionend", function (event) {
    if (event.propertyName === "transform") {
      completeTransition();
    }
  });

  carousel.querySelectorAll("[data-carousel-direction]").forEach(function (button) {
    button.addEventListener("click", function () {
      var direction = button.getAttribute("data-carousel-direction") === "previous" ? -1 : 1;
      moveBy(direction);
    });
  });

  carousel.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      moveBy(-1);
    }

    if (event.key === "ArrowRight") {
      moveBy(1);
    }
  });

  carousel.addEventListener("touchstart", function (event) {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener("touchend", function (event) {
    var distance = event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(distance) < 50) {
      return;
    }

    moveBy(distance < 0 ? 1 : -1);
  }, { passive: true });

  if (totalLabel) {
    totalLabel.textContent = String(slides.length).padStart(2, "0");
  }

  carousel.setAttribute("tabindex", "0");
  updateSlideState(1);
  setTrackPosition(1, false);
})();
