import { getProducts } from '../../data/dataManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand');
    const category = urlParams.get('category');
    
    const brandTitle = document.getElementById('brandTitle');
    const productsContainer = document.getElementById('brand-products');
    
    if (!productsContainer) {
        console.error('Không tìm thấy container sản phẩm');
        return;
    }
    
    try {
        const products = await getProducts();
        console.log('Tổng số sản phẩm:', products.length); // Debug
        
        // Lọc sản phẩm theo category và brand
        let filteredProducts = products;
        
        if (category) {
            filteredProducts = filteredProducts.filter(p => 
                p.category && p.category.toLowerCase() === category.toLowerCase()
            );
            console.log(`Lọc theo category "${category}":`, filteredProducts.length);
        }
        
        if (brand) {
            filteredProducts = filteredProducts.filter(p => 
                p.brand && p.brand.toLowerCase() === brand.toLowerCase()
            );
            console.log(`Lọc theo brand "${brand}":`, filteredProducts.length);
        }
        
        // Cập nhật tiêu đề
        if (category && brand) {
            brandTitle.textContent = `${brand.toUpperCase()} - ${category.toUpperCase()}`;
        } else if (brand) {
            brandTitle.textContent = `${brand.toUpperCase()}`;
        } else if (category) {
            brandTitle.textContent = `${category.toUpperCase()}`;
        } else {
            brandTitle.textContent = 'TẤT CẢ SẢN PHẨM';
        }
        
        // Hiển thị sản phẩm
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Không tìm thấy sản phẩm</p>';
            return;
        }
        
        productsContainer.innerHTML = filteredProducts
            .map(product => createProductElement(product))
            .join('');
        
        // Thêm sự kiện click cho các sản phẩm
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.getAttribute('data-id');
                window.location.href = `product-details.html?id=${productId}`;
            });
        });
        
    } catch (error) {
        console.error('Lỗi:', error);
        productsContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: red;">Có lỗi xảy ra khi tải sản phẩm</p>';
    }
});

function createProductElement(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='./assets/images/placeholder.jpg'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
            </div>
        </div>
    `;
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

<div class="products-section">
    <div class="navigation">
        <a href="index.html" class="back-button">← Quay về trang chủ</a>
    </div>
    <h2 class="section-title" id="brandTitle">PRODUCTS</h2>
    <div class="products-grid" id="brand-products"></div>
</div>