/*
--------------------------------------------------
An assignment is to implement basic pagination with search/filter functionality.

API: https://jsonplaceholder.typicode.com/posts

Requirements:

On initial load, app should fetch the posts from the provided API. User should be presented with 6 posts per load/page. Below the posts, there should be a "Load More" button which would load the next chunk of (6) posts. Whenever the "Load More" button is pressed, the URL should be updated with the query parameter "page" to denote the current state of the loaded posts. Only posts that belong to the current page should be loaded in the DOM.

Example:
https://example.com/?page=3 - this means that the user is on page 3 and 18 posts should be shown.

Make sure that, if a user lands directly to the URL (opens it manually in the browser) with the parameter "page" and/or "search", that he's taken to the corresponding page.

Effectively, https://example.com/ and https://example.com/?page=1 should be treated the same.

Use cases for different URL scenarios:

https://example.com/?page=-5 - clear the "page" query parameter since it's less than 1.
https://example.com/?page=word - clear the "page" query parameter since it's invalid.
https://example.com/?page= - clear the "page" query parameter since it's invalid.
https://example.com/?page=30 - if we assume there are only 10 pages, update the query parameter with the biggest page number possible. In this case, parameter page would be updated from 30 to 10.

If there are no more posts to load, hide the "Load More" button.

Above the posts, there should be an input field which would be used to search/filter through loaded posts. Filtering should be done as the user types. Words should be case insensitive. Search term should also be tracked with a query parameter, in this case "search".

Example:
https://example.com/?page=3&search=code - show only posts (from the first 18 posts) that contain the word "code" in the title and/or body.

--------------------------------------------------
*/

// Write Javascript code!
$(document).ready(function () {
  $("#search").hide();
});

const postTemplate = document.querySelector("[data-post-template]");
const postContainer = document.querySelector("[data-post-container]");
const searchInput = document.querySelector("[data-search]");

let loadedPosts = [];

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  loadedPosts.forEach(post => {
    const isVisible = post.title.toLowerCase().includes(value) || post.body.toLowerCase().includes(value)
    if(!isVisible) {
      post.element.style.display = "none";
    }
    else {
      post.element.removeAttribute("style");
    }
    
  })

})

const api_URL = "https://jsonplaceholder.typicode.com/posts";
async function getData() {
  const response = await fetch(api_URL);
  const data = await response.json();
  
  return data;
}

var currentIndex = 0;
var pageIndex = 1;
async function loadMore() {
  $("#search").show();
  $("#loadMore_btn").html("Load more!");

  const posts = await getData();
  var maxResult = 6;

  for (var i = 0; i < maxResult; i++) {
    
    const post = postTemplate.content.cloneNode(true).children[0];
    const title = post.querySelector("[data-title]");
    const body = post.querySelector("[data-body]");
    const info = post.querySelector("[data-info]");
    title.textContent = posts[i + currentIndex].title;''
    body.textContent = posts[i + currentIndex].body;
    info.textContent = `Post no. ` + posts[i + currentIndex].id + ` Posted by: User ` + posts[i + currentIndex].userId;
    var obj = {};
    obj["title"] = posts[i + currentIndex].title;
    obj["body"] = posts[i + currentIndex].body;
    obj["element"] = post;
    loadedPosts.push(obj);
    postContainer.append(post);

  }
 
  var queryParams = new URLSearchParams(window.location.search);
  queryParams.set("page", `${pageIndex}`);
  history.replaceState(null, null, "?" + queryParams.toString());
  pageIndex++;

  currentIndex += maxResult;
}

