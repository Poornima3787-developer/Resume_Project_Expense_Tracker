const cashfree = Cashfree({
    mode: "sandbox",
});
document.addEventListener("DOMContentLoaded", async () => {
  loadExpenses();
 await checkPremiumStatus();
});

const API_URL="http://localhost:3000/expenses";

async function handleSubmitForm(event){
  event.preventDefault();

  const amount=event.target.amount.value;
  const description=event.target.description.value;
  const category=event.target.category.value;
  
  try {
    const token  = localStorage.getItem('token')
    const response=await axios.post(API_URL,{amount,description,category},{headers:{'Authorization': 'Bearer ' + token}});
    displayExpense(response.data.expense);
    alert('Expenses added successfully');
    event.target.reset();
  } catch (error) {
   
    alert('Failed to add expense');
  }
}

async function loadExpenses(){
  try {
    const token  = localStorage.getItem('token');
    const response=await axios.get(API_URL,{headers:{'Authorization': 'Bearer ' + token}})
    /* const list = document.getElementById('expense-list');
    list.innerHTML = '';*/
     response.data.expenses.forEach(expense => {
      displayExpense(expense);
    });
  
  } catch (error) {
    
    alert('Failed to fetch expenses');
  }
}

function displayExpense(expense){
  const list = document.getElementById('expense-list');
  const li = document.createElement('li');
  li.id = `expense-${expense.id}`;
  li.innerHTML = `₹${expense.amount} - ${expense.description} - ${expense.category}<button class="btn btn-danger btn-sm ms-2" onclick="deleteExpense(${expense.id})">Delete</button>`;
  list.appendChild(li);
 }

 async function deleteExpense(id) {
  try {
    const token  = localStorage.getItem('token');
    const response=await axios.delete(`${API_URL}/${id}`,{headers:{'Authorization': 'Bearer ' + token}});
    if (response.status === 200) {
      document.getElementById(`expense-${id}`).remove();
      alert('Expense deleted!');
    }
  } catch (error) {
    alert('Failed to delete expense');
    
  }
 }

 async function checkPremiumStatus() {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get("http://localhost:3000/user/status", {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const isPremium = response.data.isPremium;
    updatePremiumUI(isPremium);  
  } catch (error) {
    console.error("Error fetching premium status:", error);
  }
}

async function updatePremiumUI(isPremium) {
  const bannerText = document.getElementById("premium-msg");
  const bannerBox = document.getElementById("premium-banner");  // <-- target div, not span
  const payBtn = document.getElementById("payBtn");

  if (isPremium) {
    bannerText.innerText = "🎉 You are a Premium User!";
    bannerBox.style.display = "block";
    if (payBtn) payBtn.style.display = "none";
  } else {
    bannerBox.style.display = "none";
    if (payBtn) payBtn.style.display = "block";
  }
}

document.getElementById("payBtn").addEventListener("click", async () => {
  const token  = localStorage.getItem('token');
  try {
    const response = await axios.post("http://localhost:3000/pay",{},{headers:{'Authorization': 'Bearer ' + token}});

    const data = response.data;
    const paymentSessionId = data.paymentSessionId;

    let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self", 
    };

    await cashfree.checkout(checkoutOptions);

  } catch (err) {
   
  }
});


function logout() {
  localStorage.clear();
  window.location.href = "/view/login.html";
}

