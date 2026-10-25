(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");

  function closeMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      nav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Reveal content as it enters the viewport; respect reduced-motion preferences.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Update footer year automatically.
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Static-hosting-friendly application form: validates and prepares an email draft.
  const joinForm = document.querySelector("#join-form");
  const joinStatus = document.querySelector("#join-status");
  if (joinForm) {
    joinForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!joinForm.reportValidity()) return;

      const data = new FormData(joinForm);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const interest = String(data.get("interest") || "").trim();
      const message = String(data.get("message") || "").trim();

      const subject = encodeURIComponent(`Akshaya team interest — ${name}`);
      const body = encodeURIComponent(
        `Hello Akshaya team,\\n\\nI would like to express my interest in contributing to Akshaya.\\n\\n` +
        `Name: ${name}\\nEmail: ${email}\\nArea of interest: ${interest}\\n` +
        `Skills and availability: ${message || "Not provided"}\\n\\nThank you.`
      );
      const mailto = `mailto:akshaya.admininfo@gmail.com?subject=${subject}&body=${body}`;

      if (joinStatus) joinStatus.textContent = "Opening your email app with the application details. Please review and send the email to complete your application.";
      window.location.href = mailto;
    });
  }

  // Gallery cards are intentionally placeholders until approved event photos are supplied.
  const toast = document.querySelector("#gallery-toast");
  let toastTimeout;
  document.querySelectorAll("[data-gallery]").forEach(tile => {
    tile.addEventListener("click", () => {
      if (!toast) return;
      toast.textContent = `“${tile.dataset.gallery}” is a placeholder. Add approved Akshaya photos to publish this gallery.`;
      toast.classList.add("show");
      window.clearTimeout(toastTimeout);
      toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 3200);
    });
  });
})();
