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
      items.forEach((item, index) => {
        setTimeout(() => item.classList.add("visible"), index * 100);
      });
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".stagger-container").forEach((container) => staggerObserver.observe(container));

// Safety fallback: reveal any standalone stagger items not inside a stagger-container
const singleStaggerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      singleStaggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".stagger-item").forEach((item) => {
  if (!item.closest(".stagger-container")) {
    singleStaggerObserver.observe(item);
  }
});

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalOverview = document.getElementById("modalOverview");
const modalTech = document.getElementById("modalTech");
const modalImpact = document.getElementById("modalImpact");
const modalTimeline = document.getElementById("modalTimeline");
const closeModalBtn = document.getElementById("closeModal");

function openProjectModal(card) {
  const title = card.dataset.title || "";
  const overview = card.dataset.overview || "";
  const tech = (card.dataset.tech || "").split(",").filter(Boolean);
  const impact = card.dataset.impact || "";
  const responsibilities = (card.dataset.responsibilities || "").split("|").filter(Boolean);

  modalTitle.textContent = title;
  modalOverview.textContent = overview;
  modalImpact.textContent = impact;
  modalTech.innerHTML = tech.map(item => `<span>${item.trim()}</span>`).join("");

  modalTimeline.innerHTML = responsibilities.map((item, index) => `
    <div class="modal-step">
      <div class="modal-step-dot"></div>
      <h5>Step ${index + 1}</h5>
      <p>${item.trim()}</p>
    </div>
  `).join("");

  modal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  modal.classList.remove("show");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".open-modal").forEach(card => {
  card.addEventListener("click", () => openProjectModal(card));
  card.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openProjectModal(card);
    }
  });
  card.setAttribute("tabindex", "0");
});

closeModalBtn.addEventListener("click", closeProjectModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeProjectModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) {
    closeProjectModal();
  }
});

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll(".stat-number[data-target]");
      counters.forEach(counter => animateCounter(counter));
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
    const value = Math.floor(progress * target);
    el.textContent = value;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}
