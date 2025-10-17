

// Select the container where the cards will appear
const folderBody = document.getElementById("activities-cards");

// Reusable function to create a card
function createCard(title, count, description, iconClass, color) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <h3>${title} <i class="${iconClass}" style="color: ${color};"></i></h3>
    <div class="count">${count}</div>
    <p>${description}</p>
  `;

  return card;
}

// Example cards data
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
];

// Create and append all cards
cards.forEach((c) =>
  folderBody.appendChild(
    createCard(c.title, c.count, c.description, c.iconClass, c.color)
  )
);
