const cashfree = Cashfree({
    mode: "sandbox",
});
document.addEventListener("DOMContentLoaded", async () => {
  await loadExpenses();
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
    const response = await axios.get("http://localhost:3000/user/status",{headers:{'Authorization': 'Bearer ' + token}});
    const isPremium = response.data.isPremium;
    updatePremiumUI(isPremium);  
  } catch (error) {
    console.error("Error fetching premium status:", error);
  }
}

async function updatePremiumUI(isPremium) {
  const bannerText = document.getElementById("premium-msg");
  const bannerBox = document.getElementById("premium-banner"); 
  const payBtn = document.getElementById("payBtn");
  const downloadBtn = document.getElementById("download-report");

  if (isPremium) {
    bannerText.innerText = "🎉 You are a Premium User!";
    bannerBox.style.display = "block";
    if (payBtn) payBtn.style.display = "none";
    if (downloadBtn) downloadBtn.disabled = false;
    showLeaderboard();
  } else {
    bannerBox.style.display = "none";
    if (payBtn) payBtn.style.display = "block";
     if (downloadBtn) downloadBtn.disabled = true;
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

function showLeaderboard(){
  const inputElement=document.createElement('input');
  inputElement.type='button'
  inputElement.value='show leaderboard'
  inputElement.className = 'btn btn-info mt-2';
  inputElement.onclick=async() =>{
    const token=localStorage.getItem('token');
    try{
    const response=await axios.get('http://localhost:3000/premium/leaderboard',{headers:{'Authorization': 'Bearer ' + token}});
    const leaderboardElem=document.getElementById('leaderboard');
    leaderboardElem.innerHTML+='<h4>LeaderBoard</h4><ul class="list-group">';
    response.data.forEach((userDetails)=>{
      leaderboardElem.innerHTML+=`<li class="list-group-item">Name: ${userDetails.name} - Total Expense: ₹${userDetails.total_cost}</li>`;
    });
    leaderboardElem.innerHTML+='</ul>';
  }catch (err) {
      alert('Failed to load leaderboard');
    }
  }
  document.getElementById('message').appendChild(inputElement);
}

document.getElementById("generate-report").addEventListener("click", async () => {
  const filter = document.getElementById("report-filter").value;
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`http://localhost:3000/report/${filter}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    renderReport(response.data); // Assume response.data is an array of expense objects

  } catch (err) {
    alert("Error generating report");
  }
});

function renderReport(data) {
  const table = document.createElement("table");
  table.className = "table table-striped";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Date</th>
        <th>Amount</th>
        <th>Description</th>
        <th>Category</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(e => `
        <tr>
          <td>${new Date(e.createdAt).toLocaleDateString()}</td>
          <td>₹${e.amount}</td>
          <td>${e.description}</td>
          <td>${e.category}</td>
        </tr>
      `).join("")}
    </tbody>
  `;
  document.getElementById("report-results").innerHTML = "";
  document.getElementById("report-results").appendChild(table);
}

document.getElementById("download-report").addEventListener("click", async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get("http://localhost:3000/report/download", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      const a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "expense_report.csv";
      a.click();
    }

  } catch (err) {
    alert("Download failed");
  }
});


function logout() {
  localStorage.clear();
  window.location.href = "/view/login.html";
}

