document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Toggle Menu
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            if (navLinks) {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = '#0a0a0c';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. Interactive Schedule Filter
    const filterBtns = document.querySelectorAll('.sched-btn');
    const schedContents = document.querySelectorAll('.sched-content');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetDay = btn.getAttribute('data-day');

            // Remove active states
            filterBtns.forEach(b => b.classList.remove('active'));
            schedContents.forEach(c => c.classList.remove('active'));

            // Add active states
            btn.classList.add('active');
            const activeContent = document.getElementById(targetDay);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // 3. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.height = '65px';
            navbar.style.background = '#0a0a0c';
        } else {
            navbar.style.height = '80px';
            navbar.style.background = 'rgba(10, 10, 12, 0.85)';
        }
    });
});
