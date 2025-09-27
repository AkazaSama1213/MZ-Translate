const select = document.getElementById("lang-select");
const selected = select.querySelector(".select-selected");
const items = select.querySelectorAll(".select-items div");

// Handle selection
items.forEach(item => {
  item.addEventListener("click", () => {
    selected.innerHTML = item.innerHTML; // update text + flag
    select.classList.remove("open");

    // Save to chrome storage
    chrome.storage.sync.set({ targetLang: item.dataset.value }, () => {
      console.log("Saved language:", item.dataset.value);
    });
  });
});

// Toggle open/close
selected.addEventListener("click", () => {
  select.classList.toggle("open");
});

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
  if (!select.contains(e.target)) {
    select.classList.remove("open");
  }
});

// Restore saved language on load
chrome.storage.sync.get("targetLang", (data) => {
  if (data.targetLang) {
    const savedItem = [...items].find(i => i.dataset.value === data.targetLang);
    if (savedItem) {
      selected.innerHTML = savedItem.innerHTML; // restore flag + text
    }
  }
});
