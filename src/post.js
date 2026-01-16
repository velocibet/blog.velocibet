import fm from "front-matter"
import { marked } from "marked";
import "./style.css";
import "./style/post.css";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const title = document.querySelector("#title");
const date = document.querySelector("#date");
const contentElement = document.querySelector(".content");
const tagsElement = document.querySelector(".tags");

function setMeta(name, content, isProperty = false) {
  const selector = isProperty
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;

  let tag = document.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    isProperty ? tag.setAttribute("property", name) : tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function extractFirstImage(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const img = temp.querySelector("img");
  return img ? img.getAttribute("src") : null;
}

function getCategoryName(categoryId, categories) {
  const foundCategory = categories.find(cate => cate.id === categoryId);
  return foundCategory ? foundCategory.name : categoryId;
}

async function setDocument() {
  try {
    const configRes = await fetch("/config.json");
    const config = await configRes.json();

    const res = await fetch(`/posts/${id}.md`);
    const data = await res.text();

    if (!data) return;

    const { attributes, body } = await fm(data);
    const content = await marked(body);

    const categoryName = getCategoryName(attributes.category, config.categories);
    title.innerHTML = `[${categoryName}] ${attributes.title}`;

    const dateObj = new Date(attributes.date);
    const formattedDate = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`; 
    date.innerHTML = formattedDate;

    contentElement.innerHTML = content;
    hljs.highlightAll();

    const tagHtml = attributes.tags.map(t => `#${t}`).join(" ");
    tagsElement.innerHTML = `<p>태그</p> <span>${tagHtml}</span>`;

    document.title = `${attributes.title}`;
    setMeta("description", attributes.summary);
    setMeta("og:title", attributes.title, true);

    const firstImage = extractFirstImage(content);
    setMeta(
      "og:image",
      firstImage
        ? firstImage.startsWith("http")
          ? firstImage
          : `https://blog.velocibet.com${firstImage}`
        : "https://blog.velocibet.com/images/header.jpg",
      true
    );
  } catch(err) {
    console.error("게시글 및 카테고리를 불러오던 도중 에러가 발생했습니다.", err)
  }
}

await setDocument();