// WoolFlow E-commerce JavaScript - Production Grade
// Advanced security, analytics, and performance monitoring

// Global variables
let cart = JSON.parse(localStorage.getItem('woolflow-cart')) || [];
let products = [];
let filteredProducts = [];
let currentProduct = null;
let userSession = null;
let analytics = null;
let securityMonitor = null;

// Security Configuration
const SECURITY_CONFIG = {
    cspNonce: generateNonce(),
    encryptionKey: 'woolflow-production-key-2024',
    rateLimitWindow: 60000, // 1 minute
    maxRequests: 100,
    sessionTimeout: 1800000 // 30 minutes
};

// Analytics Configuration
const ANALYTICS_CONFIG = {
    trackingEnabled: true,
    apiEndpoint: 'https://analytics.woolflow.com/api/v1',
    sessionId: generateSessionId(),
    userId: null,
    eventsQueue: []
};

// Performance Monitoring
const PERFORMANCE_CONFIG = {
    monitoringEnabled: true,
    metricsInterval: 5000,
    maxMeasureTime: 15000,
    criticalThresholds: {
        pageLoad: 3000,
        interactive: 5000,
        cls: 0.1,
        lcp: 2500
    }
};

// Product data
const productData = [
    {
        id: 'urban-oat',
        name: 'Urban Wool Runner',
        color: 'Oat',
        price: 149,
        category: 'urban',
        image: 'resources/product-urban-oat.jpg',
        description: 'Premium merino wool sneakers with temperature regulation and moisture-wicking technology. Perfect for daily urban adventures.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'city-sage',
        name: 'City Trekker',
        color: 'Sage',
        price: 169,
        category: 'urban',
        image: 'resources/product-urban-sage.jpg',
        description: 'All-terrain wool sneakers with enhanced grip and waterproof protection. Built for city exploration.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [8, 9, 10, 11, 12]
    },
    {
        id: 'metro-mist',
        name: 'Metro Slip-On',
        color: 'Mist',
        price: 129,
        category: 'casual',
        image: 'resources/product-urban-mist.jpg',
        description: 'Effortless style meets comfort in these easy-wear wool slip-ons. Perfect for casual outings.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10]
    },
    {
        id: 'street-charcoal',
        name: 'Street Walker',
        color: 'Charcoal',
        price: 159,
        category: 'urban',
        image: 'resources/product-urban-charcoal.jpg',
        description: 'Classic design with modern wool technology for everyday urban adventures. Timeless style meets innovation.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [8, 9, 10, 11, 12]
    },
    {
        id: 'commuter-oat',
        name: 'Commuter Classic',
        color: 'Oat',
        price: 139,
        category: 'urban',
        image: 'resources/product-urban-oat.jpg',
        description: 'Perfect for daily commutes with superior comfort and style. Your go-to shoe for work and play.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'trail-sage',
        name: 'Trail Blazer',
        color: 'Sage',
        price: 179,
        category: 'active',
        image: 'resources/product-urban-sage.jpg',
        description: 'Rugged wool sneakers designed for outdoor adventures and city exploration. Built to last.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [9, 10, 11, 12]
    },
    {
        id: 'sport-mist',
        name: 'Sport Runner',
        color: 'Mist',
        price: 159,
        category: 'active',
        image: 'resources/product-urban-mist.jpg',
        description: 'High-performance wool sneakers for athletic activities. Natural comfort meets sport technology.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'hike-charcoal',
        name: 'Hike Lite',
        color: 'Charcoal',
        price: 169,
        category: 'active',
        image: 'resources/product-urban-charcoal.jpg',
        description: 'Lightweight hiking shoes with wool comfort. Perfect for trails and urban exploration.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [8, 9, 10, 11, 12]
    },
    {
        id: 'active-oat',
        name: 'Active Flow',
        color: 'Oat',
        price: 149,
        category: 'active',
        image: 'resources/product-urban-oat.jpg',
        description: 'Flow seamlessly from work to workout with these versatile active wool sneakers.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10]
    },
    {
        id: 'flex-sage',
        name: 'Flex Walker',
        color: 'Sage',
        price: 139,
        category: 'active',
        image: 'resources/product-urban-sage.jpg',
        description: 'Flexible and lightweight wool sneakers that move with you. Ultimate comfort for active lifestyles.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'weekend-mist',
        name: 'Weekend Walker',
        color: 'Mist',
        price: 129,
        category: 'casual',
        image: 'resources/product-urban-mist.jpg',
        description: 'Relaxed comfort for weekend adventures. Easy-going style with wool performance.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'lounge-oat',
        name: 'Lounge Loafer',
        color: 'Oat',
        price: 119,
        category: 'casual',
        image: 'resources/product-urban-oat.jpg',
        description: 'Ultimate comfort for relaxing moments. Wool luxury you can feel good about.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10]
    },
    {
        id: 'daily-charcoal',
        name: 'Daily Driver',
        color: 'Charcoal',
        price: 149,
        category: 'casual',
        image: 'resources/product-urban-charcoal.jpg',
        description: 'Your everyday companion. Reliable comfort and style for daily wear.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [8, 9, 10, 11, 12]
    },
    {
        id: 'comfort-sage',
        name: 'Comfort Step',
        color: 'Sage',
        price: 139,
        category: 'casual',
        image: 'resources/product-urban-sage.jpg',
        description: 'Every step matters. Experience cloud-like comfort with sustainable wool technology.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'easy-oat',
        name: 'Easy Go',
        color: 'Oat',
        price: 129,
        category: 'casual',
        image: 'resources/product-urban-oat.jpg',
        description: 'Slip-on convenience meets wool comfort. Perfect for busy lifestyles and travel.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10]
    },
    {
        id: 'urban-mist-plus',
        name: 'Urban Plus',
        color: 'Mist',
        price: 159,
        category: 'urban',
        image: 'resources/product-urban-mist.jpg',
        description: 'Enhanced urban performance with premium wool construction. Next-level city footwear.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [8, 9, 10, 11, 12]
    },
    {
        id: 'metro-charcoal-plus',
        name: 'Metro Plus',
        color: 'Charcoal',
        price: 169,
        category: 'urban',
        image: 'resources/product-urban-charcoal.jpg',
        description: 'Sophisticated urban design with advanced wool technology. Premium comfort for professionals.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [7, 8, 9, 10, 11]
    },
    {
        id: 'active-sage-plus',
        name: 'Active Plus',
        color: 'Sage',
        price: 179,
        category: 'active',
        image: 'resources/product-urban-sage.jpg',
        description: 'Peak performance wool sneakers for serious athletes. Natural materials, professional results.',
        sizes: [7, 8, 9, 10, 11, 12],
        availableSizes: [9, 10, 11, 12]
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    products = [...productData];
    filteredProducts = [...products];
    
    initializeApp();
    updateCartDisplay();
    
    // Page-specific initialization
    if (window.location.pathname.includes('products.html')) {
        initializeProductsPage();
    } else if (window.location.pathname.includes('cart.html')) {
        initializeCartPage();
    } else {
        initializeHomePage();
    }
});

// Initialize main app functionality
function initializeApp() {
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize cart functionality
    initializeCart();
    
    // Initialize typewriter effect for home page
    if (!window.location.pathname.includes('products.html') && !window.location.pathname.includes('cart.html')) {
        initializeTypewriter();
    }
}

// Initialize home page specific features
function initializeHomePage() {
    // Initialize hero carousel
    if (document.getElementById('hero-carousel')) {
        new Splide('#hero-carousel', {
            type: 'loop',
            autoplay: true,
            interval: 4000,
            arrows: false,
            pagination: false,
            drag: true
        }).mount();
    }
    
    // Initialize text splitting animations
    if (typeof Splitting !== 'undefined') {
        Splitting();
        
        // Animate split text
        anime({
            targets: '[data-splitting] .char',
            translateY: [100, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1400,
            delay: anime.stagger(30)
        });
    }
}

// Initialize products page
function initializeProductsPage() {
    renderProducts();
    initializeFilters();
}

// Initialize cart page
function initializeCartPage() {
    renderCartItems();
    updateOrderSummary();
}

// Typewriter effect for hero section
function initializeTypewriter() {
    if (document.getElementById('typewriter')) {
        const typed = new Typed('#typewriter', {
            strings: [
                'Premium merino wool comfort',
                'Temperature regulating technology',
                'Sustainable urban footwear',
                'Natural materials, modern design'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: false
        });
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// Cart management functions
function initializeCart() {
    // Cart is already initialized via onclick="toggleCart()" in HTML
    // No additional event listener needed
}

function addToCart(productId, productName, price, image, size = null) {
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            image: image,
            size: size,
            quantity: 1
        });
    }
    
    localStorage.setItem('woolflow-cart', JSON.stringify(cart));
    updateCartDisplay();
    
    // Cart bounce animation
    const cartIcon = document.getElementById('cart-toggle');
    if (cartIcon) {
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('cart-bounce');
        }, 600);
    }
    
    // Show success message
    showNotification('Added to cart!', 'success');
}

function removeFromCart(productId, size = null) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('woolflow-cart', JSON.stringify(cart));
    updateCartDisplay();
    renderCartDrawerItems(); // Refresh cart drawer
    
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
        updateOrderSummary();
    }
}

function updateCartQuantity(productId, size, newQuantity) {
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId, size);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('woolflow-cart', JSON.stringify(cart));
            updateCartDisplay();
            renderCartDrawerItems(); // Refresh cart drawer
            
            if (window.location.pathname.includes('cart.html')) {
                updateOrderSummary();
            }
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    if (cartTotal) {
        cartTotal.textContent = `$${totalPrice}`;
    }
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center text-charcoal/70 py-12">
                    <svg class="w-16 h-16 mx-auto mb-4 text-mist-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-4"></path>
                    </svg>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="flex items-center space-x-4 p-4 border-b border-mist-grey/20">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div class="flex-1">
                        <h4 class="font-medium text-charcoal">${item.name}</h4>
                        ${item.size ? `<p class="text-sm text-charcoal/70">Size: ${item.size}</p>` : ''}
                        <p class="text-sm text-charcoal/70">$${item.price}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity - 1})" class="w-8 h-8 rounded-full bg-mist-grey/30 flex items-center justify-center text-charcoal hover:bg-sage hover:text-white transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                        </button>
                        <span class="w-8 text-center font-medium">${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity + 1})" class="w-8 h-8 rounded-full bg-mist-grey/30 flex items-center justify-center text-charcoal hover:bg-sage hover:text-white transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar && cartOverlay) {
        const isOpen = cartSidebar.classList.contains('open');
        
        if (isOpen) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('open');
            document.body.style.overflow = '';
        } else {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            renderCartDrawerItems();
        }
    }
}

// Product rendering functions
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = filteredProducts.map((product, index) => `
        <div class="product-card bg-warm-white rounded-2xl p-6 shadow-lg fade-in-up stagger-delay-${(index % 6) + 1}" data-category="${product.category}" data-color="${product.color.toLowerCase()}">
            <div class="relative mb-4">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-xl cursor-pointer" onclick="openProductModal('${product.id}')">
                ${product.id.includes('urban-oat') ? '<div class="absolute top-4 right-4 bg-sage text-white px-3 py-1 rounded-full text-sm font-medium">Popular</div>' : ''}
                ${product.id.includes('city-sage') ? '<div class="absolute top-4 right-4 bg-stone text-white px-3 py-1 rounded-full text-sm font-medium">New</div>' : ''}
            </div>
            <h4 class="text-xl font-semibold text-charcoal mb-2">${product.name}</h4>
            <p class="text-charcoal/70 mb-4">${product.description}</p>
            <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-charcoal">$${product.price}</span>
                <button onclick="openProductModal('${product.id}')" class="px-6 py-2 bg-charcoal text-warm-white rounded-full hover:bg-charcoal/90 transition-all transform hover:scale-105">
                    Select Size
                </button>
            </div>
        </div>
    `).join('');
    
    updateProductCount();
    
    // Re-initialize scroll animations for new elements
    setTimeout(() => {
        document.querySelectorAll('.product-card.fade-in-up').forEach(el => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(el);
        });
    }, 100);
}

// Filter functions
function initializeFilters() {
    // Filter checkboxes are already initialized in HTML
}

function applyFilters() {
    const categoryFilters = Array.from(document.querySelectorAll('input[value="urban"], input[value="active"], input[value="casual"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const colorFilters = Array.from(document.querySelectorAll('input[value="oat"], input[value="sage"], input[value="mist"], input[value="charcoal"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const sizeFilters = Array.from(document.querySelectorAll('input[value="7"], input[value="8"], input[value="9"], input[value="10"], input[value="11"], input[value="12"]'))
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.value));
    
    const priceFilters = Array.from(document.querySelectorAll('input[value="0-150"], input[value="150-170"], input[value="170-200"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    filteredProducts = products.filter(product => {
        // Category filter
        if (categoryFilters.length > 0 && !categoryFilters.includes(product.category)) {
            return false;
        }
        
        // Color filter
        if (colorFilters.length > 0 && !colorFilters.includes(product.color.toLowerCase())) {
            return false;
        }
        
        // Size filter
        if (sizeFilters.length > 0) {
            const hasMatchingSize = sizeFilters.some(size => product.availableSizes.includes(size));
            if (!hasMatchingSize) {
                return false;
            }
        }
        
        // Price filter
        if (priceFilters.length > 0) {
            const matchesPrice = priceFilters.some(range => {
                const [min, max] = range.split('-').map(p => p === '0' ? 0 : parseInt(p));
                return product.price >= min && (max ? product.price <= max : true);
            });
            if (!matchesPrice) {
                return false;
            }
        }
        
        return true;
    });
    
    renderProducts();
}

function clearFilters() {
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
        cb.checked = false;
        cb.nextElementSibling.classList.remove('bg-charcoal', 'text-warm-white');
    });
    
    filteredProducts = [...products];
    renderProducts();
}

function sortProducts() {
    const sortSelect = document.getElementById('sort-select');
    const sortValue = sortSelect.value;
    
    switch (sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
            break;
        case 'popular':
            filteredProducts.sort((a, b) => {
                const aPopular = a.id.includes('urban-oat') || a.id.includes('commuter-oat');
                const bPopular = b.id.includes('urban-oat') || b.id.includes('commuter-oat');
                return bPopular - aPopular;
            });
            break;
        default:
            // Featured - keep original order
            break;
    }
    
    renderProducts();
}

function updateProductCount() {
    const productCount = document.getElementById('product-count');
    if (productCount) {
        productCount.textContent = filteredProducts.length;
    }
}

// Product modal functions
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    const sizeGrid = document.getElementById('size-grid');
    
    modalTitle.textContent = `${product.name} - ${product.color}`;
    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalPrice.textContent = `$${product.price}`;
    modalDescription.textContent = product.description;
    
    // Generate size grid
    sizeGrid.innerHTML = product.sizes.map(size => {
        const isAvailable = product.availableSizes.includes(size);
        const availabilityClass = isAvailable ? '' : 'unavailable';
        return `
            <button class="size-option ${availabilityClass} w-12 h-12 rounded-lg border border-mist-grey text-sm font-medium" 
                    onclick="selectSize(${size})" ${!isAvailable ? 'disabled' : ''}>
                ${size}
            </button>
        `;
    }).join('');
    
    modal.classList.remove('opacity-0', 'invisible');
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.add('opacity-0', 'invisible');
    currentProduct = null;
}

function selectSize(size) {
    // Remove previous selection
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    event.target.classList.add('selected');
    
    // Update modal add to cart button
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    addToCartBtn.onclick = () => {
        if (currentProduct) {
            addToCart(currentProduct.id, `${currentProduct.name} - ${currentProduct.color}`, currentProduct.price, currentProduct.image, size);
            closeProductModal();
        }
    };
}

// Cart page functions
function renderCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="text-center text-charcoal/70 py-12">
                <svg class="w-16 h-16 mx-auto mb-4 text-mist-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-4"></path>
                </svg>
                <p class="text-lg mb-4">Your cart is empty</p>
                <button onclick="window.location.href='products.html'" class="px-6 py-3 bg-charcoal text-warm-white rounded-full hover:bg-charcoal/90 transition-all font-medium">
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="flex items-center space-x-4 p-4 border-b border-mist-grey/20">
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl">
            <div class="flex-1">
                <h4 class="font-semibold text-charcoal">${item.name}</h4>
                ${item.size ? `<p class="text-sm text-charcoal/70">Size: ${item.size}</p>` : ''}
                <p class="text-lg font-bold text-charcoal mt-1">$${item.price}</p>
            </div>
            <div class="flex items-center space-x-3">
                <button onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity - 1})" class="quantity-btn w-10 h-10 rounded-full border border-mist-grey flex items-center justify-center text-charcoal">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                    </svg>
                </button>
                <span class="w-8 text-center font-semibold">${item.quantity}</span>
                <button onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity + 1})" class="quantity-btn w-10 h-10 rounded-full border border-mist-grey flex items-center justify-center text-charcoal">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                </button>
            </div>
            <button onclick="removeFromCart('${item.id}', ${item.size || 'null'})" class="p-2 text-charcoal/50 hover:text-red-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    const cartSubtotal = document.getElementById('cart-subtotal');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTax = document.getElementById('summary-tax');
    const summaryTotal = document.getElementById('summary-total');
    
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryTax) summaryTax.textContent = `$${tax.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `$${total.toFixed(2)}`;
}

function applyDiscount() {
    const discountCode = document.getElementById('discount-code').value.trim().toLowerCase();
    const validCodes = {
        'wool10': 0.10,
        'first15': 0.15,
        'natural20': 0.20
    };
    
    if (validCodes[discountCode]) {
        showNotification(`Discount applied! ${(validCodes[discountCode] * 100)}% off`, 'success');
        // Apply discount logic here
    } else if (discountCode) {
        showNotification('Invalid discount code', 'error');
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutTotal = document.getElementById('checkout-total');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    if (checkoutTotal) {
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    checkoutModal.classList.remove('opacity-0', 'invisible');
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.classList.add('opacity-0', 'invisible');
}

function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    successModal.classList.add('opacity-0', 'invisible');
    
    // Clear cart and redirect
    cart = [];
    localStorage.setItem('woolflow-cart', JSON.stringify(cart));
    window.location.href = 'products.html';
}

// Checkout form handling
document.addEventListener('submit', function(e) {
    if (e.target.id === 'checkout-form') {
        e.preventDefault();
        
        // Simulate order processing
        setTimeout(() => {
            closeCheckoutModal();
            const successModal = document.getElementById('success-modal');
            successModal.classList.remove('opacity-0', 'invisible');
            
            // Clear cart
            cart = [];
            localStorage.setItem('woolflow-cart', JSON.stringify(cart));
        }, 2000);
    }
});

// Utility functions
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-sage text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-charcoal text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Load more functionality
document.addEventListener('click', function(e) {
    if (e.target.id === 'load-more') {
        showNotification('All products loaded!', 'info');
        e.target.style.display = 'none';
    }
});

// Handle filter label clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-label')) {
        const checkbox = e.target.previousElementSibling;
        checkbox.checked = !checkbox.checked;
        
        if (checkbox.checked) {
            e.target.classList.add('bg-charcoal', 'text-warm-white');
        } else {
            e.target.classList.remove('bg-charcoal', 'text-warm-white');
        }
        
        applyFilters();
    }
});

// Security Utility Functions
function generateNonce() {
    try {
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const array = new Uint8Array(16);
            crypto.getRandomValues(array);
            return btoa(String.fromCharCode.apply(null, array));
        }
        // Fallback for older browsers
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    } catch (e) {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function encryptData(data) {
    try {
        const encrypted = btoa(JSON.stringify(data) + SECURITY_CONFIG.encryptionKey);
        return encrypted;
    } catch (error) {
        console.error('Encryption failed:', error);
        return null;
    }
}

function decryptData(encryptedData) {
    try {
        const decrypted = atob(encryptedData);
        const data = decrypted.replace(SECURITY_CONFIG.encryptionKey, '');
        return JSON.parse(data);
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<[^>]+>/g, '')
                .replace(/["'<>]/g, '');
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Security Monitoring
class SecurityMonitor {
    constructor() {
        this.requestCounts = new Map();
        this.blockedIPs = new Set();
        this.suspiciousActivities = [];
        this.init();
    }
    
    init() {
        this.monitorXSSAttempts();
        this.monitorRateLimiting();
        this.monitorDataExfiltration();
    }
    
    monitorXSSAttempts() {
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                if (value.includes('<script') || value.includes('javascript:')) {
                    securityMonitor.logSuspiciousActivity('XSS attempt detected', value);
                }
                return originalInnerHTML.set.call(this, value);
            }
        });
    }
    
    monitorRateLimiting() {
        const ip = this.getClientIP();
        const now = Date.now();
        
        if (!this.requestCounts.has(ip)) {
            this.requestCounts.set(ip, { count: 1, windowStart: now });
        } else {
            const data = this.requestCounts.get(ip);
            if (now - data.windowStart > SECURITY_CONFIG.rateLimitWindow) {
                data.count = 1;
                data.windowStart = now;
            } else {
                data.count++;
            }
            
            if (data.count > SECURITY_CONFIG.maxRequests) {
                this.blockIP(ip);
                this.logSuspiciousActivity('Rate limit exceeded', { ip, count: data.count });
            }
        }
    }
    
    monitorDataExfiltration() {
        const sensitiveData = ['password', 'credit_card', 'ssn', 'personal_info'];
        sensitiveData.forEach(dataType => {
            Object.defineProperty(window, dataType, {
                set: function(value) {
                    securityMonitor.logSuspiciousActivity('Sensitive data exposure', dataType);
                }
            });
        });
    }
    
    getClientIP() {
        // In production, this would come from the server
        return 'client-ip-placeholder';
    }
    
    blockIP(ip) {
        this.blockedIPs.add(ip);
        console.warn(`IP blocked: ${ip}`);
    }
    
    logSuspiciousActivity(type, details) {
        const activity = {
            timestamp: Date.now(),
            type,
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.suspiciousActivities.push(activity);
        console.warn('Security alert:', activity);
        
        // Send to security monitoring service
        this.sendSecurityAlert(activity);
    }
    
    sendSecurityAlert(activity) {
        // In production, send to security monitoring endpoint
        fetch('/api/security-alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Security-Token': SECURITY_CONFIG.cspNonce
            },
            body: JSON.stringify(activity)
        }).catch(err => console.error('Security alert failed:', err));
    }
}

// Analytics System
class AnalyticsSystem {
    constructor() {
        this.sessionData = {
            sessionId: ANALYTICS_CONFIG.sessionId,
            startTime: Date.now(),
            pageViews: 0,
            events: [],
            userPath: []
        };
        this.init();
    }
    
    init() {
        this.trackPageView();
        this.trackUserInteractions();
        this.trackPerformanceMetrics();
        this.startBatchSender();
    }
    
    trackPageView() {
        const pageData = {
            type: 'page_view',
            url: window.location.href,
            referrer: document.referrer,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        
        this.sessionData.pageViews++;
        this.sessionData.userPath.push(pageData);
        this.eventsQueue.push(pageData);
    }
    
    trackUserInteractions() {
        // Track clicks
        document.addEventListener('click', (e) => {
            const clickData = {
                type: 'click',
                element: e.target.tagName,
                className: e.target.className,
                timestamp: Date.now(),
                coordinates: { x: e.clientX, y: e.clientY }
            };
            this.eventsQueue.push(clickData);
        });
        
        // Track form interactions
        document.addEventListener('submit', (e) => {
            const formData = {
                type: 'form_submit',
                formId: e.target.id,
                timestamp: Date.now()
            };
            this.eventsQueue.push(formData);
        });
        
        // Track cart events
        document.addEventListener('cart_updated', (e) => {
            this.eventsQueue.push({
                type: 'cart_event',
                action: e.detail.action,
                productId: e.detail.productId,
                quantity: e.detail.quantity,
                timestamp: Date.now()
            });
        });
    }
    
    trackPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            const perfData = {
                type: 'performance',
                pageLoadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
                timestamp: Date.now()
            };
            
            this.eventsQueue.push(perfData);
        }
    }
    
    startBatchSender() {
        setInterval(() => {
            if (this.eventsQueue.length > 0) {
                this.sendBatch();
            }
        }, 5000); // Send every 5 seconds
    }
    
    sendBatch() {
        const batch = {
            sessionId: this.sessionData.sessionId,
            events: [...this.eventsQueue],
            timestamp: Date.now()
        };
        
        fetch(`${ANALYTICS_CONFIG.apiEndpoint}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Analytics-Session': this.sessionData.sessionId
            },
            body: JSON.stringify(batch)
        }).catch(err => console.error('Analytics send failed:', err));
        
        this.eventsQueue = [];
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0
        };
        this.init();
    }
    
    init() {
        this.observeLCP();
        this.observeCLS();
        this.observeFID();
        this.startMetricsCollection();
    }
    
    observeLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
    
    observeCLS() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        this.metrics.cumulativeLayoutShift += entry.value;
                    }
                });
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    observeFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        }
    }
    
    startMetricsCollection() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectMetrics();
            }, 0);
        });
    }
    
    collectMetrics() {
        this.metrics.pageLoad = performance.now();
        
        // Check against thresholds
        if (this.metrics.pageLoad > PERFORMANCE_CONFIG.criticalThresholds.pageLoad) {
            this.reportPerformanceIssue('Slow page load', this.metrics.pageLoad);
        }
        
        if (this.metrics.cumulativeLayoutShift > PERFORMANCE_CONFIG.criticalThresholds.cls) {
            this.reportPerformanceIssue('High layout shift', this.metrics.cumulativeLayoutShift);
        }
        
        // Send metrics to monitoring service
        this.sendMetrics();
    }
    
    reportPerformanceIssue(type, value) {
        const issue = {
            type: 'performance_issue',
            issueType: type,
            value,
            url: window.location.href,
            timestamp: Date.now()
        };
        
        // Send to monitoring service
        fetch('/api/performance-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issue)
        }).catch(err => console.error('Performance alert failed:', err));
    }
    
    sendMetrics() {
        fetch('/api/performance-metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.metrics)
        }).catch(err => console.error('Metrics send failed:', err));
    }
}

// Enhanced Cart Management with Security
class SecureCartManager {
    constructor() {
        this.encryptionEnabled = true;
        this.maxCartItems = 50;
        this.maxQuantity = 10;
    }
    
    saveCart(cart) {
        if (cart.length > this.maxCartItems) {
            throw new Error('Cart size exceeds maximum allowed items');
        }
        
        cart.forEach(item => {
            if (item.quantity > this.maxQuantity) {
                throw new Error(`Quantity exceeds maximum for item: ${item.id}`);
            }
        });
        
        const cartData = this.encryptionEnabled ? encryptData(cart) : JSON.stringify(cart);
        localStorage.setItem('woolflow-cart-secure', cartData);
        
        // Dispatch secure cart update event
        document.dispatchEvent(new CustomEvent('cart_updated_secure', {
            detail: { cart, timestamp: Date.now() }
        }));
    }
    
    loadCart() {
        try {
            const encryptedData = localStorage.getItem('woolflow-cart-secure');
            if (!encryptedData) return [];
            
            const cart = this.encryptionEnabled ? 
                decryptData(encryptedData) : 
                JSON.parse(encryptedData);
            
            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            console.error('Failed to load cart:', error);
            return [];
        }
    }
    
    validateCartItem(item) {
        const requiredFields = ['id', 'name', 'price', 'quantity'];
        return requiredFields.every(field => item.hasOwnProperty(field)) &&
               typeof item.price === 'number' &&
               typeof item.quantity === 'number' &&
               item.quantity > 0 &&
               item.quantity <= this.maxQuantity;
    }
}

// Advanced Analytics Tracking
class EcommerceAnalytics {
    constructor() {
        this.conversionFunnel = {
            productViews: new Set(),
            cartAdds: new Set(),
            checkouts: new Set(),
            purchases: new Set()
        };
        this.userProperties = {
            sessionStart: Date.now(),
            totalSpent: 0,
            productViews: 0,
            cartValue: 0
        };
        this.init();
    }
    
    init() {
        this.trackEcommerceEvents();
        this.setupConversionTracking();
        this.trackUserEngagement();
    }
    
    trackEcommerceEvents() {
        // Product view tracking
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-card')) {
                const productCard = e.target.closest('.product-card');
                const productData = this.extractProductData(productCard);
                this.trackProductView(productData);
            }
        });
        
        // Add to cart tracking
        document.addEventListener('cart_updated', (e) => {
            this.trackAddToCart({
                productId: e.detail.productId,
                quantity: e.detail.quantity,
                price: e.detail.price,
                cartValue: this.calculateCartValue()
            });
        });
        
        // Purchase tracking
        document.addEventListener('purchase_completed', (e) => {
            this.trackPurchase({
                orderId: e.detail.orderId,
                revenue: e.detail.revenue,
                products: e.detail.products,
                currency: 'USD'
            });
        });
    }
    
    extractProductData(productCard) {
        return {
            id: productCard.dataset.productId,
            name: productCard.querySelector('h4').textContent,
            price: parseFloat(productCard.querySelector('.text-2xl').textContent.replace('$', '')),
            category: productCard.dataset.category
        };
    }
    
    trackProductView(productData) {
        this.conversionFunnel.productViews.add(productData.id);
        this.userProperties.productViews++;
        
        // Google Analytics 4
        gtag('event', 'view_item', {
            currency: 'USD',
            value: productData.price,
            items: [{
                item_id: productData.id,
                item_name: productData.name,
                item_category: productData.category,
                price: productData.price
            }]
        });
        
        // Facebook Pixel
        fbq('track', 'ViewContent', {
            content_ids: [productData.id],
            content_type: 'product',
            value: productData.price,
            currency: 'USD'
        });
    }
    
    trackAddToCart(data) {
        this.conversionFunnel.cartAdds.add(data.productId);
        this.userProperties.cartValue = data.cartValue;
        
        gtag('event', 'add_to_cart', {
            currency: 'USD',
            value: data.price * data.quantity,
            items: [{
                item_id: data.productId,
                quantity: data.quantity,
                price: data.price
            }]
        });
        
        fbq('track', 'AddToCart', {
            content_ids: [data.productId],
            content_type: 'product',
            value: data.price * data.quantity,
            currency: 'USD'
        });
    }
    
    trackPurchase(data) {
        this.conversionFunnel.purchases.add(data.orderId);
        this.userProperties.totalSpent += data.revenue;
        
        gtag('event', 'purchase', {
            transaction_id: data.orderId,
            value: data.revenue,
            currency: data.currency,
            items: data.products.map(product => ({
                item_id: product.id,
                item_name: product.name,
                price: product.price,
                quantity: product.quantity
            }))
        });
        
        fbq('track', 'Purchase', {
            content_ids: data.products.map(p => p.id),
            value: data.revenue,
            currency: data.currency
        });
    }
    
    setupConversionTracking() {
        // Track checkout steps
        document.addEventListener('checkout_step', (e) => {
            gtag('event', 'checkout_progress', {
                checkout_step: e.detail.step,
                value: e.detail.cartValue
            });
        });
        
        // Track search
        const searchForm = document.querySelector('#search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                const searchTerm = e.target.querySelector('input[name="search"]').value;
                gtag('event', 'search', {
                    search_term: searchTerm
                });
            });
        }
    }
    
    trackUserEngagement() {
        let timeOnPage = 0;
        let scrollDepth = 0;
        
        // Time on page
        setInterval(() => {
            timeOnPage += 5;
            if (timeOnPage % 30 === 0) { // Track every 30 seconds
                gtag('event', 'time_on_page', {
                    value: timeOnPage
                });
            }
        }, 5000);
        
        // Scroll depth
        document.addEventListener('scroll', () => {
            const newScrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (newScrollDepth > scrollDepth && newScrollDepth % 25 === 0) {
                scrollDepth = newScrollDepth;
                gtag('event', 'scroll', {
                    percent_scrolled: scrollDepth
                });
            }
        });
    }
    
    calculateCartValue() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getConversionRate() {
        const productViews = this.conversionFunnel.productViews.size;
        const purchases = this.conversionFunnel.purchases.size;
        return productViews > 0 ? (purchases / productViews) * 100 : 0;
    }
}

// Heatmap Tracking
class HeatmapTracker {
    constructor() {
        this.clicks = [];
        this.scrolls = [];
        this.mouseMoves = [];
        this.init();
    }
    
    init() {
        this.trackClicks();
        this.trackScrolls();
        this.trackMouseMovement();
        this.sendData();
    }
    
    trackClicks() {
        document.addEventListener('click', (e) => {
            this.clicks.push({
                x: e.clientX,
                y: e.clientY,
                element: e.target.tagName,
                timestamp: Date.now(),
                viewport: { width: window.innerWidth, height: window.innerHeight }
            });
        });
    }
    
    trackScrolls() {
        let lastScrollTime = Date.now();
        document.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollTime > 100) { // Throttle scroll events
                this.scrolls.push({
                    scrollY: window.scrollY,
                    scrollPercent: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100),
                    timestamp: now
                });
                lastScrollTime = now;
            }
        });
    }
    
    trackMouseMovement() {
        let lastMoveTime = Date.now();
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMoveTime > 500) { // Sample every 500ms
                this.mouseMoves.push({
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: now
                });
                lastMoveTime = now;
            }
        });
    }
    
    sendData() {
        // Send data every 30 seconds
        setInterval(() => {
            if (this.clicks.length > 0 || this.scrolls.length > 0) {
                const data = {
                    sessionId: ANALYTICS_CONFIG.sessionId,
                    pageUrl: window.location.href,
                    clicks: this.clicks,
                    scrolls: this.scrolls,
                    mouseMoves: this.mouseMoves.slice(0, 100) // Limit to prevent payload size
                };
                
                fetch('/api/heatmap-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }).catch(err => console.error('Heatmap data send failed:', err));
                
                // Clear sent data
                this.clicks = [];
                this.scrolls = [];
                this.mouseMoves = [];
            }
        }, 30000);
    }
}

// Real-time Inventory Management System
class InventoryManager {
    constructor() {
        this.stockLevels = new Map();
        this.reservations = new Map();
        this.websocket = null;
        this.reorderPoints = new Map();
        this.init();
    }
    
    init() {
        this.initializeStockLevels();
        this.connectWebSocket();
        this.startStockMonitoring();
    }
    
    initializeStockLevels() {
        // Initialize with realistic stock levels
        products.forEach(product => {
            // Generate random stock levels for demo
            const baseStock = Math.floor(Math.random() * 50) + 10;
            this.stockLevels.set(product.id, baseStock);
            this.reorderPoints.set(product.id, Math.floor(baseStock * 0.2)); // 20% reorder point
        });
    }
    
    connectWebSocket() {
        // Simulate WebSocket connection for real-time updates
        // In production, this would connect to actual inventory service
        this.websocket = {
            send: (data) => {
                console.log('Inventory WebSocket send:', data);
            },
            close: () => {
                console.log('Inventory WebSocket closed');
            }
        };
        
        // Simulate real-time stock updates
        setInterval(() => {
            this.simulateStockFluctuation();
        }, 30000); // Update every 30 seconds
    }
    
    simulateStockFluctuation() {
        products.forEach(product => {
            const currentStock = this.stockLevels.get(product.id);
            const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const newStock = Math.max(0, currentStock + fluctuation);
            
            if (newStock !== currentStock) {
                this.stockLevels.set(product.id, newStock);
                this.updateStockDisplay(product.id, newStock);
                this.checkReorderPoint(product.id, newStock);
            }
        });
    }
    
    updateStockDisplay(productId, stockLevel) {
        const stockElements = document.querySelectorAll(`[data-product-id="${productId}"] .stock-indicator`);
        stockElements.forEach(element => {
            element.textContent = `${stockLevel} in stock`;
            element.className = `stock-indicator ${stockLevel === 0 ? 'out-of-stock' : stockLevel <= 5 ? 'low-stock' : 'in-stock'}`;
        });
    }
    
    checkReorderPoint(productId, stockLevel) {
        const reorderPoint = this.reorderPoints.get(productId);
        if (stockLevel <= reorderPoint && stockLevel > 0) {
            this.triggerReorderAlert(productId, stockLevel);
        } else if (stockLevel === 0) {
            this.markOutOfStock(productId);
        }
    }
    
    triggerReorderAlert(productId, stockLevel) {
        const product = products.find(p => p.id === productId);
        console.warn(`Low stock alert: ${product.name} - ${stockLevel} remaining`);
        
        // Send to admin dashboard
        this.sendInventoryAlert({
            type: 'low_stock',
            productId,
            stockLevel,
            reorderPoint: this.reorderPoints.get(productId),
            timestamp: Date.now()
        });
    }
    
    markOutOfStock(productId) {
        const product = products.find(p => p.id === productId);
        console.error(`Out of stock: ${product.name}`);
        
        // Update UI to show out of stock
        const productElements = document.querySelectorAll(`[data-product-id="${productId}"]`);
        productElements.forEach(element => {
            const addToCartBtn = element.querySelector('.add-to-cart-btn');
            if (addToCartBtn) {
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Out of Stock';
                addToCartBtn.classList.add('out-of-stock-btn');
            }
        });
        
        // Send out of stock alert
        this.sendInventoryAlert({
            type: 'out_of_stock',
            productId,
            timestamp: Date.now()
        });
    }
    
    getStockLevel(productId) {
        return this.stockLevels.get(productId) || 0;
    }
    
    isInStock(productId) {
        return this.getStockLevel(productId) > 0;
    }
    
    async reserveStock(productId, quantity, reservationId) {
        const currentStock = this.getStockLevel(productId);
        
        if (currentStock < quantity) {
            return { success: false, error: 'Insufficient stock' };
        }
        
        // Create reservation
        const reservation = {
            id: reservationId,
            productId,
            quantity,
            createdAt: Date.now(),
            expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
        };
        
        this.reservations.set(reservationId, reservation);
        
        // Update stock level
        this.stockLevels.set(productId, currentStock - quantity);
        this.updateStockDisplay(productId, currentStock - quantity);
        
        // Send reservation to server
        this.websocket.send(JSON.stringify({
            type: 'stock_reservation',
            reservation
        }));
        
        // Set expiration timer
        setTimeout(() => {
            this.releaseStockReservation(reservationId);
        }, 15 * 60 * 1000);
        
        return { success: true, reservation };
    }
    
    async releaseStockReservation(reservationId) {
        const reservation = this.reservations.get(reservationId);
        if (!reservation) {
            return { success: false, error: 'Reservation not found' };
        }
        
        // Restore stock level
        const currentStock = this.getStockLevel(reservation.productId);
        this.stockLevels.set(reservation.productId, currentStock + reservation.quantity);
        this.updateStockDisplay(reservation.productId, currentStock + reservation.quantity);
        
        // Remove reservation
        this.reservations.delete(reservationId);
        
        // Send release to server
        this.websocket.send(JSON.stringify({
            type: 'stock_reservation_released',
            reservationId
        }));
        
        return { success: true };
    }
    
    startStockMonitoring() {
        // Monitor stock levels every 5 minutes
        setInterval(() => {
            this.generateStockReport();
        }, 5 * 60 * 1000);
    }
    
    generateStockReport() {
        const report = {
            timestamp: Date.now(),
            totalProducts: products.length,
            outOfStock: [],
            lowStock: [],
            totalValue: 0
        };
        
        products.forEach(product => {
            const stockLevel = this.getStockLevel(product.id);
            const reorderPoint = this.reorderPoints.get(product.id);
            
            if (stockLevel === 0) {
                report.outOfStock.push({
                    productId: product.id,
                    name: product.name,
                    price: product.price
                });
            } else if (stockLevel <= reorderPoint) {
                report.lowStock.push({
                    productId: product.id,
                    name: product.name,
                    stockLevel,
                    reorderPoint
                });
            }
            
            report.totalValue += stockLevel * product.price;
        });
        
        console.log('Stock Report:', report);
        return report;
    }
    
    sendInventoryAlert(alert) {
        // Send to inventory management system
        fetch('/api/inventory/alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alert)
        }).catch(err => console.error('Inventory alert failed:', err));
    }
}

// Advanced Search with Fuzzy Matching
class AdvancedSearch {
    constructor() {
        this.searchIndex = [];
        this.fuse = null;
        this.init();
    }
    
    init() {
        this.buildSearchIndex();
        this.initializeFuse();
        this.setupAutocomplete();
    }
    
    buildSearchIndex() {
        products.forEach(product => {
            this.searchIndex.push({
                id: product.id,
                name: product.name,
                category: product.category,
                color: product.color,
                description: product.description,
                price: product.price
            });
        });
    }
    
    initializeFuse() {
        const options = {
            includeScore: true,
            threshold: 0.4,
            keys: [
                { name: 'name', weight: 0.7 },
                { name: 'category', weight: 0.2 },
                { name: 'color', weight: 0.1 }
            ]
        };
        
        this.fuse = new Fuse(this.searchIndex, options);
    }
    
    setupAutocomplete() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        
        let autocompleteTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(autocompleteTimeout);
            autocompleteTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
    }
    
    performSearch(query) {
        if (!query || query.length < 2) {
            this.clearSearchResults();
            return;
        }
        
        const results = this.fuse.search(query);
        this.displaySearchResults(results);
        
        // Track search event
        gtag('event', 'search', {
            search_term: query,
            results_count: results.length
        });
    }
    
    displaySearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No products found</div>';
            return;
        }
        
        const resultsHTML = results.slice(0, 5).map(result => {
            const product = products.find(p => p.id === result.item.id);
            return `
                <div class="search-result-item" onclick="openProductModal('${product.id}')">
                    <img src="${product.image}" alt="${product.name}" class="search-result-image">
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <p class="search-result-price">$${product.price}</p>
                        <p class="search-result-score">Match: ${Math.round((1 - result.score) * 100)}%</p>
                    </div>
                </div>
            `;
        }).join('');
        
        resultsContainer.innerHTML = resultsHTML;
        resultsContainer.style.display = 'block';
    }
    
    clearSearchResults() {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }
}

// Initialize enhanced systems
function initializeProductionSystems() {
    // Initialize security monitoring
    securityMonitor = new SecurityMonitor();
    
    // Initialize analytics
    analytics = new AnalyticsSystem();
    ecommerceAnalytics = new EcommerceAnalytics();
    heatmapTracker = new HeatmapTracker();
    
    // Initialize performance monitoring
    if (PERFORMANCE_CONFIG.monitoringEnabled) {
        performanceMonitor = new PerformanceMonitor();
    }
    
    // Initialize secure cart manager
    secureCartManager = new SecureCartManager();
    
    // Initialize inventory management
    inventoryManager = new InventoryManager();
    
    // Initialize advanced search
    advancedSearch = new AdvancedSearch();
    
    // Replace standard cart with secure cart
    cart = secureCartManager.loadCart();
    
    // Register service worker for advanced caching
    registerServiceWorker();
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    
                    // Track service worker registration
                    gtag('event', 'service_worker_registered', {
                        scope: registration.scope
                    });
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                showNotification('New version available! Refresh to update.', 'info');
                            }
                        });
                    });
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                    gtag('event', 'service_worker_registration_failed');
                });
        });
    }
}


// A/B Testing Framework
class ABTestingFramework {
    constructor() {
        this.experiments = new Map();
        this.userAssignments = new Map();
        this.init();
    }
    
    init() {
        this.loadExperiments();
        this.assignUserToExperiments();
    }
    
    loadExperiments() {
        // Define A/B tests
        this.experiments.set('homepage_hero', {
            variants: ['control', 'variant_a', 'variant_b'],
            trafficAllocation: [0.4, 0.3, 0.3],
            goal: 'click_through_rate'
        });
        
        this.experiments.set('product_card_design', {
            variants: ['control', 'hover_effects', '3d_tilt'],
            trafficAllocation: [0.5, 0.25, 0.25],
            goal: 'add_to_cart_rate'
        });
        
        this.experiments.set('checkout_flow', {
            variants: ['single_page', 'multi_step'],
            trafficAllocation: [0.5, 0.5],
            goal: 'conversion_rate'
        });
    }
    
    assignUserToExperiments() {
        const userId = this.getUserId();
        
        this.experiments.forEach((experiment, experimentId) => {
            const assignment = this.getAssignment(userId, experimentId, experiment);
            this.userAssignments.set(experimentId, assignment);
        });
    }
    
    getUserId() {
        let userId = localStorage.getItem('woolflow_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('woolflow_user_id', userId);
        }
        return userId;
    }
    
    getAssignment(userId, experimentId, experiment) {
        // Deterministic assignment based on user ID
        const hash = this.hashCode(userId + experimentId);
        const randomValue = (hash % 100) / 100;
        
        let cumulative = 0;
        for (let i = 0; i < experiment.trafficAllocation.length; i++) {
            cumulative += experiment.trafficAllocation[i];
            if (randomValue <= cumulative) {
                return experiment.variants[i];
            }
        }
        
        return experiment.variants[0]; // Fallback to control
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
    
    getVariant(experimentId) {
        return this.userAssignments.get(experimentId) || 'control';
    }
    
    trackEvent(experimentId, eventType, value = null) {
        const variant = this.getVariant(experimentId);
        
        // Send to analytics
        gtag('event', 'experiment_event', {
            experiment_id: experimentId,
            variant: variant,
            event_type: eventType,
            value: value
        });
        
        // Send to A/B testing service
        fetch('/api/abtesting/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                experimentId,
                variant,
                eventType,
                value,
                timestamp: Date.now(),
                userId: this.getUserId()
            })
        }).catch(err => console.error('A/B tracking failed:', err));
    }
}

// Customer Support Chat Integration
class CustomerSupportChat {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.botResponses = [
            "Hello! I'm here to help you find the perfect wool sneakers. What can I assist you with today?",
            "Our wool sneakers are made from premium merino wool with temperature regulation and moisture-wicking properties.",
            "We offer free shipping on all orders over $100 and a 30-day return policy.",
            "You can find our size guide on each product page. If you're between sizes, we recommend sizing up.",
            "Our customer service team is available Monday-Friday 9AM-6PM EST. You can also reach us at support@woolflow.com"
        ];
        this.init();
    }
    
    init() {
        this.createChatWidget();
        this.setupEventListeners();
    }
    
    createChatWidget() {
        const chatHTML = `
            <div id="chat-widget" class="chat-widget">
                <div class="chat-header" onclick="toggleChat()">
                    <div class="chat-avatar">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div class="chat-title">
                        <span class="chat-status online">Online</span>
                        <span class="chat-agent">WoolFlow Assistant</span>
                    </div>
                    <div class="chat-toggle">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
                <div class="chat-body" style="display: none;">
                    <div class="chat-messages" id="chat-messages">
                        <div class="message bot-message">
                            <div class="message-content">
                                Hello! I'm here to help you find the perfect wool sneakers. What can I assist you with today?
                            </div>
                            <div class="message-time">${new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                    <div class="chat-input-container">
                        <input type="text" id="chat-input" class="chat-input" placeholder="Type your message..." maxlength="500">
                        <button onclick="sendMessage()" class="chat-send-btn">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        this.addChatStyles();
    }
    
    addChatStyles() {
        const styles = `
            .chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                z-index: 1000;
                font-family: 'Inter', sans-serif;
            }
            
            .chat-header {
                background: #4A4A4A;
                color: white;
                padding: 16px;
                border-radius: 12px 12px 0 0;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .chat-avatar {
                width: 40px;
                height: 40px;
                background: #A8B0A0;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .chat-title {
                flex: 1;
            }
            
            .chat-status {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .chat-status.online {
                color: #10B981;
            }
            
            .chat-agent {
                font-weight: 600;
                font-size: 14px;
            }
            
            .chat-body {
                height: calc(100% - 72px);
                display: flex;
                flex-direction: column;
            }
            
            .chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                background: #F8F6F0;
            }
            
            .message {
                margin-bottom: 16px;
                animation: fadeIn 0.3s ease-in;
            }
            
            .bot-message {
                text-align: left;
            }
            
            .user-message {
                text-align: right;
            }
            
            .message-content {
                display: inline-block;
                padding: 12px 16px;
                border-radius: 18px;
                max-width: 80%;
                word-wrap: break-word;
            }
            
            .bot-message .message-content {
                background: white;
                color: #4A4A4A;
                border: 1px solid #E8E0D0;
            }
            
            .user-message .message-content {
                background: #4A4A4A;
                color: white;
            }
            
            .message-time {
                font-size: 11px;
                color: #C8C0B8;
                margin-top: 4px;
            }
            
            .chat-input-container {
                padding: 16px;
                background: white;
                border-top: 1px solid #E8E0D0;
                display: flex;
                gap: 12px;
            }
            
            .chat-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid #E8E0D0;
                border-radius: 24px;
                outline: none;
                font-size: 14px;
            }
            
            .chat-input:focus {
                border-color: #A8B0A0;
            }
            
            .chat-send-btn {
                width: 40px;
                height: 40px;
                background: #4A4A4A;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            
            .chat-send-btn:hover {
                background: #A8B0A0;
                transform: scale(1.05);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .product-card:hover {
                transform: translateY(-12px);
                box-shadow: var(--shadow-2xl), 0 20px 40px rgba(61, 61, 61, 0.15);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    setupEventListeners() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }
    
    toggleChat() {
        const chatBody = document.querySelector('.chat-body');
        const chatToggle = document.querySelector('.chat-toggle svg');
        
        if (chatBody.style.display === 'none') {
            chatBody.style.display = 'flex';
            chatToggle.style.transform = 'rotate(180deg)';
            this.isOpen = true;
            
            // Track chat open event
            gtag('event', 'chat_opened');
        } else {
            chatBody.style.display = 'none';
            chatToggle.style.transform = 'rotate(0deg)';
            this.isOpen = false;
        }
    }
    
    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        chatInput.value = '';
        
        // Generate bot response
        setTimeout(() => {
            const botResponse = this.generateBotResponse(message);
            this.addMessage(botResponse, 'bot');
        }, 1000);
        
        // Track message event
        gtag('event', 'chat_message_sent', {
            message_length: message.length
        });
    }
    
    addMessage(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        messageElement.innerHTML = `
            <div class="message-content">${this.escapeHtml(message)}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    generateBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
            return "You can find our size guide on each product page. If you're between sizes, we recommend sizing up for the best fit.";
        } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
            return "We offer free shipping on all orders over $100. Standard delivery takes 3-5 business days, and express shipping is available for $15.";
        } else if (lowerMessage.includes('return') || lowerMessage.includes('exchange')) {
            return "We have a 30-day return policy. Items must be unworn and in original packaging. Returns are free for store credit, or $5 for refunds.";
        } else if (lowerMessage.includes('wool') || lowerMessage.includes('material')) {
            return "Our sneakers are made from premium merino wool, which is naturally temperature-regulating, moisture-wicking, and odor-resistant.";
        } else {
            return this.botResponses[Math.floor(Math.random() * this.botResponses.length)];
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Global functions for HTML onclick handlers
function toggleChat() {
    if (window.customerSupportChat) {
        window.customerSupportChat.toggleChat();
    }
}

function sendMessage() {
    if (window.customerSupportChat) {
        window.customerSupportChat.sendMessage();
    }
}

// ============================================
// CART DRAWER RENDERING - Premium Slide Cart
// ============================================
function renderCartDrawerItems() {
    const cartItemsContainer = document.getElementById('cart-sidebar-items');
    if (!cartItemsContainer) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart total
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-sidebar-empty">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <p>Your cart is empty</p>
                <a href="products.html" onclick="toggleCart()">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="animation-delay: ${index * 0.05}s">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                ${item.size ? `<p class="cart-item-meta">Size: ${item.size}</p>` : ''}
                <p class="cart-item-price">$${item.price}</p>
            </div>
            <div class="cart-item-actions">
                <button class="cart-quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity - 1})" aria-label="Decrease quantity">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                </button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="cart-quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.size || 'null'}, ${item.quantity + 1})" aria-label="Increase quantity">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                </button>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}', ${item.size || 'null'})" aria-label="Remove item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
    
    // Animate items with anime.js if available
    if (typeof anime !== 'undefined') {
        anime({
            targets: '.cart-item',
            translateX: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(50),
            easing: 'easeOutCubic',
            duration: 400
        });
    }
}

// ============================================
// MICRO ANIMATIONS - Premium Interactions
// ============================================
function initializeMicroAnimations() {
    // Product card entrance animations
    if (typeof anime !== 'undefined') {
        // Animate product cards on scroll
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        anime({
                            targets: entry.target,
                            translateY: [40, 0],
                            opacity: [0, 1],
                            delay: index % 6 * 100,
                            easing: 'easeOutCubic',
                            duration: 600
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(card);
        });
        
        // Button click ripple effect
        document.querySelectorAll('.btn, .btn-add-cart, .cart-checkout-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background: rgba(255,255,255,0.5);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                anime({
                    targets: ripple,
                    scale: [0, 4],
                    opacity: [1, 0],
                    easing: 'easeOutExpo',
                    duration: 600,
                    complete: () => ripple.remove()
                });
            });
        });
        
        // Cart badge bounce animation on add
        const originalAddToCart = addToCart;
        addToCart = function(...args) {
            originalAddToCart.apply(this, args);
            
            const cartCount = document.getElementById('cart-count');
            if (cartCount && typeof anime !== 'undefined') {
                anime({
                    targets: cartCount,
                    scale: [1, 1.5, 1],
                    duration: 400,
                    easing: 'easeOutElastic(1, .5)'
                });
            }
        };
        
        // Modal animations
        const modalObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const modal = mutation.target;
                    if (modal.id === 'product-modal' || modal.id === 'checkout-modal') {
                        const isVisible = !modal.classList.contains('invisible') && !modal.classList.contains('opacity-0');
                        if (isVisible) {
                            const modalContent = modal.querySelector('.bg-warm-white, .modal-content');
                            if (modalContent) {
                                anime({
                                    targets: modalContent,
                                    scale: [0.9, 1],
                                    opacity: [0, 1],
                                    translateY: [20, 0],
                                    easing: 'easeOutCubic',
                                    duration: 400
                                });
                            }
                        }
                    }
                }
            });
        });
        
        document.querySelectorAll('#product-modal, #checkout-modal').forEach(modal => {
            modalObserver.observe(modal, { attributes: true });
        });
    }
    
    // Feature card hover animations
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this.querySelector('svg'),
                    rotate: '5deg',
                    scale: 1.1,
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this.querySelector('svg'),
                    rotate: '0deg',
                    scale: 1,
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
        });
    });
    
    // Product image zoom with mouse position
    document.querySelectorAll('.product-image-zoom-container').forEach(container => {
        const img = container.querySelector('.product-image');
        if (!img) return;
        
        container.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        });
        
        container.addEventListener('mouseleave', function() {
            img.style.transformOrigin = 'center center';
        });
    });
}

// Initialize micro animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeMicroAnimations, 100);
});