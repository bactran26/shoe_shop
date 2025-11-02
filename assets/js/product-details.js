import { getProducts } from '../../data/dataManager.js';

// Format tiền VND
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

// Hiển thị thông báo
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) cartCountEl.textContent = count;
}

// Xử lý chi tiết sản phẩm
export async function DetailProducts(id) {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === parseInt(id));
    
    if (!product) {
      showToast('Không tìm thấy sản phẩm', 'error');
      return;
    }

    const detailHtml = `
      <div class="detail-product">
        <div class="detail-flex">
          <div class="image">
            <div class="main-img">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="promo-image">
              <div class="image__item">
                <img src="${product.image}" alt="${product.name}">
              </div>
              <div class="image__item">
                <img src="${product.image}" alt="${product.name}">
              </div>
              <div class="image__item">
                <img src="${product.image}" alt="${product.name}">
              </div>
            </div>
          </div>

          <div class="details-pro">
            <h1>${product.name}</h1>
            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span>(42 đánh giá của khách hàng)</span>
            </div>
            <div class="product-price">
              <span class="original-price">${formatPrice(1295000)}</span>
              <span class="current-price">${formatPrice(product.price)}</span>
              <span class="discount-tag">-40%</span>
            </div>

            <div class="size-section">
              <p>Size:</p>
              <div class="size_product">
                ${generateSizeButtons()}
              </div>
            </div>

            <div class="quantity-section">
              <p>Số lượng:</p>
              <div class="quantity-selector">
                <button class="btn-down">-</button>
                <input type="number" class="input-quantity" value="1" min="1">
                <button class="btn-up">+</button>
              </div>
            </div>

            <button class="add-to-cart">THÊM VÀO GIỎ HÀNG</button>

            <div class="shipping-info">
              <p>✓ Miễn phí vận chuyển toàn quốc cho đơn hàng trên 1tr.</p>
              <p>🚚 Giao nhanh 2h trong nội thành HCM.</p>
              <p>⌛ Thời gian vận chuyển trung bình 3-4 ngày.</p>
            </div>

            <div class="store-info">
              <h3>Visit our store in HCM city</h3>
              <p>ĐỊA CHỈ:</p>
              <p>Phone: 0903 150 443</p>
              <p>48B Thạch Thị Thanh, Tân Định, HCM.</p>
              <a href="#" class="google-map-link">Google map</a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.querySelector('.detail-background').innerHTML = detailHtml;
    document.querySelector('.detail-background').style.display = 'block';

    // Xử lý các sự kiện
    setupEventListeners(product);

  } catch (error) {
    console.error('Lỗi:', error);
    showToast('Có lỗi xảy ra', 'error');
  }
}

function setupEventListeners(product) {
  // Xử lý chọn size
  document.querySelectorAll('.size_product .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size_product .btn').forEach(b => b.classList.remove('check'));
      btn.classList.add('check');
    });
  });

  // Xử lý số lượng
  const quantityInput = document.querySelector('.input-quantity');
  document.querySelector('.btn-down').addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) quantityInput.value = currentValue - 1;
  });

  document.querySelector('.btn-up').addEventListener('click', () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });

  // Xử lý thêm vào giỏ hàng
  document.querySelector('.add-to-cart').addEventListener('click', () => {
    // Lấy size đã chọn
    const selectedSizeBtn = document.querySelector('.size_product .btn.check');
    if (!selectedSizeBtn) {
        showToast('Vui lòng chọn size', 'warning');
        return;
    }
    const size = selectedSizeBtn.textContent;

    // Lấy số lượng
    const quantity = parseInt(document.querySelector('.input-quantity').value) || 1;

    // Tạo object sản phẩm
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: size,
        quantity: quantity
    };

    // Thêm vào giỏ hàng
    addToCart(cartItem);
    showToast('Đã thêm vào giỏ hàng', 'success');
});
}

function addToCart(item) {
    const cart = getCart();
    // Kiểm tra sản phẩm đã có trong giỏ chưa (theo id và size)
    const existing = cart.find(i => i.id === item.id && i.size === item.size);
    if (existing) {
        existing.quantity += item.quantity;
    } else {
        cart.push(item);
    }
    saveCart(cart);
    updateCartCount();
}

function generateSizeButtons() {
  const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44];
  return sizes.map(size => `<button class="btn">${size}</button>`).join('');
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Lấy ID sản phẩm từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            showToast('Không tìm thấy sản phẩm', 'error');
            return;
        }

        // Gọi hàm hiển thị chi tiết sản phẩm
        const products = await getProducts();
        const product = products.find(p => p.id === parseInt(productId));
        
        if (!product) {
            showToast('Không tìm thấy sản phẩm', 'error');
            return;
        }

        // Hiển thị chi tiết sản phẩm
        document.querySelector('.detail-product').innerHTML = `
            <div class="detail-flex">
                <div class="image">
                    <div class="main-img">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="promo-image">
                        <div class="image__item">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="image__item">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="image__item">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                    </div>
                </div>

                <div class="details-pro">
                    <h1>${product.name}</h1>
                    <div class="product-rating">
                        <span class="stars">★★★★★</span>
                        <span>(42 đánh giá của khách hàng)</span>
                    </div>
                    <div class="product-price">
                        <span class="original-price">${formatPrice(1295000)}</span>
                        <span class="current-price">${formatPrice(product.price)}</span>
                        <span class="discount-tag">-40%</span>
                    </div>

                    <div class="size-section">
                        <p>Size:</p>
                        <div class="size_product">
                            ${generateSizeButtons()}
                        </div>
                    </div>

                    <div class="quantity-section">
                        <p>Số lượng:</p>
                        <div class="quantity-selector">
                            <button class="btn-down">-</button>
                            <input type="number" class="input-quantity" value="1" min="1">
                            <button class="btn-up">+</button>
                        </div>
                    </div>

                    <button class="add-to-cart">THÊM VÀO GIỎ HÀNG</button>

                    <div class="shipping-info">
                        <p>✓ Miễn phí vận chuyển toàn quốc cho đơn hàng trên 1tr.</p>
                        <p>🚚 Giao nhanh 2h trong nội thành HCM.</p>
                        <p>⌛ Thời gian vận chuyển trung bình 3-4 ngày.</p>
                    </div>

                    <div class="store-info">
                        <h3>Visit our store in HCM city</h3>
                        <p>ĐỊA CHỈ:</p>
                        <p>Phone: 0903 150 443</p>
                        <p>48B Thạch Thị Thanh, Tân Định, HCM.</p>
                        <a href="#" class="google-map-link">Google map</a>
                    </div>
                </div>
            </div>
        `;

        // Setup các event listener
        setupEventListeners(product);

    } catch (error) {
        console.error('Lỗi:', error);
        showToast('Có lỗi xảy ra', 'error');
    }
});

// Trong file products.js khi tạo card sản phẩm
function createProductCard(product) {
    return `
        <div class="product-card" onclick="window.location.href='product-details.html?id=${product.id}'">
            <!-- ... rest of product card code ... -->
        </div>
    `;
}
