(function () {
  var root = document.documentElement;

  // Theme toggle (remembers choice when storage is available)
  var themeBtn = document.getElementById("themeBtn");
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    themeBtn.textContent = t === "dark" ? "Light" : "Dark";
    themeBtn.setAttribute("aria-label", "Switch to " + (t === "dark" ? "light" : "dark") + " theme");
  }
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Mobile menu
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Highlight the nav link of the section on screen
  var links = nav.querySelectorAll("a");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { io.observe(s); });
  }

  // Project filter
  var chips = document.querySelectorAll(".chip");
  var projects = document.querySelectorAll(".proj");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) { c.classList.toggle("active", c === chip); });
      projects.forEach(function (p) { p.hidden = f !== "all" && p.dataset.cat !== f; });
    });
  });

  // Contact form: validate, then open the email app with the message filled in
  var form = document.getElementById("contactForm");
  var status = document.getElementById("status");
  function showErr(field, msg) {
    form.querySelector('[data-for="' + field + '"]').textContent = msg;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    var ok = true;
    showErr("name", name ? "" : "Enter your name."); if (!name) ok = false;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    showErr("email", emailOk ? "" : "Enter a valid email address."); if (!emailOk) ok = false;
    var msgOk = message.length >= 10;
    showErr("message", msgOk ? "" : "Write at least 10 characters."); if (!msgOk) ok = false;
    if (!ok) { status.textContent = ""; return; }
    var subject = encodeURIComponent("Portfolio message from " + name);
    var body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");
    status.textContent = "Opening your email app…";
    window.location.href = "mailto:nkbestcoool@gmail.com?subject=" + subject + "&body=" + body;
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
