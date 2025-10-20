// Select the container where the cards will appear
const folderBody = document.getElementById("submission-cards");

// Reusable function to create an activity card
function createActivityCard(title, status, description, date) {
  const card = document.createElement("div");
  card.classList.add("card");

  // Determine badge color
  let statusColor = "";
  switch (status) {
    case "Needs Attention":
      statusColor = "#ef4444";
      break;
    case "Approved":
      statusColor = "#22c55e";
      break;
    case "Pending":
      statusColor = "#facc15";
      break;
    default:
      statusColor = "#6b7280";
  }

  card.innerHTML = `
    <div class="card-header">
      <h3>${title}</h3>
      <span class="status-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
        ${status}
      </span>
    </div>
    <p class="card-description">${description}</p>
    <p class="card-date">Submitted: ${date}</p>
  `;

  return card;
}

// Example data
const activities = [
  {
    title: "Annual Tech Symposium",
    status: "Needs Attention",
    description:
      "A week-long event focused on emerging technologies, featuring guest speakers,...",
    date: "Oct 10, 2025",
  },
  {
    title: "Innovation Hackathon",
    status: "Approved",
    description:
      "A 48-hour coding marathon promoting creative solutions to local problems,...",
    date: "Oct 12, 2025",
  },
  {
    title: "Student Research Expo",
    status: "Pending",
    description:
      "An exhibition showcasing student-led research and tech prototypes,...",
    date: "Oct 15, 2025",
  },
  {
    title: "Student Research Expo",
    status: "Pending",
    description:
      "An exhibition showcasing student-led research and tech prototypes,...",
    date: "Oct 15, 2025",
  },
    {
    title: "Student Research Expo",
    status: "Pending",
    description:
      "An exhibition showcasing student-led research and tech prototypes,...",
    date: "Oct 15, 2025",
  },
    {
    title: "Student Research Expo",
    status: "Pending",
    description:
      "An exhibition showcasing student-led research and tech prototypes,...",
    date: "Oct 15, 2025",
  },  {
    title: "Student Research Expo",
    status: "Pending",
    description:
      "An exhibition showcasing student-led research and tech prototypes,...",
    date: "Oct 15, 2025",
  },  {
    title: "Student Research Expo",
    status: "Pending",
    description:
      "An exhibition showcasing student-led research and tech prototypes,...",
    date: "Oct 15, 2025",
  },  {
    title: "Student Research Expo",
    status: "Pending",
    description:
      "An exhibition showcasing student-led research and tech prototypes,...",
    date: "Oct 15, 2025",
  },  {
    title: "Student Research Expo",
    status: "Pending",
    description:
      "An exhibition showcasing student-led research and tech prototypes,...",
    date: "Oct 15, 2025",
  },  {
    title: "Student Research Expo",
    status: "Pending",
    description:
      "An exhibition showcasing student-led research and tech prototypes,...",
    date: "Oct 15, 2025",
  },  {
    title: "Student Research Expo",
    status: "Pending",
    description:
      "An exhibition showcasing student-led research and tech prototypes,...",
    date: "Oct 15, 2025",
  },
];

// Create and append all cards
activities.forEach((a) =>
  folderBody.appendChild(
    createActivityCard(a.title, a.status, a.description, a.date)
  )
);




