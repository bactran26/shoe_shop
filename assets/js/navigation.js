document.addEventListener('DOMContentLoaded', () => {
    // Lấy tất cả các link trong submenu
    const brandLinks = document.querySelectorAll('.sub-nav a');
    
    // Thêm event listener cho mỗi link
    brandLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
            
            const brand = link.getAttribute('data-brand');
            
            // Lưu thương hiệu đã chọn vào localStorage
            localStorage.setItem('selectedBrand', brand);
            
            // Chuyển đến trang products.html với query parameter
            window.location.href = `products.html?brand=${brand}`;
        });
    });
});