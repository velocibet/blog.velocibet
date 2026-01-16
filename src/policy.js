import fm from "front-matter"
import { marked } from "marked";

import "./style.css";

const mainContainer = document.querySelector(".main-container");

async function loadAbout() {
  try {
    const res = await fetch("/posts/policy.md");
    const data = await res.text();

    if (!data) return;

    const { attributes, body } = await fm(data);
    const content = await marked(body);

    const title = document.createElement("h1");
    title.textContent = attributes.title || "개인정보처리방침";

    const contentDiv = document.createElement("div");
    contentDiv.className = "about-content";
    contentDiv.innerHTML = content;

    mainContainer.appendChild(title);
    mainContainer.appendChild(contentDiv);
  } catch(err) {
    console.error("About 페이지를 불러오던 도중 에러가 발생했습니다.", err)
  }
}

await loadAbout();
