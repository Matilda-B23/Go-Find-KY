//Frontend logic for displaying birds, handling user sightings, comments, and navigation.
//Creates a bird card element with image, name, status, seen checkbox, and comment functionality.
//Adjusts behavior based on page context. (log vs journal page)
function createBirdCard(bird) {
  const isLogPage = window.location.pathname.includes("log-page.html");
  const isJournalPage = window.location.pathname.includes(
    "my-journal-page.html"
  );
  const card = document.createElement("div");
  card.classList.add("bird-card");
  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("img-wrapper");
  const img = document.createElement("img");
  img.src = bird.images[0];
  img.onerror = () => (img.src = "/images/no-image-available.jpg");
  const name = document.createElement("p");
  name.classList.add("bird-name");
  name.textContent = bird.name;
  const statusLine = document.createElement("p");
  statusLine.textContent = "Conservation status - ";
  const statusInfo = document.createElement("p");
  statusInfo.textContent = bird.status;
  const saved = localStorage.getItem(`bird-${bird.name}`);
  const savedData = saved ? JSON.parse(saved) : null;
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = savedData?.seen || false;
  const seenCheckbox = document.createElement("label");
  seenCheckbox.textContent = " Seen";
  seenCheckbox.prepend(checkbox);
  let commentContent;
  let editButton;
  if (isJournalPage) {
    commentContent = document.createElement("p");
    commentContent.classList.add("journal-comment");
    commentContent.textContent = savedData?.comment || "No comment yet.";
    editButton = document.createElement("button");
    editButton.textContent = "Edit Comment";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => {
      const saved = localStorage.getItem(`bird-${bird.name}`);
      const savedData = saved
        ? JSON.parse(saved)
        : { comment: "", seen: false };
      openCommentPopup(
        bird,
        savedData?.seen || false,
        savedData?.comment || ""
      );
    });
  }
  const saveButton = document.createElement("button");
  saveButton.textContent = "Log Sighting";
  saveButton.classList.add("save-button");
  if (savedData && window.location.pathname.includes("my-journal-page.html")) {
    saveButton.style.display = "none";
  }
  //Save comment and seen status to local storage and update UI.
  saveButton.addEventListener("click", () => {
    openCommentPopup(bird, checkbox.checked, savedData?.comment || "");
  });
  checkbox.addEventListener("change", () => {
    const saved = localStorage.getItem(`bird-${bird.name}`);
    const savedData = saved ? JSON.parse(saved) : { comment: "" };
    const birdData = {
      seen: checkbox.checked,
      comment: savedData.comment || "",
    };
    //Saving seen data to correspond with the bird's name.
    localStorage.setItem(`bird-${bird.name}`, JSON.stringify(birdData));
  });
  imgWrapper.appendChild(img);
  card.appendChild(imgWrapper);
  card.appendChild(name);
  card.appendChild(statusLine);
  card.appendChild(statusInfo);
  card.appendChild(seenCheckbox);
  card.appendChild(saveButton);
  if (isJournalPage) {
    card.appendChild(commentContent);
    card.appendChild(editButton);
  }
  return card;
}
//Loads all birds from the API and appends them to the DOM.
//Accepts optional search term for filtering.
async function loadAllBirds(search = "") {
  const birdContainer = document.getElementById("bird-container");
  if (!birdContainer) return;
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
//Base button functionality for all pages.
const homeButton = document.getElementById("return-home");
if (homeButton) {
  homeButton.addEventListener("click", () => {
    window.location.href = "/index.html";
  });
}
const journalButton = document.getElementById("journal-page");
if (journalButton) {
  journalButton.addEventListener("click", () => {
    window.location.href = "/my-journal-page.html";
  });
}
const logButton = document.getElementById("log-page");
if (logButton) {
  logButton.addEventListener("click", () => {
    window.location.href = "/log-page.html";
  });
}
//Function controlling comment box display.
function openCommentPopup(bird, seenValue, existingComment) {
  const popup = document.getElementById("comment-popup");
  const text = document.getElementById("popup-text");
  const commentInput = document.getElementById("popup-comment");
  popup.dataset.birdName = bird.name;
  popup.dataset.seen = seenValue;
  text.textContent = "Add a comment?";
  commentInput.style.display = "block";
  commentInput.value = existingComment || "";
  popup.style.display = "block";
}
//Only show certain buttons/ comment fields only on certain pages.
if (!window.location.pathname.includes("index.html")) {
  const popupSaveButton = document.getElementById("popup-save");
  if (popupSaveButton) {
    popupSaveButton.addEventListener("click", () => {
      const popup = document.getElementById("comment-popup");
      const birdName = popup.dataset.birdName;
      const seen = popup.dataset.seen === "true";
      const comment = document.getElementById("popup-comment").value;
      const popupSaveButton = document.getElementById("popup-save");
      const birdData = {
        seen: seen,
        comment: comment,
      };
      localStorage.setItem(`bird-${birdName}`, JSON.stringify(birdData));
      const text = document.getElementById("popup-text");
      const commentBox = document.getElementById("popup-comment");
      text.textContent = "Sighting saved!";
      commentBox.style.display = "none";
      popupSaveButton.style.display = "none";
      setTimeout(() => {
        popup.style.display = "none";
      }, 2000);
      if (window.location.pathname.includes("my-journal-page.html")) {
        window.location.reload();
      }
    });
  }
}
