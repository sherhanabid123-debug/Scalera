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
                navLinks.style.top = '90px';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = '#faf9f6';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(74,92,80,0.05)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. Treatment Accordions
    const triggers = document.querySelectorAll('.treatment-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentNode;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.treatment-item').forEach(el => el.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 3. Booking Form Submission
    const bookingForm = document.getElementById('spa-booking-form');
    const successMsg = document.getElementById('spa-success');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            bookingForm.style.display = 'none';
            if (successMsg) {
                successMsg.style.display = 'block';
            }
        });
    }

    // 4. Navbar styling on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.height = '70px';
            navbar.style.background = '#faf9f6';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.02)';
        } else {
            navbar.style.height = '90px';
            navbar.style.boxShadow = 'none';
        }
    });
});
