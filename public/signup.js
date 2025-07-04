const API_URL="/user/signup";

async function signup(event){
  event.preventDefault();

  const name=event.target.name.value;
  const email=event.target.email.value;
  const password=event.target.password.value;

  if(!name || !email || !password){
    alert("Please fill all fields.");
    return;
  }

  try {
    const response=await axios.post(API_URL,{name,email,password},{ headers: { "Content-Type": "application/json" }});
    alert("Signup successful!");
    localStorage.setItem('token',response.data.token);
    window.location.href = "/expense"
    event.target.reset();
  } catch (error) {
    const msg=error.response?.data?.message || "Signup failed.";
    alert(msg);
  }

}