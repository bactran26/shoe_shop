import { getProducts } from '../../data/dataManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let brand = urlParams.get('brand');
    let category = urlParams.get('category');

    // Xử lý giá trị null
    if (brand === 'null' || !brand) brand = null;
    if (category === 'null' || !category) category = null;
    
    console.log('🔍 Lọc theo:', { category, brand });
    
    const brandTitle = document.getElementById('brandTitle');
    const productsContainer = document.getElementById('brand-products');
    
    if (!productsContainer) {
        console.error('❌ Không tìm thấy container #brand-products');
        return;
    }
    
    try {
        const products = await getProducts();
        console.log('📦 Tổng sản phẩm:', products.length);
        
        // Lọc sản phẩm
        let filteredProducts = products;
        
        if (category) {
            filteredProducts = filteredProducts.filter(p => 
                p.category && p.category.toLowerCase() === category.toLowerCase()
            );
            console.log(`📌 Sau khi lọc category "${category}":`, filteredProducts.length);
        }
        
        if (brand) {
            filteredProducts = filteredProducts.filter(p => 
                p.brand && p.brand.toLowerCase() === brand.toLowerCase()
            );
            console.log(`📌 Sau khi lọc brand "${brand}":`, filteredProducts.length);
        }
        
        // Cập nhật tiêu đề
        if (category && brand) {
            brandTitle.textContent = `${category.toUpperCase()} ${brand.toUpperCase()}`;
        } else if (brand) {
            brandTitle.textContent = brand.toUpperCase();
        } else if (category) {
            brandTitle.textContent = category.toUpperCase();
        } else {
            brandTitle.textContent = 'TẤT CẢ SẢN PHẨM';
        }
        
        // Hiển thị sản phẩm
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Không tìm thấy sản phẩm</p>';
            console.log('⚠️ Không có sản phẩm nào');
            return;
        }
        
        productsContainer.innerHTML = filteredProducts
            .map(product => createProductElement(product))
            .join('');
        
        console.log('✅ Đã hiển thị', filteredProducts.length, 'sản phẩm');
        
        // Thêm sự kiện click
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.getAttribute('data-id');
                window.location.href = `product-details.html?id=${productId}`;
            });
        });
        
    } catch (error) {
        console.error('❌ Lỗi:', error);
        productsContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: red;">Có lỗi xảy ra</p>';
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