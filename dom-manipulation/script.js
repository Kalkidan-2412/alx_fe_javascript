const quotes = [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];
const categoryFilter = document.getElementById('categoryFilter');
categoryFilter.addEventListener('change', filterQuotesByCategory);

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const addQuoteBtn = document.getElementById("addQuoteBtn");

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory
    ? quotes.filter(q => q.category === selectedCategory)
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
}
function filterQuotesByCategory() {
  const selectedCategory = categoryFilter.value;
  const allQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  const filteredQuotes = selectedCategory === 'all'
    ? allQuotes
    : allQuotes.filter(q => q.category === selectedCategory);

  displayQuotes(filteredQuotes);
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  alert("Quote added successfully!");
}
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API

let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch {
      quotes = [];
    }
  } else {
    quotes = [
      { text: "The only limit is your mind.", category: "Motivation" },
      { text: "Simplicity is the ultimate sophistication.", category: "Design" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
    ];
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    return data.slice(0, 10).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

// ✅ Post new quote to server (simulated)
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
  } catch (error) {
    console.error("Post error:", error);
  }
}

// ✅ Sync quotes and resolve conflicts
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  let conflictsResolved = false;
  const mergedQuotes = [...serverQuotes];

  localQuotes.forEach(local => {
    if (!serverQuotes.some(server => server.text === local.text)) {
      mergedQuotes.push(local);
    } else {
      conflictsResolved = true;
    }
    showNotification("Quotes synced with server!");

  });

  quotes = mergedQuotes;
  saveQuotes();
  populateCategories();

  if (conflictsResolved) {
    showConflictNotice();
  }
}

// ✅ Periodic sync every 30 seconds
setInterval(syncQuotes, 30000);

// ✅ UI notification
function showConflictNotice() {
  const notice = document.getElementById("conflictNotice");
  notice.style.display = "block";
  setTimeout(() => {
    notice.style.display = "none";
  }, 5000);
}

// ✅ Manual sync button
document.getElementById("manualSync").addEventListener("click", syncQuotes);

// Existing functions: showRandomQuote, addQuote, etc.
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory
    ? quotes.filter(q => q.category === selectedCategory)
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function restoreLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    try {
      const quote = JSON.parse(last);
      quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    } catch {}
  }
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  postQuoteToServer(newQuote); // ✅ simulate server post
  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added successfully!");
}
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerText = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
function syncQuotes() {
  // ... your existing sync logic ...
  showNotification("Quotes synced with server!");
  filterQuotesByCategory(); // refresh view with current filter
}

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Initialize
loadQuotes();
populateCategories();
restoreLastQuote();
syncQuotes(); // initial sync

