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
                navLinks.style.background = '#0b0b0e';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. Property Sorting Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const propCards = document.querySelectorAll('.property-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Set active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Hide/Show cards
            propCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. Interest Form Handling
    const interestForm = document.getElementById('interest-form');
    const successMsg = document.getElementById('interest-success');

    if (interestForm) {
        interestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            interestForm.style.display = 'none';
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
            navbar.style.background = '#0b0b0e';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.height = '90px';
            navbar.style.boxShadow = 'none';
        }
    });
});
