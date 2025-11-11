const inputSearch = document.querySelector(".input-search");

inputSearch.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Ngăn form reload lại trang

    // Lấy giá trị người dùng nhập
    const keyword = inputSearch.value.trim();

    // Chuyển hướng bằng đường dẫn tuyệt đối (thay link này bằng link thật của bạn)
    const absoluteURL = "products.html";

    // Nếu muốn gửi luôn từ khóa tìm kiếm:
    if (keyword !== "") {
      window.location.href = `${absoluteURL}?search=${encodeURIComponent(
        keyword
      )}`;
    } else {
      window.location.href = absoluteURL;
    }
  }
});
