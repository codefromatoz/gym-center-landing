const carousel = document.getElementById("trainerCarousel");
const cards = Array.from(carousel.querySelectorAll(".trainer-card"));
const prev = document.getElementById("trainerPrev");
const next = document.getElementById("trainerNext");

let activeIndex = 0;

/* centra una card nel carousel */
function centerCard(card) {
  const cardCenter = card.offsetLeft + card.offsetWidth / 2;
  const carouselCenter = carousel.offsetWidth / 2;

  carousel.scrollTo({
    left: cardCenter - carouselCenter,
    behavior: "smooth",
  });
}

/* imposta trainer attivo */
function setActive(index) {
  activeIndex = Math.max(0, Math.min(index, cards.length - 1));

  cards.forEach((card) => card.classList.remove("is-active"));
  const activeCard = cards[activeIndex];
  activeCard.classList.add("is-active");

  centerCard(activeCard);
}

/* frecce */
next.addEventListener("click", () => {
  setActive(activeIndex + 1);
});

prev.addEventListener("click", () => {
  setActive(activeIndex - 1);
});

/* click diretto su card */
cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    setActive(index);
  });
});

/* init */
setActive(0);

document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
});

const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobileMenu");

function openMenu() {
  mobileMenu.classList.add("is-open");
  menuToggle.classList.add("is-open");
  menuToggle.textContent = "✕";
  menuToggle.setAttribute("aria-label", "Chiudi menu");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  mobileMenu.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.textContent = "☰";
  menuToggle.setAttribute("aria-label", "Apri menu");
  document.body.style.overflow = "";
}

menuToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.contains("is-open");
  isOpen ? closeMenu() : openMenu();
});

/* chiusura cliccando un link */
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* chiusura con ESC */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
  }
});

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

reveals.forEach((el) => observer.observe(el));
