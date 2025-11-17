// ---- Theme toggle (persisted) ----
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('amol_theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(theme){
  if(theme === 'light') document.body.classList.add('light');
  else document.body.classList.remove('light');
  themeToggle.setAttribute('aria-pressed', theme === 'light');
  themeToggle.textContent = theme === 'light' ? '🌞' : '🌗';
}

if(savedTheme) setTheme(savedTheme);
else setTheme(prefersDark ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  const next = document.body.classList.contains('light') ? 'dark' : 'light';
  setTheme(next);
  localStorage.setItem('amol_theme', next);
});

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

navToggle.addEventListener('click', () => {
  const isVisible = primaryNav.getAttribute('data-visible') === 'true';
  primaryNav.setAttribute('data-visible', !isVisible);
  navToggle.setAttribute('aria-expanded', String(!isVisible));
});

// Close mobile nav when link clicked
primaryNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if(window.innerWidth <= 920){
      primaryNav.setAttribute('data-visible', 'false');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// ---- Smooth reveal for sections (keeps your reveal logic but adds once behavior) ----
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('reveal');
      // trigger skill bars when skills section visible
      if(e.target.id === 'skills') animateSkillBars();
      obs.unobserve(e.target);
    }
  });
}, {threshold: 0.12});

document.querySelectorAll('section, .card, .project').forEach(el => {
  el.classList.add('pre-reveal');
  observer.observe(el);
});

// ---- Active nav highlight (based on intersection) ----
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a.nav-link');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = document.querySelector(`.nav a[href="#${id}"]`);
    if(entry.isIntersecting){
      navLinks.forEach(l => l.classList.remove('active'));
      if(link) link.classList.add('active');
      history.replaceState(null, '', `#${id}`);
    }
  });
}, {threshold: 0.45});

sections.forEach(s => activeObserver.observe(s));

// ---- Contact form (front-end) ----
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const note = document.getElementById('formNote');
  if(!name || !email || !message){
    note.textContent = 'Please fill all fields.';
    note.style.color = 'tomato';
    return;
  }
  note.style.color = '';
  note.textContent = `Thanks ${name}! Message noted (no backend configured).`;
  e.target.reset();
});

// ---- Years counter ----
const startYear = 2022;
const years = Math.max(1, new Date().getFullYear() - startYear);
document.getElementById('yearsExp').textContent = years + '+';

// ---- Skill bars animation ----
function animateSkillBars(){
  const skills = document.querySelectorAll('.skill-card');
  skills.forEach(card => {
    const value = card.getAttribute('data-value') || 80;
    const bar = card.querySelector('.meter > span');
    // small timeout to allow CSS transition
    setTimeout(() => bar.style.width = value + '%', 120);
  });
}

// ---- Project modal (open/close, populate) ----
const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTech  = document.getElementById('modalTech');
const modalImg   = document.getElementById('modalImg');
const modalLive  = document.getElementById('modalLive');
const modalCode  = document.getElementById('modalCode');

function openModal(data){
  modalTitle.textContent = data.title || '';
  modalDesc.textContent = data.desc || '';
  modalTech.textContent = data.tech ? `Tech: ${data.tech}` : '';
  modalImg.src = data.img || '';
  modalImg.alt = data.title || '';
  // If you have live/code urls, set them, otherwise hide
  modalLive.href = data.live || '#';
  modalCode.href = data.code || '#';
  modal.setAttribute('aria-hidden', 'false');
  modal.querySelector('.modal-content').focus();
}

function closeModal(){
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.project .view-project').forEach(btn => {
  btn.addEventListener('click', (evt) => {
    const card = evt.target.closest('.project');
    const data = {
      title: card.getAttribute('data-title'),
      desc: card.getAttribute('data-desc'),
      tech: card.getAttribute('data-tech'),
      img: card.getAttribute('data-img'),
      live: '#', code: '#'
    };
    openModal(data);
  });
});

// close handlers
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if(e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
});

// ---- small accessibility & performance niceties ----
window.addEventListener('resize', () => {
  if(window.innerWidth > 920){
    primaryNav.setAttribute('data-visible', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
  }else{
    primaryNav.setAttribute('data-visible', 'false');
  }
});

// set year in footer
document.getElementById('year').textContent = new Date().getFullYear();
