// Mobile menu
const toggle=document.querySelector('.nav-toggle');
const menu=document.querySelector('.nav-links');
toggle.addEventListener('click',()=>menu.classList.toggle('open'));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const el=document.querySelector(a.getAttribute('href'));
    if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});menu.classList.remove('open');}
  });
});

// Fade-in on scroll
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');}});
},{threshold:.2});
document.querySelectorAll('.fade-in').forEach(el=>observer.observe(el));

// Footer year
document.getElementById('y').textContent=new Date().getFullYear();

// Load projects dynamically
fetch('projects.json')
  .then(r=>r.json())
  .then(data=>{
    const container=document.getElementById('project-cards');
    data.forEach(p=>{
      const card=document.createElement('a');
      card.className='card';
      card.href=p.link;card.target='_blank';
      card.innerHTML=`<h3>${p.title}</h3><p>${p.desc}</p><small>${p.tech}</small>`;
      container.appendChild(card);
    });
  });
