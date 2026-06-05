document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
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
                navLinks.style.background = '#ffffff';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. Partner Inquiry Form Submission
    const partnerForm = document.getElementById('partner-form');
    const successMsg = document.getElementById('partner-success');

    if (partnerForm) {
        partnerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            partnerForm.style.display = 'none';
            if (successMsg) {
                successMsg.style.display = 'block';
            }
        });
    }

    // 3. Navbar styling on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.height = '65px';
            navbar.style.background = '#ffffff';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.02)';
        } else {
            navbar.style.height = '80px';
            navbar.style.boxShadow = 'none';
        }
    });
});
