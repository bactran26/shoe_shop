// ===================== Tham chiếu các phần tử =====================
const filterBrand = document.getElementById("filterBrand");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const applyFilterBtn = document.getElementById("applyFilter");
const clearFilterBtn = document.getElementById("clearFilter");
const productGrid = document.getElementById("productGrid");
const paginationContainer = document.querySelector(".pagination");

let productsPerPage = 16; // số sản phẩm mỗi trang
let currentPage = 1;

// ===================== Chuẩn bị dữ liệu sản phẩm =====================
// Thêm brand bằng cách dựa vào tên sản phẩm nếu chưa có data-brand
let allProducts = Array.from(productGrid.querySelectorAll(".product-card")).map(card => {
  const name = card.querySelector(".product-name").innerText;
  const priceText = card.querySelector(".product-price").innerText.replace(/[₫,.]/g, '');
  const price = Number(priceText);
  let brand = "";
  const nameLower = name.toLowerCase();
  if(nameLower.includes("nike")) brand = "Nike";
  else if(nameLower.includes("adidas")) brand = "Adidas";
  else if(nameLower.includes("converse")) brand = "Converse";
  else if(nameLower.includes("jordan")) brand = "Jordan";
  else if(nameLower.includes("new balance")) brand = "New Balance";
  else if(nameLower.includes("vans")) brand = "Vans";

  return { element: card, name, price, brand };
});

// ===================== Hiển thị sản phẩm theo trang =====================
let filteredProducts = [...allProducts];

function displayProducts(page = 1, productsList = filteredProducts) {
  const totalPages = Math.ceil(productsList.length / productsPerPage);
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;

  allProducts.forEach(p => p.element.style.display = "none");
  productsList.slice(start, end).forEach(p => p.element.style.display = "block");

  // Cập nhật phân trang
  if (paginationContainer) {
    let html = '';
    if (page > 1) html += `<button class="page-btn" data-page="${page-1}">Trước</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn${i===page?' active':''}" data-page="${i}">${i}</button>`;
    }
    if (page < totalPages) html += `<button class="page-btn" data-page="${page+1}">Sau</button>`;
    paginationContainer.innerHTML = html;

    paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
      btn.onclick = () => {
        currentPage = Number(btn.dataset.page);
        displayProducts(currentPage, filteredProducts);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    });
  }
}

// ===================== Hàm áp dụng bộ lọc =====================
function applyFilter() {
  const keyword = inputSearch.value.trim().toLowerCase();
  const brand = filterBrand.value;
  const minPrice = Number(minPriceInput.value) || 0;
  const maxPrice = Number(maxPriceInput.value) || Infinity;

  filteredProducts = allProducts.filter(p => {
    const matchKeyword = keyword ? p.name.toLowerCase().includes(keyword) : true;
    const matchBrand = brand ? p.brand === brand : true;
    const matchPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchKeyword && matchBrand && matchPrice;
  });

  currentPage = 1;
  displayProducts(currentPage, filteredProducts);
}

// ===================== Hàm xóa lọc =====================
function clearFilter() {
  inputSearch.value = '';
  filterBrand.value = '';
  minPriceInput.value = '';
  maxPriceInput.value = '';
  filteredProducts = [...allProducts];
  currentPage = 1;
  displayProducts(currentPage, filteredProducts);
}

// ===================== Gắn sự kiện =====================
applyFilterBtn.onclick = applyFilter;
clearFilterBtn.onclick = clearFilter;

// Khởi tạo hiển thị lần đầu
displayProducts(currentPage, filteredProducts);

