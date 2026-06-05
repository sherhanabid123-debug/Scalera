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
                navLinks.style.background = '#09090b';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. Auto-rotating Testimonial Slider
    const slides = document.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;

    function rotateSlides() {
        if (slides.length <= 1) return;
        
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Rotate every 5 seconds
    setInterval(rotateSlides, 5000);

    // 3. Project Inquiry Form Submission
    const projForm = document.getElementById('project-form');
    const successMsg = document.getElementById('project-success');

    if (projForm) {
        projForm.addEventListener('submit', (e) => {
            e.preventDefault();
            projForm.style.display = 'none';
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
            navbar.style.background = '#09090b';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.height = '90px';
            navbar.style.boxShadow = 'none';
        }
    });
});
