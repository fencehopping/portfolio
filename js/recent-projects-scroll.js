(function () {
  var carousel = document.querySelector("[data-recent-carousel]");
  if (!carousel) {
    return;
  }

  var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-slide]"));
  var indexLabel = carousel.querySelector("[data-carousel-index]");
  var totalLabel = carousel.querySelector("[data-carousel-total]");
  var activeIndex = 0;
  var touchStartX = 0;

  if (!slides.length) {
    return;
  }

  function formatIndex(index) {
    return String(index + 1).padStart(2, "0");
  }

  function showSlide(nextIndex) {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach(function (slide, index) {
      var isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");

      slide.querySelectorAll("a, button").forEach(function (control) {
        control.setAttribute("tabindex", isActive ? "0" : "-1");
      });
    });

    carousel.querySelector("[data-recent-projects-track]").style.transform = "translate3d(" + (-100 * activeIndex) + "%, 0, 0)";

    if (indexLabel) {
      indexLabel.textContent = formatIndex(activeIndex);
    }
  }

  carousel.querySelectorAll("[data-carousel-direction]").forEach(function (button) {
    button.addEventListener("click", function () {
      var direction = button.getAttribute("data-carousel-direction") === "previous" ? -1 : 1;
      showSlide(activeIndex + direction);
    });
  });

  carousel.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      showSlide(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showSlide(activeIndex + 1);
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

    showSlide(activeIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });

  if (totalLabel) {
    totalLabel.textContent = String(slides.length).padStart(2, "0");
  }

  carousel.setAttribute("tabindex", "0");
  showSlide(0);
})();
