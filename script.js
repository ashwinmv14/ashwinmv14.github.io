// mobile menu
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-links');
if (toggle) toggle.addEventListener('click', () => menu.classList.toggle('open'));

// smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      menu?.classList.remove('open');
    }
  });
});

// footer year
const y = document.getElementById('y');
if (y) y.textContent = new Date().getFullYear();
