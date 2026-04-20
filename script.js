const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#searchInput");
const topicButtons = document.querySelectorAll(".topic-list button");
const posts = Array.from(document.querySelectorAll(".post-card"));
const emptyState = document.querySelector("#emptyState");
const newsletterForm = document.querySelector(".newsletter-form");

let activeFilter = "all";

function normalize(value) {
  return value.trim().toLowerCase();
}

function updatePosts() {
  const query = normalize(searchInput.value);
  let visibleCount = 0;

  posts.forEach((post) => {
    const haystack = normalize(`${post.dataset.title} ${post.dataset.tags}`);
    const matchesQuery = !query || haystack.includes(query);
    const matchesFilter =
      activeFilter === "all" || post.dataset.tags.includes(activeFilter);
    const isVisible = matchesQuery && matchesFilter;

    post.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.classList.toggle("is-visible", visibleCount === 0);
}

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updatePosts();
});

searchInput.addEventListener("input", updatePosts);

topicButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    topicButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    updatePosts();
  });
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = newsletterForm.querySelector("input");
  input.value = "";
  input.placeholder = "已收到，感谢订阅";
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
}

topicButtons[0]?.classList.add("is-active");
