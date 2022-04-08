const xhr = new XMLHttpRequest();
const url = "http://localhost:8000/articles";

// AJAX configurations and AJAX event handlers.
xhr.onload = function () {
  const res = JSON.parse(this.responseText);

}

xhr.onerror = function () {
  console.error("error: request to " + url + " failed.");
}

xhr.open("GET", url, true);

xhr.send();
