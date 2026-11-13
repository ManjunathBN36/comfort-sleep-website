const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();

// WhatsApp click-to-chat: configure the business number in config.js.
const config = window.COMFORT_SLEEP_CONFIG || {};
const whatsappLink = document.getElementById("whatsappLink");
const whatsappNumber = (config.whatsappNumber || "").replace(/\D/g, "");
if (whatsappNumber.length >= 10 && !config.whatsappNumber.includes("X")) {
  const message = encodeURIComponent("Hello Comfort Sleep! I would like to know more about your mattresses.");
  whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  whatsappLink.target = "_blank"; whatsappLink.rel = "noopener";
} else {
  whatsappLink.addEventListener("click", event => {
    event.preventDefault();
    document.getElementById("formNote").textContent = "Add the Comfort Sleep WhatsApp number in config.js to activate this chat button.";
    document.getElementById("contact").scrollIntoView({behavior:"smooth"});
  });
}

// EmailJS sends the enquiry in the background; it does not open a mail application.
const contactForm = document.getElementById("contactForm");
const submitButton = document.getElementById("submitButton");
const formNote = document.getElementById("formNote");
const emailJsReady = Boolean(window.emailjs && config.emailJsPublicKey && !config.emailJsPublicKey.startsWith("YOUR_") && config.emailJsServiceId && !config.emailJsServiceId.startsWith("YOUR_") && config.emailJsTemplateId && !config.emailJsTemplateId.startsWith("YOUR_"));
if (emailJsReady) emailjs.init({publicKey: config.emailJsPublicKey});
contactForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!emailJsReady) {
    formNote.textContent = "Email is not configured yet. Add your EmailJS public key, service ID and template ID in config.js.";
    formNote.classList.add("form-error"); return;
  }
  submitButton.disabled = true; submitButton.textContent = "Sending...";
  formNote.textContent = "Sending your enquiry...";
  formNote.classList.remove("form-error", "form-success");
  try {
    await emailjs.sendForm(config.emailJsServiceId, config.emailJsTemplateId, contactForm);
    formNote.textContent = "Thank you! Your enquiry has been sent successfully. Our team will contact you soon.";
    formNote.classList.add("form-success"); contactForm.reset();
  } catch (error) {
    console.error("EmailJS submission failed:", error);
    formNote.textContent = "Sorry, we couldn't send your enquiry. Please try again or contact us on WhatsApp.";
    formNote.classList.add("form-error");
  } finally { submitButton.disabled = false; submitButton.innerHTML = 'Send enquiry <span>→</span>'; }
});

// Highlight the navigation item for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  }), {rootMargin:"-35% 0px -55% 0px"});
  sections.forEach(section => observer.observe(section));
}
