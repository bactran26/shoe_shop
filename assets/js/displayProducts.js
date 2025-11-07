const productsGrid = document.getElementById("brand-products");
const brandTitle = document.getElementById("brandTitle");

// Lấy query từ URL (VD: ?brand=Nike)
const params = new URLSearchParams(window.location.search);
const brandParam = params.get("brand");

async function showProducts() {
  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) throw new Error("Không thể tải dữ liệu sản phẩm");

    const data = await response.json();
    const products = data.products;

    let filtered = products;

    // Nếu có brandParam => lọc theo brand
    if (brandParam) {
      filtered = products.filter(
        (p) => p.brand?.toLowerCase() === brandParam.toLowerCase()
      );
      brandTitle.textContent = brandParam.toUpperCase();
    } else {
      brandTitle.textContent = "TẤT CẢ SẢN PHẨM";
    }

    // Nếu không có sản phẩm nào
   if (filtered.length === 0) {
  productsGrid.innerHTML = `
    <div class="no-products">
      <p>Không có sản phẩm nào của <b>${brandParam.toUpperCase()}</b> </p>
    </div>
  `;
  return;
}


    // Hiển thị danh sách sản phẩm (layout giống index.html)
    productsGrid.innerHTML = filtered
      .map(
        (p) => `
        <div class="product-card" data-id="${p.id}">
          <div class="product-image">
            <img src="${p.image}" alt="${p.name}" />
          </div>
          <div class="product-info">
            <h3 class="product-name">${p.name}</h3>
            <p class="product-price">${p.price.toLocaleString()}₫</p>
          </div>
        </div>
      `
      )
      .join("");

    // Khi click vào sản phẩm -> chuyển sang trang chi tiết
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.id;
        window.location.href = `product-details.html?id=${id}`;
      });
    });
  } catch (error) {
    console.error("Lỗi:", error);
    productsGrid.innerHTML = "<p>Không thể tải dữ liệu sản phẩm.</p>";
  }
}

document.addEventListener("DOMContentLoaded", showProducts);
