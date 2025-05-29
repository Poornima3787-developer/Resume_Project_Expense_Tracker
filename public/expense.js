const cashfree = Cashfree({
    mode: "sandbox",
});
document.addEventListener("DOMContentLoaded", async () => {
  loadExpenses();
  const isPremium=await checkPremiumStatus();
  updatePremiumUI(isPremium);
  localStorage.setItem('isPremium',isPremium.toString())

});

const API_URL="http://localhost:3000/expenses";

async function handleSubmitForm(event){
  event.preventDefault();

  const amount=event.target.amount.value;
  const description=event.target.description.value;
  const category=event.target.category.value;
  
  try {
    const token  = localStorage.getItem('token')
    const response=await axios.post(API_URL,{amount,description,category},{headers:{'Authorization':token}});
    displayExpense(response.data.expense);
    alert('Expenses added successfully');
    event.target.reset();
  } catch (error) {
    console.error(error);
    alert('Failed to add expense');
  }
}

async function loadExpenses(){
  try {
    const token  = localStorage.getItem('token');
    const response=await axios.get(API_URL,{headers:{'Authorization':token}})
    /* const list = document.getElementById('expense-list');
    list.innerHTML = '';*/
     response.data.expenses.forEach(expense => {
      displayExpense(expense);
    });
  
  } catch (error) {
    console.error(error);
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
    const response=await axios.delete(`${API_URL}/${id}`,{headers:{'Authorization':token}});
    if (response.status === 200) {
      document.getElementById(`expense-${id}`).remove();
      alert('Expense deleted!');
    }
  } catch (error) {
    alert('Failed to delete expense');
    console.error(error);
  }
 }

 async function checkPremiumStatus() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const response = await axios.get('http://localhost:3000/user/status', {
      headers: { 'Authorization': token }
    });
    
    return response.data.isPremium;
  } catch (error) {
    console.error('Premium check failed:', error);
    return false;
  }
}

async function updatePremiumUI(isPremium) {
  const banner = document.getElementById("premium-msg");
  const payBtn = document.getElementById("payBtn");
  if (isPremium) {
    banner.innerText = "🎉 You are a Premium User!";
    banner.style.display = "block";
    if (payBtn) payBtn.style.display = "none";
  } else {
    banner.style.display = "none";
    if (payBtn) payBtn.style.display = "block";
  }
}

document.getElementById("payBtn").addEventListener("click", async () => {
  try {
    const response = await axios.post("http://localhost:3000/pay",{ headers: { 'Authorization': localStorage.getItem('token') } });

    const data = response.data;
    const paymentSessionId = data.paymentSessionId;

    let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self", 
    };

    await cashfree.checkout(checkoutOptions);
    checkPaymentStatus(paymentSessionId);
  } catch (err) {
    console.error("Error:", err);
  }
});

async function checkPaymentStatus(paymentSessionId) {
  try {
    const res = await axios.get(`http://localhost:3000/payment-status/${paymentSessionId}`,{ headers: { 'Authorization': localStorage.getItem('token') } });
    if (res.data.orderStatus === 'Success') {
      updatePremiumUI(true);
      localStorage.setItem('isPremium','true')
    } else {
      alert('Transaction Failed!');
    }
  } catch (error) {
    alert('Error verifying payment status');
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "/view/login.html";
}

