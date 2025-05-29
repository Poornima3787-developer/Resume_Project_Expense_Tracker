const API_URL="http://localhost:3000/user/signup";

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
    const response=await axios.post(API_URL,{name,email,password});
    alert("Signup successful!");
    window.location.href = "/view/expense.html"
    event.target.reset();
  } catch (error) {
    const msg=error.response?.data?.message || "Signup failed.";
    alert(msg);
  }

}