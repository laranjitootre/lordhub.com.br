// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const cartCount = document.querySelector('.cart-count');
const pluginsGrid = document.querySelector('.plugins-grid');

// Sample plugin data with local image paths
const plugins = [
    {
        id: 1,
        name: 'Advanced Kits',
        price: 14.99,
        image: 'img/plugins/kit-plugin.jpg',
        category: 'Gameplay',
        version: '1.16-1.20',
        rating: 4.8,
        description: 'Este plugin adiciona kits avançados ao seu servidor.'
    },
];

// Shopping cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app
function init() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Load plugins
    displayPlugins();
    
    // Update cart count
    updateCartCount();
    
    // Initialize animations after a short delay to allow images to load
    setTimeout(initAnimations, 500);
}

// Toggle mobile menu
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

// Close mobile menu
function closeMobileMenu() {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

// Display plugins
function displayPlugins() {
    if (!pluginsGrid) return;
    
    pluginsGrid.innerHTML = '';
    
    plugins.forEach(plugin => {
        const pluginElement = createPluginCard(plugin);
        pluginsGrid.appendChild(pluginElement);
    });
}

// Create plugin card element
function createPluginCard(plugin) {
    const card = document.createElement('div');
    card.className = 'plugin-card';
    card.dataset.id = plugin.id;
    card.dataset.category = plugin.category.toLowerCase(); // Garante que a categoria esteja em minúsculas
    
    const isInCart = cart.some(item => item.id === plugin.id);
    
    card.innerHTML = `
        <div class="plugin-image-container">
            <img src="${plugin.image}" alt="${plugin.name}" class="plugin-image" 
                 onerror="this.onerror=null; this.src='img/placeholder.jpg'"
                 loading="lazy">
        </div>
        <div class="plugin-info">
            <h3>${plugin.name}</h3>
            <div class="plugin-meta">
                <span class="version">${plugin.version}</span>
                <span class="category">${plugin.category}</span>
            </div>
            <div class="plugin-actions">
                <a href="produtos/kit-avancado.html" class="btn btn-outline">
                    <i class="fas fa-info-circle"></i> Sobre
                </a>
                <button class="btn add-to-cart-btn ${isInCart ? 'in-cart' : ''}" data-id="${plugin.id}" onclick="window.open('https://discord.gg/awTHTnMybV', '_blank')">
                    ${isInCart ? 'Comprar' : 'Comprar'}
                </button>
            </div>
        </div>
    `;

    // Criar o popup
    const popup = document.createElement('div');
    popup.className = 'plugin-popup';
    popup.style.display = 'none';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-popup">&times;</span>
            <h3>${plugin.name}</h3>
            <div class="popup-body">
                <div class="popup-image">
                    <img src="${plugin.image}" alt="${plugin.name}" onerror="this.src='img/plugins/placeholder.jpg'">
                </div>
                <div class="popup-details">
                    <p><strong>Categoria:</strong> ${plugin.category}</p>
                    <p><strong>Versão:</strong> ${plugin.version}</p>
                    <p><strong>Avaliação:</strong> ${plugin.rating}/5.0</p>
                    <p><strong>Preço:</strong> R$ ${plugin.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="popup-description">
                <h4>Descrição:</h4>
                <p>${plugin.description || 'Descrição não disponível.'}</p>
            </div>
            <button class="btn add-to-cart-btn-popup ${isInCart ? 'in-cart' : ''}" data-id="${plugin.id}" onclick="window.open('https://discord.gg/awTHTnMybV', '_blank')">
                ${isInCart ? 'Comprar' : 'Comprar'}
            </button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Adicionar event listeners
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    const aboutBtn = card.querySelector('.about-btn');
    const closeBtn = popup.querySelector('.close-popup');
    const addToCartPopupBtn = popup.querySelector('.add-to-cart-btn-popup');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCart(plugin);
        });
    }
    
    if (aboutBtn) {
        aboutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (addToCartPopupBtn) {
        addToCartPopupBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCart(plugin);
            addToCartPopupBtn.textContent = 'Comprar';
            addToCartPopupBtn.classList.add('in-cart');
            if (addToCartBtn) {
                addToCartBtn.textContent = 'Comprar';
                addToCartBtn.classList.add('in-cart');
            }
        });
    }
    
    // Fechar popup ao clicar fora
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    return card;
}

// Toggle item in cart
function toggleCart(plugin) {
    const index = cart.findIndex(item => item.id === plugin.id);
    const addToCartBtn = document.querySelector(`.add-to-cart-btn[data-id="${plugin.id}"]`);
    
    if (index === -1) {
        // Add to cart
        cart.push({ ...plugin, quantity: 1 });
        if (addToCartBtn) {
            addToCartBtn.textContent = 'Comprar';
            addToCartBtn.classList.add('in-cart');
        }
        showNotification(`${plugin.name} foi adicionado ao carrinho!`);
    } else {
        // Remove from cart
        cart.splice(index, 1);
        if (addToCartBtn) {
            addToCartBtn.textContent = 'Comprar';
            addToCartBtn.classList.remove('in-cart');
        }
        showNotification(`${plugin.name} foi removido do carrinho.`);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
}

// Update cart count in the UI
function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Show notification
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize animations
function initAnimations() {
    const cards = document.querySelectorAll('.plugin-card');
    
    // Add a small delay between each card's animation
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Filtro de categorias
document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterPluginsByCategory(category);
        });
    });
});

function filterPluginsByCategory(category) {
    const plugins = document.querySelectorAll('.plugin-card');
    const categoryCards = document.querySelectorAll('.category-card');
    
    // Remove a classe 'active' de todas as categorias
    categoryCards.forEach(card => {
        card.classList.remove('active');
    });
    
    // Adiciona a classe 'active' apenas na categoria clicada
    const activeCategory = document.querySelector(`.category-card[data-category="${category}"]`);
    if (activeCategory) {
        activeCategory.classList.add('active');
    }
    
    // Filtra os plugins
    plugins.forEach(plugin => {
        const pluginCategory = plugin.getAttribute('data-category');
        if (category === 'all' || pluginCategory === category) {
            plugin.style.display = 'block';
        } else {
            plugin.style.display = 'none';
        }
    });
    
    // Atualiza o título da seção
    const sectionTitle = document.querySelector('#featured-plugins .section-title');
    if (category !== 'all') {
        const categoryName = document.querySelector(`.category-card[data-category="${category}"] h3`).textContent;
        sectionTitle.textContent = `Plugins - ${categoryName}`;
    } else {
        sectionTitle.textContent = 'Plugins em Destaque';
    }
    
    // Scroll suave para a seção de plugins
    document.querySelector('#featured-plugins').scrollIntoView({ behavior: 'smooth' });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add CSS for notification
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    
    .add-to-cart-btn.in-cart {
        background-color: #757575 !important;
        cursor: not-allowed;
    }
    
    .no-scroll {
        overflow: hidden;
    }
    
    .plugin-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    }
    
    .plugin-image-container {
        width: 100%;
        height: 180px;
        overflow: hidden;
    }
    
    .plugin-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .plugin-card:hover .plugin-image {
        transform: scale(1.05);
    }
    
    .plugin-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .popup-content {
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        width: 80%;
        max-width: 500px;
    }
    
    .close-popup {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 24px;
        cursor: pointer;
    }
    
    .popup-body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .popup-image {
        width: 40%;
        height: 150px;
        overflow: hidden;
        border-radius: 10px;
    }
    
    .popup-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .popup-details {
        width: 60%;
        padding-left: 20px;
    }
    
    .popup-description {
        margin-top: 20px;
    }
`;
document.head.appendChild(style);
