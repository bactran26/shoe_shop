import { getProducts } from '../../data/dataManager.js';

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
            </div>
        </div>
    `;
}

async function displayProducts() {
    const products = await getProducts();
    const productsToShow = products.slice(0, 12); 
    const container = document.getElementById('products-container');
    if (container) {
        container.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
    }
}

document.addEventListener('DOMContentLoaded', displayProducts);