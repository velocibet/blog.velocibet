import header from "./layouts/header.html?raw";
import footer from "./layouts/footer.html?raw";

const includes = {
  "/layouts/header.html": header,
  "/layouts/footer.html": footer,
};

document.querySelectorAll("[data-include]").forEach(el => {
  const key = el.dataset.include;
  if (includes[key]) {
    el.innerHTML = includes[key];
  }
});
