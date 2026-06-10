// ==================== JKMART DATA STORE ====================
// All data is stored in localStorage and managed via this file

const JKMART = {
    // Default Site Information
    defaultSiteInfo: {
        siteName: "JKMART",
        tagline: "Everyday Essentials, Natural Wellness",
        phone: "+92 300 1234567",
        email: "info@jkmart.com",
        address: "Main Bazaar, Karachi, Pakistan",
        hours: "Mon - Sun: 9AM - 11PM",
        facebook: "https://facebook.com/jkmart",
        instagram: "https://instagram.com/jkmart",
        whatsapp: "+923001234567",
        currency: "Rs."
    },

    // Default Categories
    defaultCategories: [
        { id: 1, name: "Rice & Grains", icon: "fa-wheat-awn", count: 24 },
        { id: 2, name: "Lentils", icon: "fa-seedling", count: 18 },
        { id: 3, name: "Oils & Ghee", icon: "fa-oil-can", count: 12 },
        { id: 4, name: "Herbs", icon: "fa-leaf", count: 32 },
        { id: 5, name: "Spices", icon: "fa-mortar-pestle", count: 45 },
        { id: 6, name: "Seeds", icon: "fa-cannabis", count: 20 }
    ],

    // Default Products - Grocery Section
    defaultGroceryProducts: [
        {
            id: 1, name: "Premium Basmati Rice", category: "rice", section: "grocery",
            price: 850, oldPrice: 950, icon: "fa-wheat-awn",
            badge: "Best Seller", badgeType: "default",
            rating: 4.8, reviews: 124,
            description: "Premium quality long-grain basmati rice. Aromatic and fluffy.",
            stock: 50
        },
        {
            id: 2, name: "Chana Daal (Split Chickpeas)", category: "lentils", section: "grocery",
            price: 380, oldPrice: 420, icon: "fa-seedling",
            badge: "Organic", badgeType: "organic",
            rating: 4.7, reviews: 89,
            description: "Fresh, high-quality split chickpeas perfect for daily cooking.",
            stock: 75
        },
        {
            id: 3, name: "Desi Pure Ghee (1kg)", category: "oil", section: "grocery",
            price: 2400, oldPrice: 2600, icon: "fa-oil-can",
            badge: "Premium", badgeType: "default",
            rating: 4.9, reviews: 203,
            description: "100% pure desi ghee made from farm-fresh cow milk.",
            stock: 30
        },
        {
            id: 4, name: "Cold Pressed Mustard Oil", category: "oil", section: "grocery",
            price: 1200, oldPrice: 1400, icon: "fa-bottle-droplet",
            badge: "Organic", badgeType: "organic",
            rating: 4.6, reviews: 67,
            description: "Unrefined cold-pressed mustard oil. Pure and authentic.",
            stock: 40
        },
        {
            id: 5, name: "Masoor Daal (Red Lentils)", category: "lentils", section: "grocery",
            price: 320, oldPrice: 360, icon: "fa-bowl-rice",
            badge: "New", badgeType: "new",
            rating: 4.5, reviews: 45,
            description: "Premium quality red lentils, sorted and cleaned.",
            stock: 60
        },
        {
            id: 6, name: "Brown Rice (5kg)", category: "rice", section: "grocery",
            price: 1100, oldPrice: 1300, icon: "fa-wheat-awn-circle-exclamation",
            badge: "Healthy", badgeType: "organic",
            rating: 4.7, reviews: 92,
            description: "Whole grain brown rice rich in fiber and nutrients.",
            stock: 35
        },
        {
            id: 7, name: "Dish Soap & Cleaner", category: "household", section: "grocery",
            price: 250, oldPrice: 300, icon: "fa-soap",
            badge: "Sale", badgeType: "default",
            rating: 4.4, reviews: 38,
            description: "Effective dish soap that cuts grease easily.",
            stock: 100
        },
        {
            id: 8, name: "Mash Daal (Urad)", category: "lentils", section: "grocery",
            price: 450, oldPrice: 500, icon: "fa-bowl-food",
            badge: "Best Seller", badgeType: "default",
            rating: 4.6, reviews: 78,
            description: "High-quality whole urad daal for traditional recipes.",
            stock: 55
        }
    ],

    // Default Products - Pansar Section
    defaultPansarProducts: [
        {
            id: 101, name: "Pure Saffron (Kesar) 1g", category: "spices", section: "pansar",
            price: 1800, oldPrice: 2000, icon: "fa-fire-flame-curved",
            badge: "Premium", badgeType: "default",
            rating: 5.0, reviews: 156,
            description: "100% pure Kashmiri saffron, hand-picked threads.",
            stock: 20
        },
        {
            id: 102, name: "Ajwain (Carom Seeds)", category: "seeds", section: "pansar",
            price: 180, oldPrice: 220, icon: "fa-cannabis",
            badge: "Organic", badgeType: "organic",
            rating: 4.8, reviews: 67,
            description: "Aromatic carom seeds for digestive health.",
            stock: 80
        },
        {
            id: 103, name: "Triphala Powder (Herbal)", category: "herbs", section: "pansar",
            price: 350, oldPrice: 400, icon: "fa-mortar-pestle",
            badge: "Herbal", badgeType: "organic",
            rating: 4.9, reviews: 134,
            description: "Traditional ayurvedic blend of three fruits.",
            stock: 45
        },
        {
            id: 104, name: "Black Cumin Seeds (Kalonji)", category: "seeds", section: "pansar",
            price: 280, oldPrice: 320, icon: "fa-circle-dot",
            badge: "New", badgeType: "new",
            rating: 4.7, reviews: 89,
            description: "Pure black cumin seeds with numerous health benefits.",
            stock: 65
        },
        {
            id: 105, name: "Pure Coconut Oil (Unrefined)", category: "oils", section: "pansar",
            price: 950, oldPrice: 1100, icon: "fa-droplet",
            badge: "Organic", badgeType: "organic",
            rating: 4.8, reviews: 112,
            description: "Cold-pressed virgin coconut oil for cooking and skincare.",
            stock: 40
        },
        {
            id: 106, name: "Cinnamon Sticks (Dalchini)", category: "spices", section: "pansar",
            price: 220, oldPrice: 260, icon: "fa-tree",
            badge: "Premium", badgeType: "default",
            rating: 4.6, reviews: 76,
            description: "Authentic Ceylon cinnamon sticks, rich aroma.",
            stock: 70
        },
        {
            id: 107, name: "Tulsi (Holy Basil) Dried", category: "herbs", section: "pansar",
            price: 150, oldPrice: 180, icon: "fa-leaf",
            badge: "Herbal", badgeType: "organic",
            rating: 4.7, reviews: 58,
            description: "Dried tulsi leaves for tea and wellness.",
            stock: 90
        },
        {
            id: 108, name: "Green Cardamom (Elaichi)", category: "spices", section: "pansar",
            price: 1200, oldPrice: 1400, icon: "fa-pepper-hot",
            badge: "Premium", badgeType: "default",
            rating: 4.9, reviews: 167,
            description: "Whole green cardamom pods, premium quality.",
            stock: 35
        }
    ],

    // Storage Methods
    getSiteInfo() {
        const data = localStorage.getItem('jkmart_site_info');
        return data ? JSON.parse(data) : this.defaultSiteInfo;
    },
    saveSiteInfo(info) {
        localStorage.setItem('jkmart_site_info', JSON.stringify(info));
    },
    getCategories() {
        const data = localStorage.getItem('jkmart_categories');
        return data ? JSON.parse(data) : this.defaultCategories;
    },
    saveCategories(cats) {
        localStorage.setItem('jkmart_categories', JSON.stringify(cats));
    },
    getProducts() {
        const data = localStorage.getItem('jkmart_products');
        if (data) return JSON.parse(data);
        const allProducts = [...this.defaultGroceryProducts, ...this.defaultPansarProducts];
        this.saveProducts(allProducts);
        return allProducts;
    },
    saveProducts(products) {
        localStorage.setItem('jkmart_products', JSON.stringify(products));
    },
    getGroceryProducts() {
        return this.getProducts().filter(p => p.section === 'grocery');
    },
    getPansarProducts() {
        return this.getProducts().filter(p => p.section === 'pansar');
    },
    addProduct(product) {
        const products = this.getProducts();
        product.id = Date.now();
        products.push(product);
        this.saveProducts(products);
        return product;
    },
    updateProduct(id, data) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { ...products[index], ...data };
            this.saveProducts(products);
            return products[index];
        }
        return null;
    },
    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id != id);
        this.saveProducts(products);
    },
    resetAll() {
        localStorage.removeItem('jkmart_site_info');
        localStorage.removeItem('jkmart_categories');
        localStorage.removeItem('jkmart_products');
    },

    // Cart Management
    getCart() {
        const data = localStorage.getItem('jkmart_cart');
        return data ? JSON.parse(data) : [];
    },
    saveCart(cart) {
        localStorage.setItem('jkmart_cart', JSON.stringify(cart));
    },
    addToCart(productId) {
        const cart = this.getCart();
        const existing = cart.find(item => item.id == productId);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        this.saveCart(cart);
        return cart;
    },
    updateCartQty(productId, qty) {
        const cart = this.getCart();
        const item = cart.find(i => i.id == productId);
        if (item) {
            item.quantity = qty;
            if (qty <= 0) {
                return this.removeFromCart(productId);
            }
            this.saveCart(cart);
        }
        return cart;
    },
    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(i => i.id != productId);
        this.saveCart(cart);
        return cart;
    },
    clearCart() {
        this.saveCart([]);
    }
};
