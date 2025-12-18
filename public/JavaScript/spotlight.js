//Fetch a random bird and corresponding fun fact, then display it in a spotlight card.
async function pickRandomBird() {
  try {
    const res = await fetch("/JavaScript/funfacts.json");
    const funFacts = await res.json();

    const randomIndex = Math.floor(Math.random() * funFacts.length);
    const selectedFact = funFacts[randomIndex];

    const apiCall = await fetch(
      `/api/birds?search=${encodeURIComponent(selectedFact.name)}`
    );
    const birds = await apiCall.json();
    const apiBird = birds[0];

    const selectedBird = {
      ...apiBird,
      fact: selectedFact.fact,
    };
    const spotlightContainer = document.getElementById("spotlight-container");
    spotlightContainer.appendChild(createSpotlightCard(selectedBird));
    //Log errors if fetching data or facts fails.
  } catch (error) {
    console.error("Error loading spotlight:", error);
  }
  //Create a card element with bird image, name and fun fact for display.
  function createSpotlightCard(bird) {
    const card = document.createElement("div");
    card.classList.add("spotlight-card");
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("img-wrapper");
    const img = document.createElement("img");
    img.src = bird.images[0];
    img.onerror = () => (img.src = "/images/no-image-available.jpg");
    const spotlightHeader = document.createElement("h3");
    spotlightHeader.textContent = "Species Spotlight: " + bird.name;
    imgWrapper.appendChild(img);
    card.appendChild(imgWrapper);
    card.appendChild(spotlightHeader);
    if (bird.fact) {
      const fact = document.createElement("p");
      fact.textContent = `${bird.fact}`;
      card.appendChild(fact);
    }
    return card;
  }
}

pickRandomBird();
