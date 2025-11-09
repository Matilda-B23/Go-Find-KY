let currentPage = 1;
const pageSize = 50;
let loading = false;
let moreBirds = true;

async function getBirds(page = 1) {
  if (loading || !moreBirds) return;
  loading = true;

  const response = await fetch(`/api/birds?page=${page}&pageSize=${pageSize}`);
  const birds = await response.json();
  const birdContainer = document.getElementById("bird-container");
  birds.forEach((bird) => {
    const card = document.createElement("div");
    card.classList.add("bird-card");
    const img = document.createElement("img");
    img.src = bird.images[0];
    img.onerror = () => (img.src = "/images/no-image-available.jpg");
    const name = document.createElement("p");
    name.textContent = bird.name;
    const status = document.createElement("p");
    status.textContent = "Conservation status:" + bird.status;
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(status);
    birdContainer.appendChild(card);
  });
  if (birds.length < pageSize) moreBirds = false;
  loading = false;
}
window.addEventListener("scroll", () => {
  if (
    !loading &&
    moreBirds &&
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
  ) {
    currentPage++;
    getBirds(currentPage);
  }
});

getBirds(currentPage);
