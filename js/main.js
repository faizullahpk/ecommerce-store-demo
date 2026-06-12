// ==================== QUICKCART MAIN SCRIPT ====================

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    loadSiteInfo();
    renderCategories();
    renderProducts();
    updateCartUI();
    initEventListeners();
    initAnimations();
    initCounters();
});

// ==================== PRELOADER ====================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progressBar');
    const percent = document.getElementById('preloaderPercent');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => { preloader.style.display = 'none'; }, 600);
            }, 300);
        }
        progressBar.style.width = progress + '%';
        percent.textContent = Math.floor(progress) + '%';
    }, 150);
}

// ==================== SITE INFO LOADING ====================
function loadSiteInfo() {
    const info = QUICKCART.getSiteInfo();
    document.getElementById('contactAddress').textContent = info.address;
    document.getElementById('contactPhone').textContent = info.phone;
    document.getElementById('contactEmail').textContent = info.email;
    document.getElementById('contactHours').textContent = info.hours;
    document.getElementById('footerAddress').textContent = info.address;
    document.getElementById('footerPhone').textContent = info.phone;
    document.getElementById('footerEmail').textContent = info.email;
}

// ==================== CATEGORIES ====================
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    const categories = QUICKCART.getCategories();
    grid.innerHTML = categories.map(cat => `
        <div class="category-card fade-up" data-tilt>
            <div class="category-icon"><i class="fas ${cat.icon}"></i></div>
            <h3>${cat.name}</h3>
            <p>${cat.count} Products</p>
        </div>
    `).join('');
}

// ==================== PRODUCTS ====================
function renderProducts(filterSection = 'all', filterCategory = 'all') {
    renderProductSection('grocery', 'groceryGrid', filterCategory);
    renderProductSection('pansar', 'pansarGrid', filterCategory);
}

function renderProductSection(section, gridId, filterCategory = 'all') {
    const grid = document.getElementById(gridId);
    let products = section === 'grocery' ? QUICKCART.getGroceryProducts() : QUICKCART.getPansarProducts();
    if (filterCategory !== 'all') {
        products = products.filter(p => p.category === filterCategory);
    }
    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--gray);">No products found in this category.</p>';
        return;
    }
    grid.innerHTML = products.map(p => createProductCard(p)).join('');
    // Re-init tilt for product cards
    grid.querySelectorAll('.product-card').forEach(el => new VanillaTilt(el, { maxTilt: 8, scale: 1.02, glare: true, maxGlare: 0.2 }));
}

function createProductCard(p) {
    const info = QUICKCART.getSiteInfo();
    const stars = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
    return `
        <div class="product-card fade-up" data-id="${p.id}">
            <div class="product-image">
                ${p.badge ? `<span class="product-badge ${p.badgeType || ''}">${p.badge}</span>` : ''}
                <div class="product-actions-overlay">
                    <button class="product-action" title="Quick View"><i class="fas fa-eye"></i></button>
                    <button class="product-action" title="Add to Wishlist"><i class="far fa-heart"></i></button>
                </div>
                <i class="fas ${p.icon || 'fa-box'}"></i>
            </div>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span>(${p.reviews || 0})</span>
                </div>
                <div class="product-price-row">
                    <div class="product-price">
                        <span class="price-current">${info.currency} ${p.price}</span>
                        ${p.oldPrice ? `<span class="price-old">${info.currency} ${p.oldPrice}</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${p.id})" title="Add to Cart">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==================== CART ====================
function addToCart(productId) {
    QUICKCART.addToCart(productId);
    updateCartUI();
    showToast('Added to cart!');
    // Bounce animation on cart icon
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.animation = 'none';
    setTimeout(() => { cartBtn.style.animation = 'pulse 0.5s ease'; }, 10);
}

function updateCartUI() {
    const cart = QUICKCART.getCart();
    const products = QUICKCART.getProducts();
    const info = QUICKCART.getSiteInfo();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;

    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <h4>Your cart is empty</h4>
                <p>Add products to get started</p>
            </div>
        `;
        cartTotalEl.textContent = `${info.currency} 0`;
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        const product = products.find(p => p.id == item.id);
        if (!product) return '';
        const subtotal = product.price * item.quantity;
        total += subtotal;
        return `
            <div class="cart-item">
                <div class="cart-item-img"><i class="fas ${product.icon || 'fa-box'}"></i></div>
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <span class="price">${info.currency} ${product.price}</span>
                    <div class="cart-qty">
                        <button onclick="changeQty(${product.id}, ${item.quantity - 1})">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty(${product.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${product.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }).join('');
    cartTotalEl.textContent = `${info.currency} ${total.toLocaleString()}`;
}

function changeQty(id, qty) {
    QUICKCART.updateCartQty(id, qty);
    updateCartUI();
}
function removeFromCart(id) {
    QUICKCART.removeFromCart(id);
    updateCartUI();
    showToast('Removed from cart');
}

// ==================== UI EVENTS ====================
function initEventListeners() {
    // Header scroll
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    // Mobile menu
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('nav').classList.toggle('active');
    });

    // Search toggle
    document.getElementById('searchToggle').addEventListener('click', () => {
        document.getElementById('searchBar').classList.toggle('active');
    });

    // Cart toggle
    document.getElementById('cartToggle').addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.add('active');
        document.getElementById('overlay').classList.add('active');
    });
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('overlay').addEventListener('click', closeCart);

    function closeCart() {
        document.getElementById('cartSidebar').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    }

    // Back to top
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            document.getElementById('nav').classList.remove('active');
        });
    });

    // Filter tabs
    document.querySelectorAll('#groceryTabs .filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#groceryTabs .filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderProductSection('grocery', 'groceryGrid', tab.dataset.filter);
        });
    });
    document.querySelectorAll('#pansarTabs .filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#pansarTabs .filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderProductSection('pansar', 'pansarGrid', tab.dataset.filter);
        });
    });

    // Forms
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for subscribing!');
            e.target.reset();
        });
    }
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message sent successfully!');
            e.target.reset();
        });
    }

    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                renderProducts();
                return;
            }
            filterProductsBySearch(query);
        });
    }
}

function filterProductsBySearch(query) {
    const allProducts = QUICKCART.getProducts();
    ['grocery', 'pansar'].forEach(section => {
        const filtered = allProducts.filter(p => 
            p.section === section && 
            (p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
        );
        const grid = document.getElementById(section === 'grocery' ? 'groceryGrid' : 'pansarGrid');
        if (filtered.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray);">No matching products found.</p>';
        } else {
            grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
            grid.querySelectorAll('.product-card').forEach(el => new VanillaTilt(el, { maxTilt: 8, scale: 1.02 }));
        }
    });
}

// ==================== TOAST ====================
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== ANIMATIONS ====================
function initAnimations() {
    // Init 3D Tilt for static elements
    VanillaTilt.init('[data-tilt]', { maxTilt: 10, scale: 1.03, glare: true, maxGlare: 0.2 });

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    
    // Add fade-up to sections
    document.querySelectorAll('section').forEach(s => {
        s.classList.add('fade-up');
        observer.observe(s);
    });
}

// ==================== COUNTERS ====================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.dataset.target;
                const increment = target / speed;
                let count = 0;
                const updateCount = () => {
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count).toLocaleString();
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

// Make functions globally available
window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;