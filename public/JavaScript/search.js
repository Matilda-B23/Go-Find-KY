const searchInput = document.getElementById("bird-search");
const searchButton = document.getElementById("search-button");
const showAllButton = document.getElementById("show-all-button");
async function runSearch() {
const search = searchInput.value.trim();
if (!/^[a-z\s'-]+$/i.test(search)) {
alert("Invalid input: only a-z, spaces, - and '', are allowed.");
return;
}
currentSearch = search;
currentPage = 1;
moreBirds = true;
const birdContainer = document.getElementById("bird-container");
birdContainer.innerHTML = "";
getBirds(currentPage, currentSearch);
}
searchButton.addEventListener("click", runSearch);
searchInput.addEventListener("keydown", (e) => {
if (e.key === "Enter") {
runSearch();
}
});
showAllButton.addEventListener("click", () => {
currentSearch = "";
currentPage = 1;
moreBirds = true;
const birdContainer = document.getElementById("bird-container");
birdContainer.innerHTML = "";
getBirds(currentPage, currentSearch);
});

