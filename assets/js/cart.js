document.addEventListener("DOMContentLoaded", function () {
  const minusBtn = document.getElementById("minus");
  const plusBtn = document.getElementById("plus");
  const quantitySpan = document.getElementById("quantity");
  const tempPriceSpan = document.getElementById("tempPrice");

  // Giá đơn vị (1.190.000₫)
  const unitPrice = 1190000; // Đơn vị: VND, không có dấu chấm
  /*document.querySelector(".nutdangky").addEventListener("click", function () {
    alert("🎉 Đăng ký thành công!");
  });
  */

  document.querySelector(".nutdatlai").addEventListener("click", function () {
    alert("🎉 Đặt lại mật khẩu thành công , kiểm tra email của bạn!");
  });

  // Hàm định dạng tiền tệ (thêm dấu chấm)
  function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "₫";
  }

  // Xử lý khi nhấn nút giảm (-)
  minusBtn.addEventListener("click", function () {
    let quantity = parseInt(quantitySpan.textContent);
    if (quantity > 1) {
      quantitySpan.textContent = quantity - 1;
      const newPrice = (quantity - 1) * unitPrice;
      tempPriceSpan.textContent = formatPrice(newPrice);
    }
  });

  // Xử lý khi nhấn nút tăng (+)
  plusBtn.addEventListener("click", function () {
    let quantity = parseInt(quantitySpan.textContent);
    quantitySpan.textContent = quantity + 1;
    const newPrice = (quantity + 1) * unitPrice;
    tempPriceSpan.textContent = formatPrice(newPrice);
  });

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  const cartContainer = document.getElementById("cart-container");
  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Giỏ hàng trống</p>";
    return;
  }

  cart.forEach((item) => {
    cartContainer.innerHTML += `
      <div class="cart-row">
        <div class="cart-col">
          <div class="product-info">
            <img src="${item.image}" alt="${
      item.name
    }" style="transform: translateX(-15px)" />
            <span>${item.name} / - ${item.size}</span>
          </div>
        </div>
        <div class="cart-col">${formatPrice(item.price)}</div>
        <div class="cart-col">
          <div class="quantity-box">
            <span>${item.quantity}</span>
          </div>
        </div>
        <div class="cart-col"><span>${formatPrice(
          item.price * item.quantity
        )}</span></div>
      </div>
    `;
  });
});
function thongbao() {
  alert("Nhập mã thành công!");
}
