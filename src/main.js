const params = new URLSearchParams(window.location.search);
const category = params.get("category");

const containerTitle = document.querySelector('#container-title');
const description = document.querySelector("#description");
const postList = document.querySelector('#post-list');
const categoryList = document.querySelector("#category-list");

const postsPerPage = 5;
let currentPage = 1;
let filteredPosts = [];

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

function getCategoryName(categoryId, categories) {
  const foundCategory = categories.find(cate => cate.id === categoryId);
  return foundCategory ? foundCategory.name : categoryId;
}

function getCategoryInfo(categoryId, categories) {
  // 메인 카테고리에서 찾기
  for (let cate of categories) {
    if (cate.id === categoryId) {
      return { name: cate.name, description: cate.description };
    }
    // 서브카테고리에서 찾기
    if (cate.subcategories) {
      for (let sub of cate.subcategories) {
        if (sub.id === categoryId) {
          return { name: sub.name, description: sub.description };
        }
      }
    }
  }
  return null;
}

function displayPage(pageNum, categories) {
  currentPage = pageNum;
  postList.innerHTML = '';

  const startIdx = (pageNum - 1) * postsPerPage;
  const endIdx = startIdx + postsPerPage;
  const postsToDisplay = filteredPosts.slice(startIdx, endIdx);

  postsToDisplay.forEach(post => {
    const item = document.createElement("div");
    item.classList.add("post");
    const categoryName = getCategoryName(post.category, categories);
    const formattedDate = formatDate(post.date);
    const tagsHTML = post.tags.map(tag => `#${tag}`).join(' ');
    
    item.innerHTML = `
      <span class="title">[${categoryName}] ${post.title}</span>
      <span class=summary>${post.summary}</span>
      <div>
        <span class="date">${formattedDate}</span>
        <span class="tags">${tagsHTML}</span>
      </div>
      `

    item.addEventListener("click", () => {
      window.location.href = `/post.html?id=${post.id}`;
    })

    postList.appendChild(item);
  });
}

async function setDocument() {
  try {
    const res = await fetch("/config.json");
    const data = await res.json();

    if (!data) return;

    // 카테고리/서브카테고리 파라미터가 있으면 먼저 설정
    if (category) {
      const categoryInfo = getCategoryInfo(category, data.categories);
      if (categoryInfo) {
        containerTitle.innerHTML = categoryInfo.name;
        description.innerHTML = categoryInfo.description;
      }
    }

    // 포스트 불러오기
    data.posts.forEach(post => {
      if (category) {
        // category 파라미터와 post의 category 또는 subcategory가 일치하는지 확인
        if (post.category !== category && post.subcategory !== category) return;
      }

      const item = document.createElement("div");
      item.classList.add("post");
      const categoryName = getCategoryName(post.category, data.categories);
      const formattedDate = formatDate(post.date);
      const tagsHTML = post.tags.map(tag => `#${tag}`).join(' ');
      
      item.innerHTML = `
        <span class="title">[${categoryName}] ${post.title}</span>
        <span class=summary>${post.summary}</span>
        <div>
          <span class="date">${formattedDate}</span>
          <span class="tags">${tagsHTML}</span>
        </div>
        `

      item.addEventListener("click", () => {
        window.location.href = `/post.html?id=${post.id}`;
      })

      postList.appendChild(item);
    })

    // 카테고리 불러오기
    data.categories.forEach(cate => {
      const drop = document.createElement("li");
      drop.innerHTML = `
         <a href="?category=${cate.id}">${cate.name}</a>
      `;
      
      // subcategories가 있으면 추가
      if (cate.subcategories && cate.subcategories.length > 0) {
        const sublist = document.createElement("ul");
        cate.subcategories.forEach(sub => {
          const subItem = document.createElement("li");
          subItem.innerHTML = `
            <a href="?category=${sub.id}">${sub.name}</a>
          `;
          sublist.appendChild(subItem);
        });
        drop.appendChild(sublist);
      }
      
      categoryList.appendChild(drop);
    });
  } catch(err) {
    console.error("게시글 및 카테고리를 불러오던 도중 에러가 발생했습니다.", err)
  }
}

await setDocument();