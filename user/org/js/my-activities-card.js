// Select the container where the cards will appear
const folderBody = document.getElementById("activities-cards");

// Reusable function to create a card
function createCard(title, count, description, iconClass, color) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.title = title; // add data attribute for easy updates

  card.innerHTML = `
    <h3>${title} <i class="${iconClass}" style="color: ${color};"></i></h3>
    <div class="count">${count}</div>
    <p>${description}</p>
  `;

  return card;
}

// Example cards data (permanent details)
const cards = [
  {
    title: "Approved",
    count: 3,
    description: "Activities successfully approved",
    iconClass: "fa-solid fa-check-circle",
    color: "#22c55e",
  },
  {
    title: "Pending",
    count: 2,
    description: "Activities awaiting review",
    iconClass: "fa-solid fa-hourglass-half",
    color: "#facc15",
  },
  {
    title: "Returned",
    count: 1,
    description: "Activities needing revision",
    iconClass: "fa-solid fa-rotate-left",
    color: "#ef4444",
  },
    {
    title: "Returned",
    count: 1,
    description: "Activities needing revision",
    iconClass: "fa-solid fa-rotate-left",
    color: "#ef4444",
  },
];

// Create and append all cards (only once)
cards.forEach((c) =>
  folderBody.appendChild(
    createCard(c.title, c.count, c.description, c.iconClass, c.color)
  )
);

// Function to update a specific card's count
function updateCardCount(title, newCount) {
  const card = folderBody.querySelector(`.card[data-title="${title}"]`);
  if (card) {
    card.querySelector(".count").textContent = newCount;
  }
}

// ---- DEMO: Simulate live updates every few seconds ---- //
setInterval(() => {
  const randomApproved = Math.floor(Math.random() * 10);
  const randomPending = Math.floor(Math.random() * 10);
  const randomReturned = Math.floor(Math.random() * 10);

  updateCardCount("Approved", randomApproved);
  updateCardCount("Pending", randomPending);
  updateCardCount("Returned", randomReturned);
}, 3000); // updates every 3 seconds
