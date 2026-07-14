(() => {
  const doc = document.documentElement;
  doc.classList.add("js");

  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const year = document.querySelector("[data-year]");
  const dialog = document.querySelector("[data-soon-dialog]");
  const soonTitle = document.querySelector("[data-soon-title]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeNav = () => {
    if (!header || !toggle) return;
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    if (!dialog?.open) doc.style.overflow = "";
  };

  const openNav = () => {
    if (!header || !toggle) return;
    header.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    doc.style.overflow = "hidden";
  };

  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.contains("nav-open");
      if (open) closeNav();
      else openNav();
    });
  }

  if (nav) {
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeNav());
    });
  }

  /* Coming Soon modal */
  let lastTrigger = null;

  const openSoon = (serviceName, trigger) => {
    if (!dialog) return;
    lastTrigger = trigger || null;
    closeNav();
    if (soonTitle) {
      soonTitle.textContent = serviceName || "Coming soon";
    }
    doc.style.overflow = "hidden";
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  };

  const closeSoon = () => {
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
    doc.style.overflow = "";
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  };

  document.querySelectorAll("[data-coming-soon]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      const name = el.getAttribute("data-service") || "This service";
      openSoon(name, el);
    });
  });

  document.querySelectorAll("[data-soon-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeSoon());
  });

  const homeBtn = document.querySelector("[data-soon-home]");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      closeSoon();
      const top = document.querySelector("#top");
      if (top) {
        top.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  }

  if (dialog) {
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeSoon();
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeSoon();
    });
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (dialog?.open) closeSoon();
      else closeNav();
    }
  });

  /* Scroll reveals */
  const reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    reveals.forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      observer.observe(el);
    });
  }
})();
