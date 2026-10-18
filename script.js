// Datos de contacto: edita aquí.
const CONFIG = {
  whatsapp: "56928402640", // sin "+" ni espacios
  greeting: "Hola MAHC, quiero cotizar un proyecto.",
  // Opcional: endpoint de Formspree/Getform (ej. "https://formspree.io/f/xxxx")
  // para recibir las cotizaciones también por correo. Vacío = solo WhatsApp.
  formEndpoint: ""
};

const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

document.querySelectorAll("[data-wa]").forEach((a) => { a.href = waLink(CONFIG.greeting); });
document.getElementById("year").textContent = new Date().getFullYear();

// Menú móvil
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));

// Animaciones al hacer scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Galería: lightbox
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector("img");
const lbCap = lb.querySelector(".lightbox__cap");
document.querySelectorAll(".g a").forEach((a) => a.addEventListener("click", (e) => {
  e.preventDefault();
  const img = a.querySelector("img");
  lbImg.src = a.href; lbImg.alt = img.alt;
  lbCap.textContent = a.parentElement.querySelector("figcaption").textContent;
  lb.hidden = false;
}));
const closeLb = () => { lb.hidden = true; lbImg.src = ""; };
lb.addEventListener("click", (e) => { if (e.target !== lbImg) closeLb(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) closeLb(); });

// Formulario de cotización
const form = document.getElementById("quote-form");
const note = form.querySelector(".form__note");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("[required]").forEach((f) => {
    const bad = !f.value.trim();
    f.classList.toggle("invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) { note.textContent = "Completa los campos marcados en rojo."; note.className = "form__note"; return; }

  const d = Object.fromEntries(new FormData(form));
  const msg = [
    "Hola MAHC, quiero solicitar una cotización:",
    `• Nombre: ${d.nombre}`,
    `• Teléfono: ${d.telefono}`,
    d.comuna && `• Comuna: ${d.comuna}`,
    `• Servicio: ${d.servicio}`,
    d.medidas && `• Medidas: ${d.medidas}`,
    `• Proyecto: ${d.mensaje}`
  ].filter(Boolean).join("\n");

  if (CONFIG.formEndpoint) {
    fetch(CONFIG.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) }).catch(() => {});
  }
  window.open(waLink(msg), "_blank", "noopener");
  note.textContent = "¡Gracias! Tu solicitud está lista en WhatsApp. Te responderemos a la brevedad.";
  note.className = "form__note ok";
  form.reset();
});
form.addEventListener("input", (e) => e.target.classList.remove("invalid"));
