const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      if (entry.target.classList.contains("timeline")) {
        entry.target.classList.add("animate-line");
      }
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal, .timeline").forEach((el) => observer.observe(el));

const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll(".stagger-item");
      items.forEach((item, index) => setTimeout(() => item.classList.add("visible"), index * 100));
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".stagger-container").forEach((container) => staggerObserver.observe(container));

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalOverview = document.getElementById("modalOverview");
const modalTech = document.getElementById("modalTech");
const modalImpact = document.getElementById("modalImpact");
const modalTimeline = document.getElementById("modalTimeline");
const closeModalBtn = document.getElementById("closeModal");

function openProjectModal(card) {
  modalTitle.textContent = card.dataset.title || "";
  modalOverview.textContent = card.dataset.overview || "";
  modalImpact.textContent = card.dataset.impact || "";
  modalTech.innerHTML = (card.dataset.tech || "").split(",").filter(Boolean).map(item => `<span>${item.trim()}</span>`).join("");
  modalTimeline.innerHTML = (card.dataset.responsibilities || "").split("|").filter(Boolean).map((item, index) => `
    <div class="modal-step">
      <div class="modal-step-dot"></div>
      <h5>Step ${index + 1}</h5>
      <p>${item.trim()}</p>
    </div>`).join("");
  modal.classList.add("show");
  document.body.classList.add("modal-open");
}
function closeProjectModal() {
  modal.classList.remove("show");
  if (!certModal.classList.contains("show")) document.body.classList.remove("modal-open");
}
document.querySelectorAll(".open-modal").forEach(card => {
  card.addEventListener("click", () => openProjectModal(card));
  card.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProjectModal(card); }
  });
  card.setAttribute("tabindex", "0");
});
closeModalBtn.addEventListener("click", closeProjectModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeProjectModal(); });

const certTrack = document.getElementById("certCarouselTrack");
const certPrev = document.getElementById("certPrev");
const certNext = document.getElementById("certNext");
let originalCards = Array.from(certTrack.children);
let cards = [];
let currentIndex = 0;
let autoSlide = null;
let cardStep = 0;
let visibleCount = 3;

function setupInfiniteCarousel() {
  certTrack.innerHTML = "";
  originalCards = originalCards.length ? originalCards : Array.from(document.querySelectorAll(".cert-card"));
  visibleCount = getVisibleCount();

  const clonesBefore = originalCards.slice(-visibleCount).map(c => c.cloneNode(true));
  const clonesAfter = originalCards.slice(0, visibleCount).map(c => c.cloneNode(true));

  clonesBefore.forEach(c => certTrack.appendChild(c));
  originalCards.forEach(c => certTrack.appendChild(c));
  clonesAfter.forEach(c => certTrack.appendChild(c));

  cards = Array.from(certTrack.children);
  attachCertEvents();
  updateCardMetrics();
  currentIndex = visibleCount;
  jumpToIndex(currentIndex, false);
}

function getVisibleCount() {
  if (window.innerWidth <= 700) return 1;
  if (window.innerWidth <= 980) return 2;
  return 3;
}

function updateCardMetrics() {
  const firstCard = certTrack.querySelector(".cert-card");
  if (!firstCard) return;
  const gap = 18;
  cardStep = firstCard.getBoundingClientRect().width + gap;
}

function jumpToIndex(index, animate = true) {
  certTrack.style.transition = animate ? "transform 0.6s ease" : "none";
  certTrack.style.transform = `translateX(-${index * cardStep}px)`;
}

function nextSlide() {
  currentIndex += 1;
  jumpToIndex(currentIndex, true);
}

function prevSlide() {
  currentIndex -= 1;
  jumpToIndex(currentIndex, true);
}

function handleLoopReset() {
  const originalCount = originalCards.length;
  if (currentIndex >= originalCount + visibleCount) {
    currentIndex = visibleCount;
    jumpToIndex(currentIndex, false);
  } else if (currentIndex < visibleCount) {
    currentIndex = originalCount + visibleCount - 1;
    jumpToIndex(currentIndex, false);
  }
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlide = setInterval(nextSlide, 2800);
}
function stopAutoSlide() {
  if (autoSlide) clearInterval(autoSlide);
}

certTrack.addEventListener("transitionend", handleLoopReset);
certPrev.addEventListener("click", () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });
certNext.addEventListener("click", () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });

const certShell = document.querySelector(".cert-carousel-shell");
certShell.addEventListener("mouseenter", stopAutoSlide);
certShell.addEventListener("mouseleave", startAutoSlide);

window.addEventListener("resize", () => {
  visibleCount = getVisibleCount();
  setupInfiniteCarousel();
  startAutoSlide();
});

const certModal = document.getElementById("certModal");
const closeCertModalBtn = document.getElementById("closeCertModal");
const certTitle = document.getElementById("certTitle");
const certIssuer = document.getElementById("certIssuer");
const certDate = document.getElementById("certDate");
const certDetails = document.getElementById("certDetails");
const certPreview = document.getElementById("certPreview");

function openCertModal(card) {
  certTitle.textContent = card.dataset.title || "";
  certIssuer.textContent = card.dataset.issuer || "";
  certDate.textContent = card.dataset.date || "";
  certDetails.textContent = card.dataset.details || "";
  certPreview.innerHTML = `<img src="${card.dataset.src}" alt="${card.dataset.title || "Certificate"}" />`;
  certModal.classList.add("show");
  document.body.classList.add("modal-open");
}
function closeCertModal() {
  certModal.classList.remove("show");
  certPreview.innerHTML = "";
  if (!modal.classList.contains("show")) document.body.classList.remove("modal-open");
}
function attachCertEvents() {
  certTrack.querySelectorAll(".open-cert").forEach(card => {
    card.onclick = () => openCertModal(card);
    card.onkeypress = (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCertModal(card); }
    };
    card.setAttribute("tabindex", "0");
  });
}
closeCertModalBtn.addEventListener("click", closeCertModal);
certModal.addEventListener("click", (e) => { if (e.target === certModal) closeCertModal(); });

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (modal.classList.contains("show")) closeProjectModal();
    if (certModal.classList.contains("show")) closeCertModal();
  }
});

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".stat-number[data-target]").forEach(animateCounter);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll(".hero-panel").forEach(panel => countObserver.observe(panel));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2200;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

window.addEventListener("load", () => {
  setupInfiniteCarousel();
  startAutoSlide();
});
