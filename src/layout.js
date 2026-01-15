document.querySelectorAll("[data-include]").forEach(async el => {
  const url = el.dataset.include;
  try {
    const res = await fetch(url);
    if (res.ok) {
      el.innerHTML = await res.text();
    } else {
      console.error(`Failed to load: ${url} (Status: ${res.status})`);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
});