// Folder functions
function setFolderTitle(title) {
  document.querySelector(".folder-title").textContent = title;
}

function setCurrentDate() {
  const dateElement = document.querySelector(".current-date");
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Initialize dashboard
function initDashboard() {
  setFolderTitle("Dashboard");
  setCurrentDate();

  // inject dashboard-only grid inside folder-body
  document.querySelector("#folder-body").innerHTML = `
    <div class="grid-container">
      <div class="grid-item small">1</div>
      <div class="grid-item small">2</div>
      <div class="grid-item small">3</div>
      <div class="grid-item small">4</div>
      <div class="grid-item large">large</div>
      <div class="grid-item medium">medium</div>
      <div class="grid-item medium">medium</div>
    </div>
  `;
}

// Run the initialization
initDashboard();
