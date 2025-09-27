chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "translate") {
    const targetLang = message.target || "ar"; // default Arabic
    const text = encodeURIComponent(message.text);

    try {
      fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${text}`
      )
        .then(res => {
          if (!res.ok) throw new Error("HTTP error " + res.status);
          return res.json();
        })
        .then(data => {
          const translation = data?.[0]?.[0]?.[0] || "";
          sendResponse({ translation });
        })
        .catch(err => {
          console.error("Translation fetch error:", err);
          sendResponse({ error: "Translation failed: " + err.message });
        });
    } catch (err) {
      console.error("Unexpected error:", err);
      sendResponse({ error: "Unexpected error: " + err.message });
    }

    return true; // keep channel alive for async response
  }
});
