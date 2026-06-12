// ==================== QUICKCART ADMIN PANEL ====================

const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    checkAuth();
    initLogin();
    initTilt();
});

function initPreloader() {
    setTimeout(() => {
        const p = document.getElementById('preloader');
        p.classList.add('hidden');
        setTimeout(() => { p.style.display = 'none'; }, 600);
    }, 1500);
}

function initTilt() {
    setTimeout(() => {
        VanillaTilt.init('[data-tilt]', { maxTilt: 8, scale: 1.02, glare: true, maxGlare: 0.15 });
    }, 100);
}

// ==================== AUTH ====================
function checkAuth() {
    const loggedIn = sessionStorage.getItem('quickcart_admin_logged_in');
    if (loggedIn === 'true') {
        showAdmin();
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminWrapper').style.display = 'none';
}

function showAdmin() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminWrapper').style.display = 'grid';
    initAdmin();
}

function initLogin() {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            sessionStorage.setItem('quickcart_admin_logged_in', 'true');
            showToast('Login successful!');
            setTimeout(showAdmin, 500);
        } else {
            showToast('Invalid credentials!', 'error');
        }
    });
}

// ==================== ADMIN INIT ====================
function initAdmin() {
    initSidebar();
    initTabs();
    loadDashboard();
    loadProducts();
    loadCategories();
    loadSiteInfoForm();
    loadContactInfoForm();
    initProductForm();
    initSiteInfoForm();
    initContactInfoForm();
    initProductSearch();
    initLogout();
    initTilt();
}

// ==================== SIDEBAR & TABS ====================
function initSidebar() {
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('active');
    });
    document.getElementById('sidebarClose').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('active');
    });
}

function initTabs() {
    // Sidebar links
    document.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.tab);
        });
    });
    // Quick actions and buttons with data-tab
    document.querySelectorAll('[data-tab]:not(.sidebar-link)').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(el.dataset.tab);
        });
    });
    // Cancel product button
    const cancelBtn = document.getElementById('cancelProductBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            resetProductForm();
            switchTab('products');
        });
    }
}

const TAB_TITLES = {
    'dashboard': { title: 'Dashboard', subtitle: 'Welcome back, Admin!' },
    'products': { title: 'Products', subtitle: 'Manage your store products' },
    'add-product': { title: 'Add Product', subtitle: 'Create a new product' },
    'categories': { title: 'Categories', subtitle: 'Manage product categories' },
    'site-info': { title: 'Site Information', subtitle: 'Edit basic site details' },
    'contact-info': { title: 'Contact Information', subtitle: 'Update your contact details' }
};

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    const link = document.querySelector(`.sidebar-link[data-tab="${tabId}"]`);
    if (link) link.classList.add('active');
    
    const meta = TAB_TITLES[tabId];
    if (meta) {
        document.getElementById('pageTitle').textContent = meta.title;
        document.getElementById('pageSubtitle').textContent = meta.subtitle;
    }
    document.getElementById('sidebar').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(initTilt, 200);
}

// ==================== DASHBOARD ====================
function loadDashboard() {
    const products = QUICKCART.getProducts();
    const grocery = products.filter(p => p.section === 'grocery');
    const pansar = products.filter(p => p.section === 'pansar');
    const categories = QUICKCART.getCategories();

    animateValue('totalProducts', 0, products.length, 1000);
    animateValue('groceryCount', 0, grocery.length, 1000);
    animateValue('pansarCount', 0, pansar.length, 1000);
    animateValue('categoryCount', 0, categories.length, 1000);

    // Recent products (last 5 added)
    const recent = [...products].slice(-5).reverse();
    const info = QUICKCART.getSiteInfo();
    document.getElementById('recentProducts').innerHTML = recent.map(p => `
        <div class="recent-product">
            <div class="recent-product-icon"><i class="fas ${p.icon || 'fa-box'}"></i></div>
            <div class="recent-product-info">
                <h4>${p.name}</h4>
                <p>${p.section} • ${p.category}</p>
            </div>
            <div class="recent-product-price">${info.currency} ${p.price}</div>
        </div>
    `).join('');
}

function animateValue(id, start, end, duration) {
    const el = document.getElementById(id);
    const range = end - start;
    const startTime = performance.now();
    const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.floor(start + range * progress);
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

// ==================== PRODUCTS TABLE ====================
function loadProducts(filterSection = 'all', searchQuery = '') {
    let products = QUICKCART.getProducts();
    if (filterSection !== 'all') {
        products = products.filter(p => p.section === filterSection);
    }
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    const tbody = document.getElementById('productsTableBody');
    const info = QUICKCART.getSiteInfo();
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:40px; color:var(--gray);">No products found</td></tr>';
        return;
    }
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>
                <div class="product-cell">
                    <div class="product-cell-icon"><i class="fas ${p.icon || 'fa-box'}"></i></div>
                    <div>
                        <div class="product-cell-name">${p.name}</div>
                        <small style="color:var(--gray)">${p.badge || ''}</small>
                    </div>
                </div>
            </td>
            <td><span class="section-pill ${p.section}">${p.section}</span></td>
            <td><span class="category-pill">${p.category}</span></td>
            <td class="price-cell">${info.currency} ${p.price}</td>
            <td class="stock-cell ${p.stock < 20 ? 'low' : ''}">${p.stock || 0}</td>
            <td class="rating-cell">★ ${p.rating || 0}</td>
            <td class="actions-cell">
                <button class="btn-icon" onclick="editProduct(${p.id})" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete" onclick="deleteProductConfirm(${p.id})" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function initProductSearch() {
    document.getElementById('productSearch').addEventListener('input', (e) => {
        const section = document.getElementById('sectionFilter').value;
        loadProducts(section, e.target.value);
    });
    document.getElementById('sectionFilter').addEventListener('change', (e) => {
        const search = document.getElementById('productSearch').value;
        loadProducts(e.target.value, search);
    });
}

// ==================== PRODUCT FORM ====================
function initProductForm() {
    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('productId').value;
        const product = {
            name: document.getElementById('prodName').value.trim(),
            section: document.getElementById('prodSection').value,
            category: document.getElementById('prodCategory').value.trim().toLowerCase(),
            icon: document.getElementById('prodIcon').value.trim() || 'fa-box',
            price: parseFloat(document.getElementById('prodPrice').value) || 0,
            oldPrice: parseFloat(document.getElementById('prodOldPrice').value) || null,
            stock: parseInt(document.getElementById('prodStock').value) || 0,
            rating: parseFloat(document.getElementById('prodRating').value) || 0,
            reviews: parseInt(document.getElementById('prodReviews').value) || 0,
            badge: document.getElementById('prodBadge').value.trim(),
            badgeType: document.getElementById('prodBadgeType').value,
            description: document.getElementById('prodDesc').value.trim()
        };

        if (id) {
            QUICKCART.updateProduct(id, product);
            showToast('Product updated successfully!');
        } else {
            QUICKCART.addProduct(product);
            showToast('Product added successfully!');
        }
        resetProductForm();
        loadProducts();
        loadDashboard();
        switchTab('products');
    });
}

function resetProductForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('prodIcon').value = 'fa-box';
    document.getElementById('prodRating').value = '4.5';
    document.getElementById('productFormTitle').textContent = 'Add New Product';
}

function editProduct(id) {
    const product = QUICKCART.getProducts().find(p => p.id == id);
    if (!product) return;
    document.getElementById('productId').value = product.id;
    document.getElementById('prodName').value = product.name || '';
    document.getElementById('prodSection').value = product.section || 'grocery';
    document.getElementById('prodCategory').value = product.category || '';
    document.getElementById('prodIcon').value = product.icon || 'fa-box';
    document.getElementById('prodPrice').value = product.price || 0;
    document.getElementById('prodOldPrice').value = product.oldPrice || '';
    document.getElementById('prodStock').value = product.stock || 0;
    document.getElementById('prodRating').value = product.rating || 4.5;
    document.getElementById('prodReviews').value = product.reviews || 0;
    document.getElementById('prodBadge').value = product.badge || '';
    document.getElementById('prodBadgeType').value = product.badgeType || 'default';
    document.getElementById('prodDesc').value = product.description || '';
    document.getElementById('productFormTitle').textContent = 'Edit Product';
    switchTab('add-product');
}

function deleteProductConfirm(id) {
    showConfirmModal('Delete Product?', 'This product will be permanently removed.', () => {
        QUICKCART.deleteProduct(id);
        showToast('Product deleted!');
        loadProducts();
        loadDashboard();
    });
}

// ==================== CATEGORIES ====================
function loadCategories() {
    const cats = QUICKCART.getCategories();
    const list = document.getElementById('categoriesList');
    list.innerHTML = cats.map(c => `
        <div class="category-item" data-tilt>
            <div class="category-item-icon"><i class="fas ${c.icon}"></i></div>
            <h3>${c.name}</h3>
            <p>${c.count} Products</p>
            <div class="category-item-actions">
                <button class="btn-icon" onclick="editCategory(${c.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete" onclick="deleteCategoryConfirm(${c.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
    setTimeout(initTilt, 100);

    document.getElementById('addCategoryBtn').onclick = () => {
        const name = prompt('Category name:');
        if (!name) return;
        const icon = prompt('Font Awesome icon (e.g. fa-leaf):', 'fa-tag') || 'fa-tag';
        const cats = QUICKCART.getCategories();
        cats.push({ id: Date.now(), name, icon, count: 0 });
        QUICKCART.saveCategories(cats);
        loadCategories();
        loadDashboard();
        showToast('Category added!');
    };
}

function editCategory(id) {
    const cats = QUICKCART.getCategories();
    const cat = cats.find(c => c.id == id);
    if (!cat) return;
    const name = prompt('Category name:', cat.name);
    if (!name) return;
    const icon = prompt('Icon:', cat.icon) || cat.icon;
    cat.name = name; cat.icon = icon;
    QUICKCART.saveCategories(cats);
    loadCategories();
    showToast('Category updated!');
}

function deleteCategoryConfirm(id) {
    showConfirmModal('Delete Category?', 'This category will be permanently removed.', () => {
        let cats = QUICKCART.getCategories();
        cats = cats.filter(c => c.id != id);
        QUICKCART.saveCategories(cats);
        loadCategories();
        loadDashboard();
        showToast('Category deleted!');
    });
}

// ==================== SITE INFO ====================
function loadSiteInfoForm() {
    const info = QUICKCART.getSiteInfo();
    document.getElementById('siteName').value = info.siteName || '';
    document.getElementById('siteTagline').value = info.tagline || '';
    document.getElementById('siteCurrency').value = info.currency || 'Rs.';
    document.getElementById('siteFacebook').value = info.facebook || '';
    document.getElementById('siteInstagram').value = info.instagram || '';
    document.getElementById('siteWhatsapp').value = info.whatsapp || '';
}

function initSiteInfoForm() {
    document.getElementById('siteInfoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const info = QUICKCART.getSiteInfo();
        info.siteName = document.getElementById('siteName').value.trim();
        info.tagline = document.getElementById('siteTagline').value.trim();
        info.currency = document.getElementById('siteCurrency').value.trim();
        info.facebook = document.getElementById('siteFacebook').value.trim();
        info.instagram = document.getElementById('siteInstagram').value.trim();
        info.whatsapp = document.getElementById('siteWhatsapp').value.trim();
        QUICKCART.saveSiteInfo(info);
        showToast('Site info saved!');
    });
}

// ==================== CONTACT INFO ====================
function loadContactInfoForm() {
    const info = QUICKCART.getSiteInfo();
    document.getElementById('contactPhone').value = info.phone || '';
    document.getElementById('contactEmail').value = info.email || '';
    document.getElementById('contactAddress').value = info.address || '';
    document.getElementById('contactHours').value = info.hours || '';
}

function initContactInfoForm() {
    document.getElementById('contactInfoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const info = QUICKCART.getSiteInfo();
        info.phone = document.getElementById('contactPhone').value.trim();
        info.email = document.getElementById('contactEmail').value.trim();
        info.address = document.getElementById('contactAddress').value.trim();
        info.hours = document.getElementById('contactHours').value.trim();
        QUICKCART.saveSiteInfo(info);
        showToast('Contact info saved!');
    });
}

// ==================== LOGOUT ====================
function initLogout() {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showConfirmModal('Logout?', 'You will be signed out of the admin panel.', () => {
            sessionStorage.removeItem('quickcart_admin_logged_in');
            location.reload();
        }, 'Yes, Logout');
    });
}

// ==================== MODAL ====================
function showConfirmModal(title, message, onConfirm, confirmText = 'Yes, Delete') {
    const modal = document.getElementById('confirmModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('modalConfirm').textContent = confirmText;
    modal.classList.add('active');

    const confirmBtn = document.getElementById('modalConfirm');
    const cancelBtn = document.getElementById('modalCancel');

    const newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
    const newCancel = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

    newConfirm.addEventListener('click', () => {
        modal.classList.remove('active');
        onConfirm();
    });
    newCancel.addEventListener('click', () => modal.classList.remove('active'));
}

// ==================== TOAST ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.className = 'toast' + (type === 'error' ? ' error' : '');
    toast.querySelector('i').className = type === 'error' ? 'fas fa-times-circle' : 'fas fa-check-circle';
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Make functions globally available
window.editProduct = editProduct;
window.deleteProductConfirm = deleteProductConfirm;
window.editCategory = editCategory;
window.deleteCategoryConfirm = deleteCategoryConfirm;