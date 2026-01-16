// npm install gray-matter fs path
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// config.json 읽기
const configPath = path.join(__dirname, "public", "config.json");
const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Markdown 파일들이 있는 폴더 경로
const postsDir = path.join(__dirname, "public", "posts");

// 모든 md 파일 읽기 (about.md 제외)
const files = fs
  .readdirSync(postsDir)
  .filter(file => file.endsWith(".md") && file !== "about.md" && file !== "policy.md")
  .sort((a, b) => {
    // 파일 이름에서 숫자만 추출해서 비교
    const numA = parseInt(a.replace(/\.md$/, ""), 10);
    const numB = parseInt(b.replace(/\.md$/, ""), 10);
    return numA - numB;
  });

const posts = files.map((file, index) => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const { data } = matter(content); // frontmatter 분리

  const post = {
    id: (index + 1).toString(),
    title: data.title || "제목 없음",
    category: data.category || "uncategorized",
    date: data.date || "",
    tags: data.tags || [],
    summary: data.summary || "",
  };

  // subcategory가 있으면 추가
  if (data.subcategory) {
    post.subcategory = data.subcategory;
  }

  return post;
});

// JSON으로 변환 (config.json에서 site, categories 불러오기)
const jsonOutput = {
  site: configData.site,
  categories: configData.categories,
  posts
};

// /public/config.json에 저장
fs.writeFileSync(configPath, JSON.stringify(jsonOutput, null, 2), "utf8");
console.log("config.json 업데이트 완료!");
