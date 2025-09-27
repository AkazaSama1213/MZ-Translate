document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    // get the saved target language from storage
    chrome.storage.sync.get("targetLang", (data) => {
      const targetLang = data.targetLang || "ar"; // default Arabic

      chrome.runtime.sendMessage(
        { type: "translate", text: selectedText, target: targetLang },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Runtime error:", chrome.runtime.lastError.message);
            return;
          }
          if (!response) {
            console.error("No response from background script");
            return;
          }
          if (response.translation) {
            showTooltip(response.translation);
          } else if (response.error) {
            console.error("Translation error:", response.error);
          }
        }
      );
    });
  }
});

function showTooltip(text) {
  let tooltip = document.createElement("div");
  tooltip.className = "translation-tooltip";
  tooltip.textContent = text;
  document.body.appendChild(tooltip);

  // Position tooltip under the selected text
  let selection = window.getSelection().getRangeAt(0).getBoundingClientRect();
  tooltip.style.left = selection.left + window.scrollX + "px";
  tooltip.style.top = selection.bottom + window.scrollY + "px";

  // Auto-hide after 4 seconds
  setTimeout(() => tooltip.remove(), 4000);
}
