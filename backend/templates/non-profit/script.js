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
                navLinks.style.background = '#fbfaf7';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(43,89,63,0.06)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. Donation Button amount toggles
    const amountBtns = document.querySelectorAll('.amount-btn');
    const impactStatement = document.getElementById('impact-statement');

    const impacts = {
        '25': 'A $25 donation plants exactly 12 native saplings and funds 1 day of nursery compost.',
        '50': 'A $50 donation buys 25 saplings and equips 1 volunteer ranger with structural safety gear.',
        '100': 'A $100 donation plants 50 saplings and funds 1 week of soil microbiology assays.',
        '500': 'A $500 donation establishes 250 canopy seedlings and finances local community workshops.'
    };

    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.getAttribute('data-amount');

            // Set active class
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update statement
            if (impactStatement && impacts[amount]) {
                impactStatement.textContent = impacts[amount];
            }
        });
    });

    // 3. Donation details submit
    const donForm = document.getElementById('donation-details-form');
    const successMsg = document.getElementById('donation-success');

    if (donForm) {
        donForm.addEventListener('submit', (e) => {
            e.preventDefault();
            donForm.style.display = 'none';
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
            navbar.style.background = '#fbfaf7';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.02)';
        } else {
            navbar.style.height = '90px';
            navbar.style.boxShadow = 'none';
        }
    });
});
