// EduFlow — Script

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const t = document.querySelector(this.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
});

// Category tabs
document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => obs.observe(el));

// Stat counter
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        if (!target) return;
        const duration = 2000;
        let start = null;
        const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            let val = Math.floor(eased * target);
            if (target >= 10000) el.textContent = (val / 1000000).toFixed(1) + 'M+';
            else el.textContent = val.toLocaleString() + '+';
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}
const statsEl = document.querySelector('.stats-section');
if (statsEl) {
    const so = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { animateCounters(); so.disconnect(); } });
    }, { threshold: 0.3 });
    so.observe(statsEl);
}
