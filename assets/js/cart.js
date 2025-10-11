document.addEventListener("DOMContentLoaded", function () {
  const minusBtn = document.getElementById("minus");
  const plusBtn = document.getElementById("plus");
  const quantitySpan = document.getElementById("quantity");
  const tempPriceSpan = document.getElementById("tempPrice");

  // Giá đơn vị (1.190.000₫)
  const unitPrice = 1190000; // Đơn vị: VND, không có dấu chấm

  // Hàm định dạng tiền tệ (thêm dấu chấm)
  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";
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
});
function thongbao() {
  alert("Nhập mã thành công!");
}
