const API = 'http://localhost:3000';

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Fade in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

function observeCards() {
  document.querySelectorAll('.skill-card, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// Load profile data from backend
async function loadProfile() {
  try {
    const res = await fetch(`${API}/api/profile`);
    const data = await res.json();

    // Update profile info
    document.querySelector('.hero-text h1').innerHTML = `${data.name.split(' ')[0]} ${data.name.split(' ')[1]}<br/><span>${data.name.split(' ')[2] || ''}</span>`;
    document.querySelector('.title-tag').textContent = data.title;
    document.querySelector('.bio').textContent = data.bio;

    // Update contact
    const links = document.querySelectorAll('.contact-item a');
    links[0].textContent = data.email;
    links[0].href = `mailto:${data.email}`;
    links[1].textContent = data.phone;
    links[1].href = `tel:${data.phone}`;

    // Update skills
    const skillsGrid = document.querySelector('.skills-grid');
    const icons = ['🤝','🧵','💻','🍳','📊','🎨','🌍','⚡'];
    skillsGrid.innerHTML = data.skills.map((skill, i) => `
      <div class="skill-card">
        <div class="skill-icon">${icons[i] || '⭐'}</div>
        <h3>${skill}</h3>
        <p>One of Lisa's key strengths and areas of expertise</p>
      </div>`).join('');

    // Update projects
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = data.projects.map(p => `
      <div class="project-card">
        <div class="project-tag">${p.tag}</div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>`).join('');

    observeCards();

  } catch (err) {
    console.error('Could not load profile:', err);
  }
}

loadProfile();