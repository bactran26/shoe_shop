// --- XỬ LÝ ENTER TRÊN Ô SEARCH ---
const inputSearch = document.querySelector(".input-search");

inputSearch.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const keyword = inputSearch.value.trim();
    const absoluteURL = "products.html";

    if (keyword !== "") {
      window.location.href = `${absoluteURL}?search=${encodeURIComponent(keyword)}`;
    } else {
      window.location.href = absoluteURL;
    }
  }
});

// --- HÀM LẤY THAM SỐ URL ---
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// --- LỌC SẢN PHẨM THEO TỪ KHÓA ---
function filterProductsByKeyword() {
  const keyword = getQueryParam("search");
  const productCards = document.querySelectorAll(".product-card");
  if (!keyword) return Array.from(productCards); // Trả về tất cả nếu không có search

  const filtered = [];
  productCards.forEach(card => {
    const name = card.querySelector(".product-name").textContent.toLowerCase();
    if (name.includes(keyword.toLowerCase())) {
      card.style.display = ""; // Hiển thị
      filtered.push(card);
    } else {
      card.style.display = "none"; // Ẩn
    }
  });

  return filtered;
}

// --- PHÂN TRANG CHO SEARCH ---
function paginateSearchProducts() {
  const productsPerPage = 8; // số sản phẩm trên 1 trang
  const filteredProducts = filterProductsByKeyword(); // mảng sản phẩm sau lọc search
  const paginationContainer = document.querySelector(".pagination");

  if (!filteredProducts.length) return;

  let currentPage = 1;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  function showPage(page) {
    currentPage = page;
    filteredProducts.forEach((card, index) => {
      if (index >= (page - 1) * productsPerPage && index < page * productsPerPage) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });

    // cập nhật phân trang
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = "page-btn";
      if (i === page) btn.classList.add("active");
      btn.addEventListener("click", () => showPage(i));
      paginationContainer.appendChild(btn);
    }
    if (page < totalPages) {
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "→";
      nextBtn.className = "page-btn";
      nextBtn.addEventListener("click", () => showPage(page + 1));
      paginationContainer.appendChild(nextBtn);
    }
  }

  showPage(1);
}

// --- CHẠY KHI TRANG LOAD ---
window.addEventListener("DOMContentLoaded", paginateSearchProducts);
