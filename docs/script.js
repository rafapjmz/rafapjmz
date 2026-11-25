(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Menú móvil */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");

  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    };

    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) setMenu(false);
    });
  }

  /* Año del footer */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Barra de progreso de lectura */
  var progreso = document.getElementById("progreso");
  if (progreso) {
    var actualizarProgreso = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var valor = max > 0 ? (window.scrollY / max) * 100 : 0;
      progreso.style.width = Math.min(100, Math.max(0, valor)) + "%";
    };
    window.addEventListener("scroll", actualizarProgreso, { passive: true });
    window.addEventListener("resize", actualizarProgreso);
    actualizarProgreso();
  }

  /* Palabra que cambia en el titular */
  var palabra = document.getElementById("palabra");
  if (palabra && !reduceMotion) {
    var palabras = ["frontend", "diseño", "inteligencia artificial"];
    var indice = 0;
    window.setInterval(function () {
      palabra.classList.add("cambiando");
      window.setTimeout(function () {
        indice = (indice + 1) % palabras.length;
        palabra.textContent = palabras[indice];
        palabra.classList.remove("cambiando");
      }, 260);
    }, 2800);
  }

  /* Resplandor que sigue al ratón en el hero */
  var hero = document.getElementById("inicio");
  if (hero && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
    hero.addEventListener("mousemove", function (event) {
      var rect = hero.getBoundingClientRect();
      hero.style.setProperty("--x", (event.clientX - rect.left) + "px");
      hero.style.setProperty("--y", (event.clientY - rect.top) + "px");
    });
    hero.addEventListener("mouseleave", function () {
      hero.style.setProperty("--x", "50%");
      hero.style.setProperty("--y", "50%");
    });
  }

  /* Entrada progresiva de secciones y tarjetas */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));

  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    sections.forEach(function (section) {
      section.classList.add("reveal");
      revealObserver.observe(section);
    });

    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var pos = cards.indexOf(entry.target);
          entry.target.style.transitionDelay = (pos % 4) * 80 + "ms";
          entry.target.classList.add("is-visible");
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(function (card) {
      card.classList.add("reveal");
      cardObserver.observe(card);
    });
  }

  /* Enlace activo del menú según la sección visible */
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) { navObserver.observe(section); });
  }
})();
