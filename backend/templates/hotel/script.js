// ──────────────────────────────────────
// The Elara Hotel — Script
// ──────────────────────────────────────

// 1. Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
});

// 2. Mobile menu
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
    const sides = document.querySelectorAll('.nav-side');
    sides.forEach(s => s.classList.toggle('open'));
});

// 3. Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
});

// 4. Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => obs.observe(el));

// 5. Parallax hero (subtle)
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-bg');
    if (hero) { hero.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`; }
});
