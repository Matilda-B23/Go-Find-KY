
function createBirdCard(bird) {
  const card = document.createElement("div");
  card.classList.add("bird-card");
  const img = document.createElement("img");
  img.src = bird.images[0];
  img.onerror = () => (img.src = "/images/no-image-available.jpg");
  const name = document.createElement("p");
  name.classList.add("bird-name");
  name.textContent = bird.name;
  const status = document.createElement("p");
  status.textContent = "Conservation status - " + bird.status;
  const saved = localStorage.getItem(`bird-${bird.name}`);
  const savedData = saved ? JSON.parse(saved) : null;
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = savedData?.seen || false;
  const seenCheckbox = document.createElement("label");
  seenCheckbox.textContent = "Seen";
  seenCheckbox.prepend(checkbox);
  const commentArea = document.createElement("textarea");
  commentArea.value = savedData?.comment || "";

  checkbox.addEventListener("change", () => {
    const birdData = {
      seen: checkbox.checked,
      comment: commentArea.value,
    };
    localStorage.setItem(`bird-${bird.name}`, JSON.stringify(birdData));
  });
  commentArea.addEventListener("input", () => {
    const birdData = {
      seen: checkbox.checked,
      comment: commentArea.value,
    };
    localStorage.setItem(`bird-${bird.name}`, JSON.stringify(birdData));
  });
  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(status);
  card.appendChild(seenCheckbox);
  card.appendChild(commentArea);
  return card;
}

async function loadAllBirds(search = "") {
  const birdContainer = document.getElementById("bird-container");
  birdContainer.innerHTML = "";
  try {
    const response = await fetch(
  `/api/birds${search ? `?search=${encodeURIComponent(search)}` : ""}`
    ); 
    
    const birds = await response.json();

    birds.forEach((bird) => {
      const card = createBirdCard(bird);
      birdContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load birds:", error);
  }
}

loadAllBirds();

const homeButton = document.getElementById("return-home");
if (homeButton) {
  homeButton.addEventListener("click", () => {
    window.location.href = "/index.html";
  });
}