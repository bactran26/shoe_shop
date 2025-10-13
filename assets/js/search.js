const inputSearch = document.querySelector(".input-search");
const advancedBox = document.getElementById("advancedBox");
const resultsBox = document.getElementById("searchResults");
const brandSelect = document.getElementById("filterBrand"); // lọc theo danh mục (category)
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");

let products = [];
let loaded = false;

async function loadProducts() {
    if (loaded) return;
    try {
        const response = await fetch("./data/products.json");
        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
        const data = await response.json();

        products = data.products;
        loaded = true;
        console.log("✅ Đã tải sản phẩm:", products);
    } catch (err) {
        console.error("❌ Không thể tải sản phẩm:", err);
    }
}
loadProducts();

inputSearch.addEventListener("focus", async () => {
    await loadProducts();
    advancedBox.classList.add("open");
});

document.addEventListener("click", (e) => {
    if (!advancedBox.contains(e.target) && e.target !== inputSearch) {
        advancedBox.classList.remove("open");
        resultsBox.classList.remove("show");
    }
});

async function apply() {
    await loadProducts();

    const keyword = inputSearch.value.toLowerCase().trim();
    const category = brandSelect.value;
    const min = parseInt(minPriceInput.value) || 0;
    const max = parseInt(maxPriceInput.value) || Infinity;

    const filtered = products.filter(p =>
        (p.name?.toLowerCase().includes(keyword)) &&
        (!category || p.category === category) &&
        (p.price >= min && p.price <= max)
    );

    if (filtered.length > 0) {
        resultsBox.innerHTML = filtered.map(p => `
      <div class="product-item">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <h4>${p.name}</h4>
          <p>${p.category.toUpperCase()} - ${p.price.toLocaleString()}₫</p>
        </div>
      </div>
    `).join("");
    } else {
        resultsBox.innerHTML = `<div style="padding:8px;">❌ Không tìm thấy sản phẩm phù hợp.</div>`;
    }

    resultsBox.classList.add("show");
}

inputSearch.addEventListener("input", () => {
    if (inputSearch.value.trim() !== "") {
        apply();
    } else {
        resultsBox.classList.remove("show");
    }
});

window.apply = apply;
