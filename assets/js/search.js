// ==== Biến DOM ====
const inputSearch = document.querySelector(".input-search");
const advancedBox = document.getElementById("advancedBox");
const resultsBox = document.getElementById("searchResults");
const brandSelect = document.getElementById("filterBrand");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");

let products = [];
let loaded = false;

// ==== Hàm tải dữ liệu sản phẩm ====
async function loadProducts() {
  if (loaded) return;
  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) throw new Error("Lỗi khi tải dữ liệu sản phẩm");
    const data = await response.json();

    products = data.products;
    loaded = true;
    console.log("✅ Đã tải sản phẩm:", products);
  } catch (err) {
    console.error("❌ Không thể tải sản phẩm:", err);
  }
}
loadProducts();

// ==== Khi focus vào ô tìm kiếm ====
inputSearch.addEventListener("focus", async () => {
  await loadProducts();
  advancedBox.classList.add("open");
});

// ==== Ẩn ô nâng cao & kết quả khi click ra ngoài ====
document.addEventListener("click", (e) => {
  if (!advancedBox.contains(e.target) && e.target !== inputSearch) {
    advancedBox.classList.remove("open");
    resultsBox.classList.remove("show");
  }
});

// ==== Hàm áp dụng lọc và tìm kiếm ====
async function apply() {
  await loadProducts();

  const keyword = inputSearch.value.toLowerCase().trim();
  const category = brandSelect.value;
  const min = parseInt(minPriceInput.value) || 0;
  const max = parseInt(maxPriceInput.value) || Infinity;

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(keyword) &&
      (!category || p.category === category) &&
      p.price >= min &&
      p.price <= max
  );

  if (filtered.length > 0) {
    resultsBox.innerHTML = filtered
      .map(
        (p) => `
        <div class="product-item" data-id="${p.id}">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <h4>${p.name}</h4>
            <p>${p.category.toUpperCase()} - ${p.price.toLocaleString()}₫</p>
          </div>
        </div>
      `
      )
      .join("");

    // ➕ Gán sự kiện click cho từng kết quả
    document.querySelectorAll(".product-item").forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.dataset.id;
        console.log("🟢 Click sản phẩm ID:", id);
        // ⚡ Chuyển sang trang chi tiết
        window.location.href = `./product-details.html?id=${id}`;
      });
    });
  } else {
    resultsBox.innerHTML = `<div style="padding:8px;">❌ Không tìm thấy sản phẩm phù hợp.</div>`;
  }

  resultsBox.classList.add("show");
}

// ==== Khi người dùng gõ vào ô tìm kiếm ====
inputSearch.addEventListener("input", () => {
  if (inputSearch.value.trim() !== "") {
    apply();
  } else {
    resultsBox.classList.remove("show");
  }
});

// ==== Cho phép gọi từ HTML ====
window.apply = apply;
