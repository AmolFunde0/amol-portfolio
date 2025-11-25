const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('amol_theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const setTheme = (theme) => {
  document.body.classList.toggle('light', theme === 'light');
  themeToggle.setAttribute('aria-pressed', theme === 'light');
  themeToggle.textContent = theme === 'light' ? '🌞' : '🌗';
};

setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
  setTheme(newTheme);
  localStorage.setItem('amol_theme', newTheme);
});

const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.getAttribute('data-visible') === 'true';
  primaryNav.setAttribute('data-visible', String(!isOpen));
  navToggle.setAttribute('aria-expanded', String(!isOpen));
});

primaryNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 920) {
      primaryNav.setAttribute('data-visible', 'false');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
      if (entry.target.id === 'skills') animateSkillBars();
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('section, .card, .project').forEach((el) => {
  el.classList.add('pre-reveal');
  revealObserver.observe(el);
});

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a.nav-link');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const link = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
    if (entry.isIntersecting && link) {
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      history.replaceState(null, '', `#${entry.target.id}`);
    }
  });
}, { threshold: 0.45 });

sections.forEach((s) => activeObserver.observe(s));

const contactForm = document.getElementById('contactForm');
const note = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) {
    note.textContent = '⚠️ Please fill all fields.';
    note.style.color = 'tomato';
    return;
  }
  note.style.color = 'limegreen';
  note.textContent = `Thank you, ${name}! Your message has been received.`;
  contactForm.reset();
});

const startYear = 2022;
const years = Math.max(1, new Date().getFullYear() - startYear);
document.getElementById('yearsExp').textContent = years + '+';

function animateSkillBars() {
  document.querySelectorAll('.skill-card').forEach((card) => {
    const value = card.dataset.value || 80;
    const bar = card.querySelector('.meter > span');
    setTimeout(() => {
      bar.style.width = value + '%';
    }, 150);
  });
}

const modal = document.getElementById('projectModal');
const modalContent = modal.querySelector('.modal-content');
const modalClose = document.getElementById('modalClose');

const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTech = document.getElementById('modalTech');
const modalImg = document.getElementById('modalImg');
const modalLive = document.getElementById('modalLive');
const modalCode = document.getElementById('modalCode');

document.querySelectorAll('.project .view-project').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.project');
    modalTitle.textContent = card.dataset.title || '';
    modalDesc.textContent = card.dataset.desc || '';
    modalTech.textContent = card.dataset.tech ? `Tech: ${card.dataset.tech}` : '';
    modalImg.src = card.dataset.img || '';
    modalImg.alt = card.dataset.title || '';
    modalLive.href = card.dataset.live || '#';
    modalCode.href = card.dataset.code || '#';
    modal.setAttribute('aria-hidden', 'false');
    modalContent.focus();
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => e.target === modal && closeModal());
document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 920) {
    primaryNav.setAttribute('data-visible', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
  } else {
    primaryNav.setAttribute('data-visible', 'false');
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

/* ==== PROJECT CARD SCROLL ANIMATION ==== */
const projectCards = document.querySelectorAll('.project');

const projectObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      const card = entry.target;
      card.style.setProperty('--delay', `${index * 120}ms`);
      card.classList.add('appear');
      obs.unobserve(card);
    }
  });
}, { threshold: 0.25 });

projectCards.forEach((card) => {
  card.classList.add('project-card');
  projectObserver.observe(card);
});
