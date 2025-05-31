document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('forgot-password-form');
  const messageDiv = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;

    try {
      const response = await axios.post('http://localhost:3000/password/forgotpassword', { email });

      if (response.status === 202) {
        messageDiv.innerHTML = '<span class="text-success">Reset link sent! Check your email.</span>';
      } else {
        messageDiv.innerHTML = '<span class="text-danger">Unexpected error occurred.</span>';
      }
    } catch (err) {
      console.error(err);
      messageDiv.innerHTML = `<span class="text-danger">${err.response?.data?.message || 'Error sending email.'}</span>`;
    }
  });
});
