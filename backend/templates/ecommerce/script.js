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
                navLinks.style.background = '#fafafa';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(0,0,0,0.07)';
                navLinks.style.gap = '1.5rem';
            }
        });
    }

    // 2. Product Categories Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const prodCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-category');

            // Set active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Hide/Show cards
            prodCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. Cart Drawer Mock Storage
    const cartTrigger = document.querySelector('.cart-trigger');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.querySelector('.cart-close');
    const quickAddBtns = document.querySelectorAll('.btn-quick-add');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalAmount = document.getElementById('cart-total-amount');

    let cart = [];

    function updateCartUI() {
        // Update count
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartCount) cartCount.textContent = totalItems;

        // Render rows
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your shopping bag is empty.</p>';
            } else {
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item-row">
                        <div>
                            <span class="cart-item-name">${item.name}</span>
                            <span style="font-size: 0.8rem; color: #707070;">(x${item.qty})</span>
                        </div>
                        <span class="cart-item-price">$${item.price * item.qty}</span>
                    </div>
                `).join('');
            }
        }

        // Calculate total
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        if (cartTotalAmount) {
            cartTotalAmount.textContent = '$' + totalAmount;
        }
    }

    function toggleCart(open) {
        if (cartDrawer && cartOverlay) {
            if (open) {
                cartDrawer.classList.add('active');
                cartOverlay.classList.add('active');
            } else {
                cartDrawer.classList.remove('active');
                cartOverlay.classList.remove('active');
            }
        }
    }

    if (cartTrigger) {
        cartTrigger.addEventListener('click', () => toggleCart(true));
    }
    if (cartClose) {
        cartClose.addEventListener('click', () => toggleCart(false));
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => toggleCart(false));
    }

    quickAddBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'));

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ id, name, price, qty: 1 });
            }

            updateCartUI();
            toggleCart(true);
        });
    });

    // 4. Checkout Callback Mock
    const checkoutBtn = document.getElementById('btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Proceeding to secure stripe checkout simulation...');
            cart = [];
            updateCartUI();
            toggleCart(false);
        });
    }
});
