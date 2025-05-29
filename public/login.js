const API_URL="http://localhost:3000/user/login";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  form.addEventListener("submit", login);
});

async function login(event){
  event.preventDefault();

  const email=event.target.email.value;
  const password=event.target.password.value;

  if( !email || !password){
    alert("Please fill all fields.");
    return;
  }

  try{
    const response=await axios.post(API_URL,{email,password},{ headers: { "Content-Type": "application/json" }});
    alert('login successfully');
    localStorage.setItem('token',response.data.token);
    window.location.href="/view/expense.html";
  }catch(error){
    const msg = error.response?.data?.message || "Login failed.";
    alert(msg);
  }

}