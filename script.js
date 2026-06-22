document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("#main-nav");
  const menu = document.querySelector("#mobile-menu");
  const openMenu = document.querySelector("#menu-open");
  const closeMenu = document.querySelector("#menu-close");

  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 60);
    },
    { passive: true },
  );

  function setMenu(open) {
    menu?.classList.toggle("is-open", open);
    menu?.setAttribute("aria-hidden", String(!open));
    openMenu?.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  openMenu?.addEventListener("click", () => setMenu(true));
  closeMenu?.addEventListener("click", () => setMenu(false));

  document.querySelectorAll(".nav-trigger[data-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo({ top, behavior: "smooth" });
      setMenu(false);
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));

  const statsSection = document.querySelector("#stats-section");
  const statConfig = [
    ["stat-years", 12, "+"],
    ["stat-members", 2400, "+"],
    ["stat-trainers", 18, ""],
    ["stat-classes", 45, ""],
  ];

  function animateCounter(id, target, suffix) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = performance.now();
    const duration = 1600;
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent =
        Math.round(eased * target).toLocaleString("it-IT") + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (statsSection) {
    let fired = false;
    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fired) return;
        fired = true;
        statConfig.forEach(([id, target, suffix]) =>
          animateCounter(id, target, suffix),
        );
        statsObserver.disconnect();
      },
      { threshold: 0.35 },
    );
    statsObserver.observe(statsSection);
  }

  const track = document.querySelector("#trainer-track");
  const dotsWrap = document.querySelector("#trainer-dots");
  const cards = track
    ? Array.from(track.querySelectorAll(".trainer-card"))
    : [];

  if (track && dotsWrap && cards.length) {
    cards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Vai al trainer ${index + 1}`);
      dot.addEventListener("click", () => scrollToCard(index));
      dotsWrap.append(dot);
    });

    const dots = Array.from(dotsWrap.children);

    function activeIndex() {
      const center = track.scrollLeft + track.offsetWidth / 2;
      let bestIndex = 0;
      let bestDistance = Infinity;
      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      return bestIndex;
    }

    function updateActive() {
      const index = activeIndex();
      cards.forEach((card, i) =>
        card.classList.toggle("is-active", i === index),
      );
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    }

    function scrollToCard(index) {
      const card = cards[index];
      if (!card) return;
      const left =
        card.offsetLeft + card.offsetWidth / 2 - track.offsetWidth / 2;
      track.scrollTo({ left, behavior: "smooth" });
    }

    document
      .querySelector("#trainer-prev")
      ?.addEventListener("click", () =>
        scrollToCard(Math.max(activeIndex() - 1, 0)),
      );
    document
      .querySelector("#trainer-next")
      ?.addEventListener("click", () =>
        scrollToCard(Math.min(activeIndex() + 1, cards.length - 1)),
      );
    track.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });
    updateActive();
  }
});
