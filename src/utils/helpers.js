export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (!btn) return; // Prevents errors if btn is null or undefined

  if (isLoading) {
    btn.textContent = loadingText;
    btn.disabled = true; // Disable button while loading
  } else {
    btn.textContent = defaultText;
    btn.disabled = false; // Re-enable button when not loading
  }
}
