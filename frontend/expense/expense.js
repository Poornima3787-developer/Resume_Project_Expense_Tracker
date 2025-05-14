document.addEventListener('DOMContentLoaded',loadExpenses);

const API_URL="http://localhost:3000/expenses";

async function handleSubmitForm(event){
  event.preventDefault();

  const amount=event.target.amount.value;
  const description=event.target.description.value;
  const category=event.target.category.value;
  
  try {
    const token  = localStorage.getItem('token')
    const response=await axios.post(API_URL,{amount,description,category},{headers:{"Authorization":token}});
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
    console.log("Sending token:", token);
    const response=await axios.get(API_URL,{headers:{"Authorization":token}})
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
  li.classList.add('mb-2');
  li.innerHTML = `₹${expense.amount} - ${expense.description} - ${expense.category}<button class="btn btn-danger btn-sm ms-2" onclick="deleteExpense(${expense.id})">Delete</button>`;
  list.appendChild(li);
 }

 async function deleteExpense(id) {
  if (!id) {
    console.error('Invalid expense ID:', id);
    return;
  }
  try {
    const token  = localStorage.getItem('token');
    const response=await axios.delete(`${API_URL}/${id}`,{headers:{"Authorization":token}});
    if (response.status === 200) {
      document.getElementById(`expense-${id}`).remove();
      alert('Expense deleted!');
    }
  } catch (error) {
    alert('Failed to delete expense');
    console.error(error);
  }
 }