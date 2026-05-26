document.addEventListener("DOMContentLoaded", function () {
  const siteHeader = document.querySelector(".site-header");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const enquiryForm = document.querySelector("[data-enquiry-form]");
  const successMessage = document.querySelector("[data-success-message]");
  const formFeedback = enquiryForm ? enquiryForm.querySelector("[data-form-feedback]") : null;
  const submitButton = enquiryForm
    ? enquiryForm.querySelector('button[type="submit"]')
    : null;
  const counters = document.querySelectorAll("[data-counter]");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const activePage = currentPage === "thank-you.html" ? "contact.html" : currentPage;
  const formRedirectUrl = enquiryForm
    ? enquiryForm.dataset.formRedirect || "thank-you.html"
    : "thank-you.html";

  function setFormFeedback(message, isError) {
    if (!formFeedback) {
      return;
    }

    formFeedback.textContent = message;
    formFeedback.classList.toggle("text-muted", !isError);
  }

  function updateHeaderState() {
    if (!siteHeader) {
      return;
    }

    siteHeader.classList.toggle("is-scrolled", window.scrollY > 80);
  }

  function setActiveNavLink() {
    navLinks.forEach(function (link) {
      const target = link.getAttribute("href");
      const matchesIndex = currentPage === "" && target === "index.html";
      const matchesPage = target === activePage;

      link.classList.toggle("is-active", matchesIndex || matchesPage);
      if (matchesIndex || matchesPage) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function closeNav() {
    if (!navPanel || !navToggle) {
      return;
    }

    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    const icon = navToggle.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  }

  function toggleNav() {
    if (!navPanel || !navToggle) {
      return;
    }

    const isOpen = navPanel.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    const icon = navToggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-xmark", isOpen);
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", toggleNav);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) {
      closeNav();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length > 0) {
    const observer = new IntersectionObserver(
      function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -24px 0px",
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  if (enquiryForm && enquiryForm.getAttribute("action") === "#") {
    enquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (successMessage) {
        successMessage.classList.add("is-visible");
        successMessage.textContent =
          "Thank you for your enquiry. This demo form is configured for static hosting and can be connected to Formspree before launch.";
      } else {
        window.alert(
          "Thank you for your enquiry. Connect this form to Formspree before launch to receive submissions."
        );
      }

      enquiryForm.reset();
    });
  } else if (enquiryForm) {
    enquiryForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const defaultButtonLabel = submitButton ? submitButton.textContent : "";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      setFormFeedback("Sending your enquiry...", false);

      try {
        const response = await fetch(enquiryForm.action, {
          method: enquiryForm.method,
          body: new FormData(enquiryForm),
          headers: {
            Accept: "application/json",
          },
        });

        let responseData = null;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          responseData = await response.json();
        }

        if (!response.ok) {
          const errorMessage =
            responseData && Array.isArray(responseData.errors) && responseData.errors.length > 0
              ? responseData.errors.map(function (error) {
                  return error.message;
                }).join(" ")
              : "There was a problem submitting your enquiry. Please try again.";

          throw new Error(errorMessage);
        }

        enquiryForm.reset();
        window.location.href = formRedirectUrl;
      } catch (error) {
        setFormFeedback(
          error instanceof Error
            ? error.message
            : "There was a problem submitting your enquiry. Please try again.",
          true
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultButtonLabel;
        }
      }
    });
  }

  function animateCounter(counter) {
    if (counter.dataset.counterAnimated === "true") {
      return;
    }

    counter.dataset.counterAnimated = "true";
    const target = Number(counter.dataset.counterTarget || "0");
    const suffix = counter.dataset.counterSuffix || "";
    const duration = 1400;
    const startTime = performance.now();

    function step(timestamp) {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      counter.textContent = value + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  if (counters.length > 0) {
    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            animateCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.6,
        }
      );

      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    } else {
      counters.forEach(animateCounter);
    }
  }

  setActiveNavLink();
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
});
