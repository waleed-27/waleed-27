// --- Theme Toggler ---
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-toggle-icon");
const htmlEl = document.documentElement;

// Set initial theme based on localStorage or system preference
const currentTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");
if (currentTheme === "dark") {
  htmlEl.classList.add("dark");
  themeIcon.classList.remove("fa-sun");
  themeIcon.classList.add("fa-moon");
} else {
  htmlEl.classList.remove("dark");
  themeIcon.classList.remove("fa-moon");
  themeIcon.classList.add("fa-sun");
}

themeToggle.addEventListener("click", () => {
  htmlEl.classList.toggle("dark");
  const isDarkMode = htmlEl.classList.contains("dark");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");

  if (isDarkMode) {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  } else {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }
});

// --- Mobile menu toggle ---
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile menu when a link is clicked
const mobileMenuLinks = mobileMenu.getElementsByTagName("a");
for (let link of mobileMenuLinks) {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
}

// --- Project Modal Logic ---
const projectModal = document.getElementById("project-modal");
const modalPanel = projectModal.querySelector(".modal-panel");
const modalCloseButton = document.getElementById("modal-close-button");
const projectCards = document.querySelectorAll(".project-card");

const modalImage = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalLink = document.getElementById("modal-link");

// Function to open the modal
const openModal = (card) => {
  const title = card.querySelector("h3").innerText;
  const description = card.dataset.description;
  const imgSrc = card.querySelector("img").src;
  const link = card.dataset.link;

  modalTitle.innerText = title;
  modalDescription.innerText = description;
  modalImage.src = imgSrc;
  modalImage.alt = title;

  if (link) {
    modalLink.href = link;
    modalLink.classList.remove("hidden");
    modalLink.classList.add("inline-flex");
  } else {
    modalLink.classList.add("hidden");
    modalLink.classList.remove("inline-flex");
  }

  projectModal.classList.remove("hidden");
  // Use requestAnimationFrame to ensure the transition is applied correctly
  requestAnimationFrame(() => {
    projectModal.classList.remove("opacity-0");
    modalPanel.classList.remove("opacity-0", "scale-95");
  });
};

// Function to close the modal
const closeModal = () => {
  projectModal.classList.add("opacity-0");
  modalPanel.classList.add("opacity-0", "scale-95");
  setTimeout(() => {
    projectModal.classList.add("hidden");
  }, 300); // Match the transition duration
};

// Add event listeners to project cards
projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    openModal(card);
  });
});

// Add event listeners to close the modal
modalCloseButton.addEventListener("click", closeModal);
projectModal.addEventListener("click", (event) => {
  if (event.target === projectModal) {
    closeModal();
  }
});

// Close modal with the 'Escape' key
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !projectModal.classList.contains("hidden")
  ) {
    closeModal();
  }
});

// --- Scroll to Top Button Logic ---
const scrollToTopBtn = document.getElementById("scroll-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.remove("hidden");
    scrollToTopBtn.classList.add("flex");
  } else {
    scrollToTopBtn.classList.add("hidden");
    scrollToTopBtn.classList.remove("flex");
  }
});

// --- Scroll Animation Logic ---
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

const sectionsToAnimate = document.querySelectorAll(".fade-in-section");
sectionsToAnimate.forEach((section) => {
  observer.observe(section);
});

// --- Hero Canvas Animation ---
const canvas = document.getElementById("hero-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particlesArray;

  // Mouse position
  const mouse = {
    x: null,
    y: null,
    radius: 100,
  };

  window.addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Mouse collision
      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
          if (
            mouse.x < this.x &&
            this.x < canvas.width - this.size * 10
          ) {
            this.x += 3;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 3;
          }
          if (
            mouse.y < this.y &&
            this.y < canvas.height - this.size * 10
          ) {
            this.y += 3;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 3;
          }
        }
      }
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    const isDarkMode =
      document.documentElement.classList.contains("dark");
    const particleColor = isDarkMode
      ? "rgba(255, 255, 255, 0.5)"
      : "rgba(0, 0, 0, 0.5)";

    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2 + 1;
      let x =
        Math.random() * (canvas.width - size * 2 - size * 2) + size * 2;
      let y =
        Math.random() * (canvas.height - size * 2 - size * 2) + size * 2;
      let directionX = Math.random() * 0.4 - 0.2;
      let directionY = Math.random() * 0.4 - 0.2;

      particlesArray.push(
        new Particle(x, y, directionX, directionY, size, particleColor)
      );
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
  }

  function connect() {
    const isDarkMode =
      document.documentElement.classList.contains("dark");
    const baseLineColor = isDarkMode ? "255, 255, 255" : "48, 48, 48";

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance =
          (particlesArray[a].x - particlesArray[b].x) *
            (particlesArray[a].x - particlesArray[b].x) +
          (particlesArray[a].y - particlesArray[b].y) *
            (particlesArray[a].y - particlesArray[b].y);

        if (distance < (canvas.width / 7) * (canvas.height / 7)) {
          let opacityValue = 1 - distance / 20000;
          if (opacityValue < 0) opacityValue = 0;

          ctx.strokeStyle = `rgba(${baseLineColor}, ${
            opacityValue * 0.3
          })`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height / 80) * (canvas.height / 80);
    init();
  }

  window.addEventListener("resize", handleResize);
  window.addEventListener("mouseout", function () {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  // Re-init on theme change to update colors
  const themeObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        init();
      }
    }
  });
  themeObserver.observe(document.documentElement, { attributes: true });

  // Initial setup
  handleResize();
  animate();
}

// --- Set current year in footer ---
const copyrightInfo = document.getElementById("copyright-info");
if (copyrightInfo) {
  copyrightInfo.innerHTML = `&copy; ${new Date().getFullYear()} Waleed Bin Tahir. All Rights Reserved.`;
}
