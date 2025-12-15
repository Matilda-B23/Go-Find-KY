const searchInput = document.getElementById("bird-search");
const searchButton = document.getElementById("search-button");
const showAllButton = document.getElementById("show-all-button");
let currentSearch = "";

async function runSearch() {
  const search = searchInput.value.trim();
  if (!/^[a-z\s'-]+$/i.test(search)) {
    alert("Invalid input: only a-z, spaces, - and '', are allowed.");
    return;
  }

  currentSearch = search;
  loadAllBirds(currentSearch);
}

searchButton.addEventListener("click", runSearch);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});

showAllButton.addEventListener("click", () => {
  currentSearch = "";
  loadAllBirds();
});

function updatePlaceholder() {
  if (window.innerWidth < 375) {
    searchInput.placeholder = "Search";
  } else {
    searchInput.placeholder = "Search for a bird...";
  }
}
window.addEventListener("load", updatePlaceholder)
window.addEventListener("resize", updatePlaceholder)