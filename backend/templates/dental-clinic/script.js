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
                navLinks.style.borderBottom = '1px solid rgba(13,148,136,0.08)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. FAQ Accordion
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentNode;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 3. Appointment Form Submission
    const appForm = document.getElementById('appointment-form');
    const successMsg = document.getElementById('booking-success');

    if (appForm) {
        appForm.addEventListener('submit', (e) => {
            e.preventDefault();
            appForm.style.display = 'none';
            if (successMsg) {
                successMsg.style.display = 'block';
            }
        });
    }

    // 4. Navbar styling on scroll
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
