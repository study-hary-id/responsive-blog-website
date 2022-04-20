const widgetRecentPosts = document.getElementById("widget-recent-posts");
const mainSection = document.getElementById("main")

/**
 * Request to specific url with http method and executes given callback.
 * @param method
 * @param url
 * @param callbackSuccess
 * @param callbackError
 */
function request(method, url, callbackSuccess, callbackError) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const res = JSON.parse(this.responseText);
    callbackSuccess(res);
  }

  xhr.onerror = function () {
    callbackError(url);
  }

  xhr.open(method, url, true);
  xhr.send();
}

/**
 * Returns simple date object includes the original Date object.
 * @param rawDate
 * @returns {{date: number, month: string, year: number, originalDate: Date}}
 */
function constructDate(rawDate) {
  const date = new Date(rawDate);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString(
    'default', {month: 'long'}
  );
  return {date: day, year, month, originalDate: date}
}

/*
Executes init function
 */
init()

/*
Widget sidebar
 */

function renderWidgetItem(article) {
  const widgetRecentPost = document.createElement("div");
  widgetRecentPost.classList.add("widget-recent-post");
  widgetRecentPost.innerHTML = `
    <h3 class="widget-recent-post-title">
      <a href="${article.links.self}">${article.attributes.title}</a>
    </h3>
    <img
      src="${article.links.cover}"
      alt=""
      class="widget-image"
    >
`;
  widgetRecentPosts.appendChild(widgetRecentPost);
}

function renderWidgetSidebar(data) {
  data.forEach((article) => renderWidgetItem(article));
}

/*
Main content: article recent
 */

function renderArticleFeatured(article) {
  const date = constructDate(article.attributes.date)
  const articleFeatured = document.createElement("article");
  articleFeatured.classList.add("article-featured");
  articleFeatured.setAttribute("id", "article-featured")
  articleFeatured.innerHTML = `
    <h2 class="article-title">${article.attributes.title}</h2>
    <img
      src="${article.links.cover}"
      alt=""
      class="article-image object-position-bottom"
    >
    <p class="article-info">${date.month} ${date.date}, ${date.year} | 3 comments</p>
    <p class="article-body">
<!--        <strong>Life can get complicated really quickly</strong>, but it doesn't have to be! There are many ways to-->
<!--        simplify your life, <a href="#article-featured">a few of which we've explored in the past</a>. This week we're-->
<!--        taking a bit of an approach though, in how you can find simplicity in the life you already living.-->
      ${article.attributes.body}
    </p>
    <a href="${article.links.self}" class="article-read-more">continue reading</a>
`;
  mainSection.appendChild(articleFeatured);
}

function renderArticleRecent(article) {
  const date = constructDate(article.attributes.date)
  const articleRecent = document.createElement("article");
  articleRecent.classList.add("article-recent");
  articleRecent.innerHTML = `
    <div class="article-recent-main">
      <h2 class="article-title">${article.attributes.title}</h2>
      <p class="article-body">${article.attributes.body}</p>
      <a href="${article.links.self}" class="article-read-more">
        continue reading
      </a>
    </div>
    <div class="article-recent-secondary">
      <img
        src="${article.links.cover}"
        alt=""
        class="article-image"
      >
      <p class="article-info">${date.month} ${date.date}, ${date.year} | 3 comments</p>
    </div>
`;
  mainSection.appendChild(articleRecent);
}

function renderMainContent(data, callback) {
  data.forEach((article) => callback(article))
}

/**
 * Request and render articles data to main section.
 */
function initMainContent() {
  // Request for home page, async processes.
  if (/\bindex\b/.test(location.pathname)) {
    request(
      "GET",
      "http://localhost:8000/articles/?featured=true&sort=desc&limit=1",
      (res) => renderMainContent(res.data, renderArticleFeatured),
      (url) => console.error("error: request to " + url + " failed.")
    );
    request(
      "GET",
      "http://localhost:8000/articles/?featured=false&sort=desc&limit=3",
      (res) => renderMainContent(res.data, renderArticleRecent),
      (url) => console.error("error: request to " + url + " failed.")
    );
  }
  // Request for recent posts page
  if (/\brecent-posts\b/.test(location.pathname)) {
    request(
      "GET",
      "http://localhost:8000/articles/?sort=desc",
      (res) => renderMainContent(res.data, renderArticleRecent),
      (url) => console.error("error: request to " + url + " failed.")
    );
  }
}

/**
 * Executes necessary function and codes to show the whole contents of the page.
 */
function init() {
  // Request for widget on sidebar.
  request(
    "GET",
    "http://localhost:8000/articles/?featured=false&sort=desc&limit=3",
    (res) => renderWidgetSidebar(res.data),
    (url) => console.error("error: request to " + url + " failed.")
  );
  initMainContent()
}
