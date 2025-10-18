const quotes = [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

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
let quotes = [];

// Load quotes from localStorage or use default
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored quotes:", e);
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

// Populate category dropdown
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

// Show a random quote and store it in sessionStorage
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

// Restore last viewed quote from sessionStorage
function restoreLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    try {
      const quote = JSON.parse(last);
      quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    } catch (e) {
      console.warn("Failed to restore last quote:", e);
    }
  }
}

// Add a new quote
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
  saveQuotes();
  populateCategories();
  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added successfully!");
}

// Export quotes to JSON file
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (e) {
      alert("Failed to import quotes: " + e.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportBtn");

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportQuotes);

// Initialize
loadQuotes();
populateCategories();
restoreLastQuote();

document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
populateCategories();
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Simulate fetching quotes from server
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    // Convert server posts to quote format
    return data.slice(0, 10).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    return [];
  }
}
async function syncWithServer() {
  const serverQuotes = await fetchServerQuotes();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  let conflictsResolved = false;

  // Conflict resolution: server quotes take precedence
  const mergedQuotes = [...serverQuotes];

  // Add local quotes that aren't duplicates
  localQuotes.forEach(local => {
    if (!serverQuotes.some(server => server.text === local.text)) {
      mergedQuotes.push(local);
    } else {
      conflictsResolved = true;
    }
  });

  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;
  populateCategories();

  if (conflictsResolved) {
    notifyConflictResolution();
  }
}
setInterval(syncWithServer, 30000); // Sync every 30 seconds
function notifyConflictResolution() {
  const notice = document.getElementById("conflictNotice");
  notice.style.display = "block";
  setTimeout(() => {
    notice.style.display = "none";
  }, 5000);
}
