export function setButtonText(btn, isLoading) {

    if (isLoading) {
      btn.dataset.originalText = btn.textContent; 
      btn.textContent = getLoadingText(btn.textContent);
    } else {
      btn.textContent = btn.dataset.originalText; 
    }
  }
  
  function getLoadingText(text) {
    if (text.toLowerCase().endsWith("e")) {
      return text.slice(0, -1) + "ing...";
    }
    return text + "ing...";
  }
  
