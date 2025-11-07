export async function getProducts() {
    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('✅ Đã load sản phẩm:', data.products.length);
        return data.products;
    } catch (error) {
        console.error('❌ Lỗi khi load sản phẩm:', error);
        return [];
    }
}