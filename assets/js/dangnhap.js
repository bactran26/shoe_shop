<script>
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('emaildangnhap').value.trim();
    const pass = document.getElementById('matkhaudangnhap').value.trim();

    // Kiểm tra trống
    if (!email || !pass) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    // Kiểm tra độ dài tối thiểu
    if (email.length < 3) {
      alert('Tài khoản (email) phải có ít nhất 3 ký tự!');
      return;
    }

    if (pass.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    // Nếu hợp lệ -> chuyển trang
    window.location.href = 'indexafter.html';
  });
</script>