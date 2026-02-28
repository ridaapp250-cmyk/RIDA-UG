<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Registration</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
</head>
<body>
    <div class="container">
        <h2 class="mt-5">Admin Registration</h2>
        <form id="admin-register-form">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" class="form-control" id="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <div class="form-group">
                <label for="phone">Phone:</label>
                <input type="text" class="form-control" id="phone" required>
            </div>
            <button type="submit" class="btn btn-primary">Register</button>
        </form>
    </div>

    <script>
        document.getElementById('admin-register-form').addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData();
            formData.append('name', document.getElementById('name').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('password', document.getElementById('password').value);
            formData.append('phone', document.getElementById('phone').value);

            fetch('/api/admin/create-admin', {
                method: 'POST',
                body: formData
            }).then(response => response.json())
              .then(data => {
                  if (data.msg) {
                      alert(data.msg);
                  } else if (data.errors) {
                      alert('Error: ' + data.errors.map(err => err.msg).join(', '));
                  }
              })
              .catch(err => alert('Error: ' + err.message));
        });
   const token = localStorage.getItem('token');

fetch('/api/admin/create-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name,
    email,
    password,
    phone
  })
})
.then(res => res.json())
.then(data => console.log(data));
    </script>
</body>
</html>
