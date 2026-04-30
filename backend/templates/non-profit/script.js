// Horizon Foundation — Script

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

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => obs.observe(el));

// Amount buttons
document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const custom = document.querySelector('.custom-amount');
        if (custom) custom.value = '';
        const submit = document.querySelector('.btn-donate-submit');
        if (submit) submit.textContent = `Donate ${btn.textContent} Monthly ❤`;
    });
});

// Frequency toggle
document.querySelectorAll('.freq').forEach(f => {
    f.addEventListener('click', () => {
        document.querySelectorAll('.freq').forEach(b => b.classList.remove('active'));
        f.classList.add('active');
    });
});

// Counter animation
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        if (!target) return;
        const duration = 2500;
        let start = null;
        const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            let val = Math.floor(eased * target);
            if (target >= 1000000) el.textContent = (val / 1000000).toFixed(1) + 'M+';
            else if (target >= 1000) el.textContent = Math.floor(val / 1000) + 'K+';
            else el.textContent = val;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}

const strip = document.querySelector('.impact-strip');
if (strip) {
    const so = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { animateCounters(); so.disconnect(); } });
    }, { threshold: 0.3 });
    so.observe(strip);
}
