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

document.addEventListener('DOMContentLoaded', async () => {
    // Lấy tham số từ URL, ví dụ: products.html?category=sneaker&brand=nike
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const brand = params.get('brand');

    const products = await getProducts();

    // Lọc sản phẩm theo category và brand
    const filtered = products.filter(p =>
        (!category || p.category.toLowerCase() === category.toLowerCase()) &&
        (!brand || p.brand.toLowerCase() === brand.toLowerCase())
    );

    const container = document.getElementById('products-grid');
    container.innerHTML = filtered.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div>${product.price.toLocaleString()}₫</div>
        </div>
    `).join('');
});

async function displayProducts() {
    try {
        const products = await getProducts();
        
        // Display sale products
        const saleContainer = document.getElementById('sale-products');
        if (saleContainer) {
            saleContainer.innerHTML = products
                .slice(0, 12)
                .map(product => createProductCard(product))
                .join('');
        }

        // Display new products
        const newContainer = document.getElementById('new-products');
        if (newContainer) {
            newContainer.innerHTML = products
                .slice(12, 24)
                .map(product => createProductCard(product))
                .join('');
        }

        // Display best sellers
        const bestSellersContainer = document.getElementById('best-sellers');
        if (bestSellersContainer) {
            bestSellersContainer.innerHTML = products
                .slice(24, 36)
                .map(product => createProductCard(product))
                .join('');
        }

        // Add click event listeners to all product cards
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.getAttribute('data-id');
                window.location.href = `product-details.html?id=${productId}`;
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', displayProducts);