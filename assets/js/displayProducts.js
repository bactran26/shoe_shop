import { getProducts } from '../../data/dataManager.js';

const productsPerPage = 12;
let currentPage = 1;
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let brand = urlParams.get('brand');
    let category = urlParams.get('category');

    if (brand === 'null' || !brand) brand = null;
    if (category === 'null' || !category) category = null;

    const brandTitle = document.getElementById('brandTitle');
    const productsContainer = document.getElementById('brand-products');
    const paginationContainer = document.getElementById('pagination');

    if (!productsContainer) return;

    try {
        const products = await getProducts();

        filteredProducts = products;
        if (category) {
            filteredProducts = filteredProducts.filter(p =>
                p.category && p.category.toLowerCase() === category.toLowerCase()
            );
        }
        if (brand) {
            filteredProducts = filteredProducts.filter(p =>
                p.brand && p.brand.toLowerCase() === brand.toLowerCase()
            );
        }

        if (category && brand) {
            brandTitle.textContent = `${category.toUpperCase()} ${brand.toUpperCase()}`;
        } else if (brand) {
            brandTitle.textContent = brand.toUpperCase();
        } else if (category) {
            brandTitle.textContent = category.toUpperCase();
        } else {
            brandTitle.textContent = 'TẤT CẢ SẢN PHẨM';
        }

        renderPage(currentPage);

    } catch (error) {
        productsContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: red;">Có lỗi xảy ra</p>';
    }
});

function renderPage(page) {
    const productsContainer = document.getElementById('brand-products');
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Không tìm thấy sản phẩm</p>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = filteredProducts.slice(start, end);

    productsContainer.innerHTML = productsToShow.map(product => createProductElement(product)).join('');

   
    if (paginationContainer) {
        let html = '';
        if (page > 1) {
            html += `<button class="page-btn" data-page="${page - 1}">Trước</button>`;
        }
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn${i === page ? ' active' : ''}" data-page="${i}">${i}</button>`;
        }
        if (page < totalPages) {
            html += `<button class="page-btn" data-page="${page + 1}">Sau</button>`;
        }
        paginationContainer.innerHTML = html;

        
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.onclick = (e) => {
                currentPage = Number(btn.getAttribute('data-page'));
                renderPage(currentPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
        });
    }
}


function createProductElement(product) {
    return `
        <a href="product-details.html?id=${product.id}" class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='./assets/images/placeholder.jpg'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
            </div>
        </a>
    `;
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}