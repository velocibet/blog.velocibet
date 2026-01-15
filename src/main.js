import "./style.css";
import "./layout";

const path = location.pathname;

if (path.endsWith("about.html")) {
  import("./about.js");
}

if (path.endsWith("post.html")) {
  import("./post.js");
  import ("./style/post.css");
}

if (path === "/" || path.endsWith("index.html")) {
  import("./index.js");
  import ("./style/index.css");
}
