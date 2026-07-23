(() => {
  const doc = document.documentElement;
  doc.classList.add("js");

  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const year = document.querySelector("[data-year]");
  const dialog = document.querySelector("[data-feature-dialog]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) year.textContent = String(new Date().getFullYear());

  /* Default dates for search forms */
  const setDefaultDates = () => {
    const today = new Date();
    const depart = new Date(today);
    depart.setDate(depart.getDate() + 14);
    const ret = new Date(depart);
    ret.setDate(ret.getDate() + 7);
    const checkIn = new Date(today);
    checkIn.setDate(checkIn.getDate() + 21);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 3);
    const fmt = (d) => d.toISOString().slice(0, 10);

    document.querySelectorAll('[data-search-panel="flights"] input[type="date"]').forEach((el, i) => {
      el.value = i === 0 ? fmt(depart) : fmt(ret);
    });
    document.querySelectorAll('[data-search-panel="hotels"] input[type="date"]').forEach((el, i) => {
      el.value = i === 0 ? fmt(checkIn) : fmt(checkOut);
    });
  };
  setDefaultDates();

  /* Header scroll */
  const setHeaderState = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  /* Mobile nav */
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

  toggle?.addEventListener("click", () => {
    header.classList.contains("nav-open") ? closeNav() : openNav();
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeNav());
  });

  /* Search tabs */
  const searchTabs = document.querySelectorAll("[data-search-tab]");
  const searchPanels = document.querySelectorAll("[data-search-panel]");

  searchTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("data-search-tab");
      searchTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      searchPanels.forEach((panel) => {
        const match = panel.getAttribute("data-search-panel") === id;
        panel.classList.toggle("is-active", match);
        panel.hidden = !match;
      });
    });
  });

  /* Feature content — professional placeholders */
  const featureData = {
    Flights: {
      image: "assets/hero-coast.jpg",
      status: "Online booking in progress",
      desc: "Our flight search engine is being connected to live airline inventory. Until then, our advisors can compare fares, seat options, and baggage rules for you — often at prices matching or beating online portals.",
      points: ["Domestic & international routes", "Multi-city and group bookings", "Seat selection & meal preferences", "24-hour fare hold on request"],
    },
    Hotels: {
      image: "assets/dest-hotel.jpg",
      status: "Hotel portal launching shortly",
      desc: "We are finalising partnerships with global hotel chains and boutique properties. Share your dates and budget — we will shortlist verified stays with breakfast, cancellation terms, and airport transfers included.",
      points: ["3★ to 5★ properties worldwide", "Honeymoon & family room blocks", "Early check-in requests", "Best-rate matching"],
    },
    "Holiday Packages": {
      image: "assets/dest-islands.jpg",
      status: "Package builder under development",
      desc: "Custom package creation will be available online soon. Today, our team builds end-to-end itineraries — flights, hotels, sightseeing, and visas — tailored to your pace and budget.",
      points: ["All-inclusive pricing", "Fixed departures & private tours", "Honeymoon & family themes", "Flexible payment plans"],
    },
    "Visa Assistance": {
      image: "assets/detail-travel.jpg",
      status: "Document portal coming online",
      desc: "Digital visa application tracking is on the way. Right now, we handle Schengen, UAE, UK, US, and tourist visas with document review, appointment booking, and status updates.",
      points: ["Document checklist & review", "Embassy appointment support", "Express processing where available", "Corporate & family applications"],
    },
    "International Tours": {
      image: "assets/dest-europe.jpg",
      status: "Tour catalogue expanding",
      desc: "Browse guided and free-travel tours across Europe, Asia, and the Middle East. Our advisors can match you with the right group size, language, and activity level.",
      points: ["Europe, Asia & Gulf circuits", "Private guides available", "Senior-friendly pacing", "Custom extensions"],
    },
    "Travel Insurance": {
      image: "assets/detail-travel.jpg",
      status: "Instant quotes coming soon",
      desc: "One-click insurance purchase is being integrated. We currently arrange medical, baggage, and trip-cancellation cover matched to your destination and trip length.",
      points: ["Schengen-compliant policies", "Family & senior plans", "Adventure sports add-ons", "Claims assistance"],
    },
    "Airport Transfers": {
      image: "assets/dest-dubai.jpg",
      status: "Live transfer booking next",
      desc: "Real-time driver assignment will be available in the app shortly. We already coordinate private sedans, vans, and meet-and-greet services in 40+ cities.",
      points: ["Flight-tracked pickups", "Meet & greet at arrivals", "Child seats on request", "Hotel ↔ airport routes"],
    },
    "Cruise Holidays": {
      image: "assets/dest-cruise.jpg",
      status: "Cruise desk opening soon",
      desc: "Browse cabin categories, deck plans, and shore excursions online — launching this quarter. Our cruise specialists book ocean and river sailings with cabin upgrades where available.",
      points: ["Ocean & river cruises", "Balcony & suite cabins", "Shore excursion planning", "Group & charter options"],
    },
    "Custom Tour Packages": {
      image: "assets/dest-kerala.jpg",
      status: "Bespoke itinerary tool",
      desc: "Tell us who is travelling, where you want to go, and how you like to rest. We design a private itinerary with transparent pricing — no cookie-cutter templates.",
      points: ["Fully personalised routes", "Multi-country combinations", "Special occasions & milestones", "Dedicated trip manager"],
    },
    "Dubai & the Gulf": {
      image: "assets/dest-dubai.jpg",
      status: "Destination packages",
      desc: "Dubai, Abu Dhabi, Oman, and Qatar packages with flights from Kochi, Calicut, and Trivandrum. Visa on arrival destinations included.",
      points: ["Desert safaris & city tours", "Theme park tickets", "Luxury hotel upgrades", "UAE visa assistance"],
    },
    "Island Quiet": {
      image: "assets/dest-islands.jpg",
      status: "Island escapes",
      desc: "Maldives, Mauritius, and Seychelles packages with seaplane transfers and overwater villas. Honeymoon and anniversary themes available.",
      points: ["Overwater & beach villas", "All-inclusive meal plans", "Snorkelling & diving", "Speedboat transfers"],
    },
    "Kerala Backwaters": {
      image: "assets/dest-kerala.jpg",
      status: "South India tours",
      desc: "Houseboat cruises, hill stations, and beach extensions across Kerala. Perfect for families and NRI visitors.",
      points: ["Premium houseboats", "Munnar & Wayanad add-ons", "Ayurveda retreats", "Airport pickup from COK"],
    },
    Europe: {
      image: "assets/dest-europe.jpg",
      status: "European circuits",
      desc: "Schengen visa support plus curated tours through Switzerland, France, Italy, and Eastern Europe. Summer and Christmas market departures.",
      points: ["Schengen visa bundled", "Small group departures", "Rail pass options", "Multi-city flights"],
    },
  };

  const defaultFeature = {
    image: "assets/icon.jpeg",
    status: "Feature in development",
    desc: "This section is being prepared for online booking. Our travel advisors are available now to help you plan and book.",
    points: ["Personalised quotes", "Transparent pricing", "WhatsApp & phone support", "Offices in Kerala & UAE"],
  };

  let lastTrigger = null;

  const openFeature = (name, trigger) => {
    if (!dialog) return;
    const data = featureData[name] || { ...defaultFeature, desc: `${name} — ${defaultFeature.desc}` };
    lastTrigger = trigger || null;
    closeNav();

    const hero = dialog.querySelector("[data-feature-hero]");
    const title = dialog.querySelector("[data-feature-title]");
    const status = dialog.querySelector("[data-feature-status]");
    const desc = dialog.querySelector("[data-feature-desc]");
    const list = dialog.querySelector("[data-feature-list]");
    const wa = dialog.querySelector("[data-feature-whatsapp]");

    if (hero) hero.style.backgroundImage = `url('${data.image}')`;
    if (title) title.textContent = name;
    if (status) status.textContent = data.status;
    if (desc) desc.textContent = data.desc;
    if (list) {
      list.innerHTML = data.points.map((p) => `<li>${p}</li>`).join("");
    }
    if (wa) {
      const msg = encodeURIComponent(`Hello Royal Holidays, I would like help with ${name}.`);
      wa.href = `https://wa.me/971506116742?text=${msg}`;
    }

    doc.style.overflow = "hidden";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };

  const closeFeature = () => {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    doc.style.overflow = "";
    lastTrigger?.focus?.();
  };

  document.querySelectorAll("[data-feature-trigger]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openFeature(el.getAttribute("data-feature-trigger"), el);
    });
  });

  document.querySelectorAll(".search-panel").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      openFeature(form.getAttribute("data-feature") || "Search", form.querySelector(".btn--search"));
    });
  });

  document.querySelectorAll("[data-feature-close]").forEach((btn) => {
    btn.addEventListener("click", closeFeature);
  });

  document.querySelector("[data-feature-close-link]")?.addEventListener("click", () => {
    closeFeature();
    closeNav();
  });

  dialog?.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeFeature();
  });

  dialog?.addEventListener("click", (e) => {
    if (e.target === dialog) closeFeature();
  });

  /* Contact form */
  document.querySelector("[data-contact-form]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name?.value || "Guest";
    const phone = form.phone?.value || "";
    const service = form.service?.value || "travel";
    const message = form.message?.value || "";
    const text = encodeURIComponent(
      `Hello Royal Holidays,\n\nName: ${name}\nPhone: ${phone}\nInterested in: ${service}\n\n${message}`
    );
    window.open(`https://wa.me/971506116742?text=${text}`, "_blank", "noopener,noreferrer");
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (dialog?.open) closeFeature();
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
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 }
    );
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 5, 4) * 60}ms`;
      observer.observe(el);
    });
  }
})();
