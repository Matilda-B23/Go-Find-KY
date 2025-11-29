

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
  } catch (error) {
    console.error("Error loading spotlight:", error);
  }

  function createSpotlightCard(bird) {
    const card = document.createElement("div");
    card.classList.add("spotlight-card");

    const img = document.createElement("img");
    img.src = bird.images[0];
    img.onerror = () => (img.src = "/images/no-image-available.jpg");

    const name = document.createElement("p");
    name.classList.add("bird-name");
    name.textContent = bird.name;
    card.appendChild(img);
    card.appendChild(name);
    if (bird.fact) {
      const fact = document.createElement("p");
      fact.textContent = `Fun Fact: ${bird.fact}`;
      card.appendChild(fact);
    }
    return card;
  }
}

pickRandomBird();
