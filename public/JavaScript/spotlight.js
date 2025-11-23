async function loadSpotlight(){
    try {
        const response = await fetch('/api/birds?page=1&pageSize=100');
        const birds = await response.json();

        const randomBird = birds[Math.floor(Math.random() * birds.length)];
        const funFacts = 
    }
}

// unfinished