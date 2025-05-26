const cashfree = Cashfree({
        mode: "sandbox"
    });
document.addEventListener("DOMContentLoaded", () => {
  loadExpenses(); 
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

 document.getElementById("payBtn").addEventListener("click",async () => {
  try {
    const token = localStorage.getItem("token");
    const response=await axios.post("http://localhost:3000/pay",{},{ headers: { 'Authorization': token }});
    const {paymentSessionId,orderId}=response.data;
    let checkoutOptions = {
  paymentSessionId,
  redirectTarget: "_self",
  };
  const result=await cashfree.checkout(checkoutOptions);
  if(result.error){
    console.log("User has closed the popupor there is some payment error,Check for payment status");
    console.log(result.error);
  }if(result.redirect){
    console.log("Payment will be redirected");
  }if(result.paymentDetails){
    console.log("Payment has been completed,Check for payment status");
    console.log(result.paymentDetails.paymentMessage);
    const statusResponse=await axios.get(`http://localhost:3000/payment-status/${orderId}`,{ headers: { 'Authorization': token }});
    alert("Your payment is"+statusResponse.data.orderStatus)
    
  }
  } catch (error) {
    console.log(error); 
  }
});



function logout() {
  localStorage.clear();
  window.location.href = "/frontend/login/login.html";
}

