// Mobile menu toggle (robust)
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-links');
if (toggle && menu) {
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
}

// Smooth scroll and close mobile menu
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    const el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
      if (menu) menu.classList.remove('open');
    }
  });
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.18 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Footer year (safe)
const yEl = document.getElementById('y');
if (yEl) yEl.textContent = new Date().getFullYear();

// Projects loader + filtering
let allProjects = [];

fetch('projects.json')
  .then(res => res.json())
  .then(data => {
    allProjects = Array.isArray(data) ? data : [];
    renderProjects('all');
  })
  .catch(err => {
    console.warn('Could not load projects.json', err);
    allProjects = [];
  });

function renderProjects(category) {
  const container = document.getElementById('project-cards');
  if (!container) return;
  container.innerHTML = '';

  const filtered = category === 'all' ? allProjects : allProjects.filter(p => p.category === category);
  if (filtered.length === 0) {
    container.innerHTML = '<p class="muted">No projects yet for this category.</p>';
    return;
  }

  filtered.forEach(p => {
    const a = document.createElement('a');
    a.className = 'card project-card';
    a.href = p.link || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    const img = document.createElement('img');
    img.className = 'cover project-img';
    img.alt = p.title + ' cover';
    img.src = p.image || 'https://source.unsplash.com/800x600/?code';

    const body = document.createElement('div');
    body.className = 'card-body';

    const tag = document.createElement('div');
    tag.className = 'card-tag';
    tag.textContent = (p.category || '').toUpperCase();

    const h3 = document.createElement('h3');
    h3.textContent = p.title;

    const pdesc = document.createElement('p');
    pdesc.textContent = p.desc;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = p.tech || '';

    body.appendChild(h3);
    body.appendChild(pdesc);
    body.appendChild(meta);

    a.appendChild(img);
    a.appendChild(tag);
    a.appendChild(body);

    container.appendChild(a);
  });
}

// Filter buttons (delegated)
document.addEventListener('click', (e) => {
  const btn = e.target.closest?.('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter || 'all';
  renderProjects(filter);
});
