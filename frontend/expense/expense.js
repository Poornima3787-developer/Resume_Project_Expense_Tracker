document.addEventListener('DOMContentLoaded',loadExpenses);
const API_URL="http://localhost:3000/expenses";

async function handleSubmitForm(event){
  event.preventDefault();

  const amount=event.target.amount.value;
  const description=event.target.description.value;
  const category=event.target.category.value;

  try {
    const response=await axios.post(API_URL,{amount,description,category});
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
    const response=await axios.get(API_URL);
    if (Array.isArray(response.data.expense)) {
      response.data.expense.forEach(displayExpense);
    } else {
      console.error('Expected array but got:', response.data.expense);
    }
  } catch (error) {
    console.error(error);
    alert('Failed to fetch expenses');
  }
}

function displayExpense(expense){
  const list = document.getElementById('expense-list');
  const li = document.createElement('li');
  li.id = `expense-${expense.id}`;
  li.innerHTML = `₹${expense.amount} - ${expense.description} - ${expense.category}<button onclick="deleteExpense(${expense.id})">Delete</button>`;
  list.appendChild(li);
 }

 async function deleteExpense(id){
  try {
    await axios.delete(`${API_URL}/${id}`);
    document.getElementById(`expense-${id}`).remove();
    alert('Expense deleted!');
  } catch (error) {
    alert('Failed to delete expense');
    console.error(error);
  }
 }