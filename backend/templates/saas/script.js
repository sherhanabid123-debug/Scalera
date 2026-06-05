document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            // Basic mobile navbar implementation
            if (navLinks) {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = '#09090b';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. ROI Calculator Logic
    const teamSlider = document.getElementById('team-size');
    const spendSlider = document.getElementById('monthly-spend');
    const teamVal = document.getElementById('team-val');
    const spendVal = document.getElementById('spend-val');
    const savingsAmount = document.getElementById('savings-amount');

    function calculateSavings() {
        if (!teamSlider || !spendSlider) return;
        const teamSize = parseInt(teamSlider.value);
        const monthlySpend = parseInt(spendSlider.value);

        // Standard logic: 15 hrs per employee per month at $40/hr + 1.5% cashback on card spend
        const hoursSavedValue = teamSize * 15 * 40 * 12;
        const cashbackValue = monthlySpend * 0.015 * 12;
        const totalSavings = hoursSavedValue + cashbackValue;

        // Format to currency
        if (savingsAmount) {
            savingsAmount.textContent = '$' + totalSavings.toLocaleString('en-US', { maximumFractionDigits: 0 });
        }
    }

    if (teamSlider && spendSlider) {
        teamSlider.addEventListener('input', (e) => {
            if (teamVal) teamVal.textContent = e.target.value;
            calculateSavings();
        });

        spendSlider.addEventListener('input', (e) => {
            if (spendVal) {
                const val = parseInt(e.target.value);
                spendVal.textContent = '$' + val.toLocaleString('en-US');
            }
            calculateSavings();
        });
    }

    // 3. Pricing Toggle
    const billingToggleBtn = document.getElementById('billing-toggle-btn');
    const monthlyLabel = document.getElementById('billing-monthly');
    const yearlyLabel = document.getElementById('billing-yearly');
    const priceVals = document.querySelectorAll('.price-val');

    if (billingToggleBtn) {
        billingToggleBtn.addEventListener('click', () => {
            billingToggleBtn.classList.toggle('yearly');
            const isYearly = billingToggleBtn.classList.contains('yearly');

            if (isYearly) {
                if (monthlyLabel) monthlyLabel.classList.remove('active');
                if (yearlyLabel) yearlyLabel.classList.add('active');
            } else {
                if (monthlyLabel) monthlyLabel.classList.add('active');
                if (yearlyLabel) yearlyLabel.classList.remove('active');
            }

            priceVals.forEach(val => {
                const monthlyPrice = val.getAttribute('data-monthly');
                const yearlyPrice = val.getAttribute('data-yearly');
                val.textContent = isYearly ? yearlyPrice : monthlyPrice;
            });
        });
    }

    // 4. FAQ Accordion
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
});
