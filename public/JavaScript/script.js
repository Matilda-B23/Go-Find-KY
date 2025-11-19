//variables defined for pagination, and morebirds and loading to inform the page if there are more to load// 
let currentPage = 1;
const pageSize = 50;
let loading = false;
let moreBirds = true;


async function getBirds(page = 1) {
  if (loading || !moreBirds) return;
  loading = true;
  //taking data received from the backend file, and using pagination to lazy load elements.//
  const response = await fetch(`/api/birds?page=${page}&pageSize=${pageSize}`);
  const birds = await response.json();
  const birdContainer = document.getElementById("bird-container");
  
// taking data for each bird, and putting this data into elements to display on the page.//
  birds.forEach((bird) => {
    const card = document.createElement("div");
    card.classList.add("bird-card");
    const img = document.createElement("img");
    img.src = bird.images[0];
    img.onerror = () => (img.src = "/images/no-image-available.jpg");
    const name = document.createElement("p");
    name.textContent = bird.name;
    const status = document.createElement("p");
    status.textContent = "Conservation status - " + bird.status;
    const saved = localStorage.getItem(`bird-${bird.name}`); 
    const savedData = saved ? JSON.parse(saved) : null; //checks for saved data, if none displays nothing// 
    const checkbox = document.createElement("input"); 
    checkbox.type = "checkbox";
    checkbox.checked = savedData?.seen || false;
    const seenCheckbox = document.createElement("label"); 
    seenCheckbox.textContent = "Seen"; 
    seenCheckbox.prepend(checkbox);
    const commentArea = document.createElement("textarea"); 
    commentArea.value = savedData?.comment || "";
    //Below if there is a change to the data, it will save this change to local storage, to the specific bird it was changed under.//
    checkbox.addEventListener("change", () => {
      const birdData = {
        seen: checkbox.checked, 
        comment: commentArea.value 
      }; 
      localStorage.setItem(`bird-${bird.name}`, JSON.stringify(birdData)); 
    });
    commentArea.addEventListener("input", () => {
      const birdData = {
        seen: checkbox.checked, 
        comment: commentArea.value
      }; 
      localStorage.setItem(`bird-${bird.name}`, JSON.stringify(birdData));
    }); 
    //adding all created elements to the div on the html page//
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(status);
    card.appendChild(seenCheckbox); 
    card.appendChild(commentArea);
    birdContainer.appendChild(card);
  });
  if (birds.length < pageSize) moreBirds = false;
  loading = false; //if no more birds to be loaded, stop trying to load//
} //below infine scroll to display all on one page but not load them all at the same time; load more within certain distance of the bottom of the page//
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
//finally running the function//
getBirds(currentPage);
