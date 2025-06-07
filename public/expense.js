const cashfree = Cashfree({ mode: "sandbox" });

document.addEventListener("DOMContentLoaded", async () => {
  await checkPremiumStatus();
  await fetchExpenses();
});

const EXPENSE_API_URL = "http://localhost:3000/expenses";
let currentPage = +localStorage.getItem("currentPage") || 1;
let limit = +localStorage.getItem("limit") || 10;

document.getElementById("limitSelect").value = limit;

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

function updateLimit() {
  limit = +document.getElementById("limitSelect").value;
  localStorage.setItem("limit", limit);
  currentPage = 1;
  localStorage.setItem("currentPage", currentPage);
  fetchExpenses();
}

function goToPage(page) {
  currentPage = page;
  localStorage.setItem("currentPage", page);
  fetchExpenses();
}

function renderPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage }) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (hasPreviousPage) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.onclick = () => goToPage(previousPage);
    pagination.appendChild(prevBtn);
  }

  const pageInfo = document.createElement("span");
  pageInfo.textContent = ` Page ${currentPage} `;
  pagination.appendChild(pageInfo);

  if (hasNextPage) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.onclick = () => goToPage(nextPage);
    pagination.appendChild(nextBtn);
  }

  const lastInfo = document.createElement("span");
  lastInfo.textContent = ` | Last Page: ${lastPage}`;
  pagination.appendChild(lastInfo);
}

function renderExpenses(expenses) {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  expenses.forEach(exp => {
    const li = document.createElement("li");
    li.id = `expense-${exp.id}`;
    li.innerHTML = `
      ₹${exp.amount} - ${exp.description} - ${exp.category}
      ${exp.note ? `- <em>Note:</em> ${exp.note}` : ""}
      <button class="btn btn-danger btn-sm ms-2" onclick="deleteExpense(${exp.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}


async function fetchExpenses() {
  try {
    const res = await axios.get(`${EXPENSE_API_URL}?page=${currentPage}&limit=${limit}`, {
      headers: getAuthHeader()
    });
    renderExpenses(res.data.expenses);
    renderPagination(res.data);
  } catch (err) {
    alert("Failed to fetch expenses.");
  }
}

async function handleSubmitForm(event) {
  event.preventDefault();

  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;
  const note = event.target.note.value; 

  if (!amount || !description || !category) {
    return alert("All fields are required!");
  }

  try {
    const response = await axios.post(EXPENSE_API_URL, { amount, description, category,note }, {
      headers: getAuthHeader()
    });

    alert("Expense added successfully!");
    event.target.reset();
    await fetchExpenses();
  } catch (error) {
    alert("Failed to add expense");
  }
}

async function deleteExpense(id) {
  try {
    const response = await axios.delete(`${EXPENSE_API_URL}/${id}`, {
      headers: getAuthHeader()
    });

    if (response.status === 200) {
      document.getElementById(`expense-${id}`).remove();
      alert("Expense deleted!");

      const expenseCount = document.getElementById("expenseList").children.length;
      if (expenseCount === 0 && currentPage > 1) {
        currentPage--;
        localStorage.setItem("currentPage", currentPage);
      }
      fetchExpenses();
    }
  } catch (error) {
    alert("Failed to delete expense");
  }
}

async function checkPremiumStatus() {
  try {
    const response = await axios.get("http://localhost:3000/user/status", {
      headers: getAuthHeader()
    });

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
  try {
    const response = await axios.post("http://localhost:3000/pay", {}, {
      headers: getAuthHeader()
    });

    const { paymentSessionId } = response.data;

    await cashfree.checkout({
      paymentSessionId,
      redirectTarget: "_self"
    });
  } catch (err) {
    alert("Payment initiation failed.");
  }
});

function showLeaderboard() {
  if (document.getElementById("show-leaderboard-btn")) return;

  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.id = "show-leaderboard-btn";
  inputElement.value = "Show Leaderboard";
  inputElement.className = "btn btn-info mt-2";

  inputElement.onclick = async () => {
    try {
      const response = await axios.get("http://localhost:3000/premium/leaderboard", {
        headers: getAuthHeader()
      });

      const leaderboardElem = document.getElementById("leaderboard");
      leaderboardElem.innerHTML = '<h4>LeaderBoard</h4><ul class="list-group">';
      response.data.forEach(userDetails => {
        leaderboardElem.innerHTML += `<li class="list-group-item">Name: ${userDetails.name} - Total Expense: ₹${userDetails.total_cost}</li>`;
      });
      leaderboardElem.innerHTML += '</ul>';
    } catch (err) {
      alert("Failed to load leaderboard");
    }
  };

  document.getElementById("message").appendChild(inputElement);
}

document.getElementById("generate-report").addEventListener("click", async () => {
  const filter = document.getElementById("report-filter").value;

  try {
    const response = await axios.get(`http://localhost:3000/report/${filter}`, {
      headers: getAuthHeader()
    });

    renderReport(response.data);
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
        <th>Note</th> 
      </tr>
    </thead>
    <tbody>
      ${data.map(e => `
        <tr>
          <td>${new Date(e.createdAt).toLocaleDateString()}</td>
          <td>₹${e.amount}</td>
          <td>${e.description}</td>
          <td>${e.category}</td>
          <td>${e.note}</td>
        </tr>
      `).join("")}
    </tbody>
  `;
  document.getElementById("report-results").innerHTML = "";
  document.getElementById("report-results").appendChild(table);
}

document.getElementById("download-report").addEventListener("click", async () => {
  try {
    const response = await axios.get("http://localhost:3000/report/download", {
      headers: getAuthHeader()
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
