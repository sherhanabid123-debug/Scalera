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
                navLinks.style.top = '85px';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = '#ffffff';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(14,22,38,0.08)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. Practice Accordions
    const triggers = document.querySelectorAll('.practice-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentNode;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.practice-item').forEach(el => el.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 3. Consultation Form Submission
    const contactForm = document.getElementById('consultation-form');
    const successMsg = document.getElementById('consultation-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.style.display = 'none';
            if (successMsg) {
                successMsg.style.display = 'block';
            }
        });
    }

    // 4. Shrink Header on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.style.top = '0';
            navbar.style.height = '70px';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.03)';
        } else {
            navbar.style.top = '34px';
            navbar.style.height = '85px';
            navbar.style.boxShadow = 'none';
        }
    });
});
