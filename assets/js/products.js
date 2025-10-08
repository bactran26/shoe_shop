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
    try {
        const products = await getProducts();
        
        // Display sale products
        const saleContainer = document.getElementById('sale-products');
        if (saleContainer) {
            saleContainer.innerHTML = products
                .slice(0, 12) // First 12 products for sale section
                .map(product => createProductCard(product))
                .join('');
        }

        // Display new products
        const newContainer = document.getElementById('new-products');
        if (newContainer) {
            newContainer.innerHTML = products
                .slice(12, 24) // Next 12 products for new arrivals
                .map(product => createProductCard(product))
                .join('');
        }

         // Display best sellers
        const bestSellersContainer = document.getElementById('best-sellers');
        if (bestSellersContainer) {
            bestSellersContainer.innerHTML = products
                .slice(24, 36) // First 12 products for best sellers (2 rows x 6 columns)
                .map(product => createProductCard(product))
                .join('');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

    

document.addEventListener('DOMContentLoaded', displayProducts);