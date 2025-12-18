//File for controlling search bar feature, including input validation, and API filtering.
const searchInput = document.getElementById("bird-search");
const searchButton = document.getElementById("search-button");
const showAllButton = document.getElementById("show-all-button");
let currentSearch = "";
//Validate user input and trigger bird search.
async function runSearch() {
  const search = searchInput.value.trim();
  if (!/^[a-z\s'-]+$/i.test(search)) {
    alert(
      "Invalid input: only a-z, spaces, - and '', allowed and search cannot be empty."
    );
    return;
  }

  currentSearch = search;
  loadAllBirds(currentSearch);
}
//Enter key or clicking search button will perform search.
searchButton.addEventListener("click", runSearch);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});
//Reset search input and reload all birds.
showAllButton.addEventListener("click", () => {
  currentSearch = "";
  searchInput.value = "";
  loadAllBirds();
});
//Adjust search bar placeholder text for small screens.
function updatePlaceholder() {
  if (window.innerWidth < 375) {
    searchInput.placeholder = "Search";
  } else {
    searchInput.placeholder = "Search for a bird...";
  }
}
window.addEventListener("load", updatePlaceholder);
window.addEventListener("resize", updatePlaceholder);
