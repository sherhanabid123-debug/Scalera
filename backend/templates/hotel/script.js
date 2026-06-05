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
                navLinks.style.background = '#fdfcf7';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(44,40,37,0.08)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. Room details accordion
    const detailBtns = document.querySelectorAll('.btn-room-details');

    detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-room');
            const targetEl = document.getElementById(targetId);

            if (targetEl) {
                const isActive = targetEl.classList.contains('active');
                
                // Toggle active class
                targetEl.classList.toggle('active');
                
                if (isActive) {
                    btn.innerHTML = 'View Details &rarr;';
                } else {
                    btn.innerHTML = 'Hide Details &larr;';
                }
            }
        });
    });

    // 3. Search Availability Form
    const bookingForm = document.getElementById('booking-form');
    const successMsg = document.getElementById('booking-success');

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
            navbar.style.background = '#fdfcf7';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.height = '90px';
            navbar.style.boxShadow = 'none';
        }
    });
});
