//Load birds marked as "seen" in user's localstorage, and renders them to the page.
async function loadSeenBirds() {
  const seenBirdContainer = document.getElementById("seen-bird-container");
  seenBirdContainer.innerHTML = "";
  try {
    const response = await fetch("/api/birds");
    const birds = await response.json();
    const seenBirds = birds.filter((bird) => {
      const saved = localStorage.getItem(`bird-${bird.name}`);
      if (!saved) return false;
      const savedData = JSON.parse(saved);
      return savedData.seen === true;
    });
    //Displaying seen versus total number of birds.
    document.getElementById("seen-count").textContent = seenBirds.length;
    document.getElementById("total-count").textContent = birds.length;

    if (seenBirds.length === 0) {
      const noBirds = document.createElement("p");
      noBirds.textContent =
        "No birds marked as seen; get out there and see some birds!";
      seenBirdContainer.appendChild(noBirds);
      return;
    }
    //Creating bird cards for each bird seen.
    seenBirds.forEach((bird) => {
      const card = createBirdCard(bird);
      seenBirdContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load seen birds:", error);
  }
}

loadSeenBirds();
