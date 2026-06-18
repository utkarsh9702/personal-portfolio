const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const typedText = document.querySelector("#typed-text");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");
const submitButton = document.querySelector(".submit-btn");
const submitButtonText = document.querySelector(".btn-text");

const API_BASE_URL = window.PORTFOLIO_API_BASE_URL || "http://127.0.0.1:5000";

const typedPhrases = [
  "responsive websites.",
  "full-stack applications.",
  "AI/ML workflows.",
  "data-driven software."
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const phrase = typedPhrases[phraseIndex];
  const nextText = isDeleting
    ? phrase.slice(0, charIndex - 1)
    : phrase.slice(0, charIndex + 1);

  typedText.textContent = nextText;
  charIndex = nextText.length;

  let delay = isDeleting ? 48 : 92;

  if (!isDeleting && nextText === phrase) {
    delay = 1300;
    isDeleting = true;
  } else if (isDeleting && nextText === "") {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typedPhrases.length;
    delay = 320;
  }

  window.setTimeout(typeLoop, delay);
}

function closeMenu() {
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("open");
}

function setFormState({ loading = false, message = "", type = "success" }) {
  submitButton.disabled = loading;
  submitButton.classList.toggle("loading", loading);
  submitButtonText.textContent = loading ? "Sending..." : "Send Message";
  formStatus.textContent = message;
  formStatus.classList.toggle("error", type === "error");
}

function getTrimmedValue(formData, key) {
  return String(formData.get(key) || "").trim();
}

function validateContactPayload(payload) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (payload.website) return "Spam protection rejected this submission.";
  if (payload.name.length < 2 || payload.name.length > 80) return "Name must be 2-80 characters.";
  if (!emailPattern.test(payload.email) || payload.email.length > 120) return "Enter a valid email address.";
  if (payload.subject.length < 3 || payload.subject.length > 120) return "Subject must be 3-120 characters.";
  if (payload.message.length < 10 || payload.message.length > 2000) return "Message must be 10-2000 characters.";

  return "";
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navMenu.classList.toggle("open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("visible");

    if (entry.target.classList.contains("skill")) {
      const level = entry.target.dataset.level;
      entry.target.querySelector(".bar i").style.width = `${level}%`;
    }
  });
}, {
  threshold: 0.22
});

document.querySelectorAll(".reveal, .skill").forEach((element) => {
  observer.observe(element);
});

const sections = document.querySelectorAll("main section[id]");
const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, {
  rootMargin: "-35% 0px -55% 0px"
});

sections.forEach((section) => activeLinkObserver.observe(section));

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const payload = {
    name: getTrimmedValue(formData, "name"),
    email: getTrimmedValue(formData, "email"),
    subject: getTrimmedValue(formData, "subject"),
    message: getTrimmedValue(formData, "message"),
    website: getTrimmedValue(formData, "website")
  };

  const validationError = validateContactPayload(payload);
  if (validationError) {
    setFormState({ message: validationError, type: "error" });
    return;
  }

  try {
    setFormState({ loading: true, message: "" });

    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to send your message right now.");
    }

    contactForm.reset();
    setFormState({
      message: "Message sent successfully. Please check your email for confirmation."
    });
  } catch (error) {
    const isNetworkError = error instanceof TypeError;

    setFormState({
      message: isNetworkError
        ? "Contact server is not running. Start the backend, then try again."
        : error.message || "Something went wrong. Please try again later.",
      type: "error"
    });
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove("loading");
    submitButtonText.textContent = "Send Message";
  }
});

typeLoop();
