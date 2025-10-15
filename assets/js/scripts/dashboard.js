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

      <!-- Summary Cards -->
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="first">60</p>
            <p class="desc">Total Submissions</p>
          </div>
          <div class="right-icon"> 
            <img src="../../assets/images/blue-submissions-icon.png" alt="Submissions icon" class="card-icon" /> 
          </div>
        </div>
      </div>

      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="second">3</p>
            <p class="desc">Approved</p>
          </div>
          <div class="right-icon"> 
            <img src="../../assets/images/check-icon.png" alt="Submissions icon" class="card-icon" /> 
          </div>
        </div>
      </div>

      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="third">7</p>
            <p class="desc">Pending Review</p>
          </div>
          <div class="right-icon"> 
            <img src="../../assets/images/clock-icon.png" alt="Submissions icon" class="card-icon" /> 
          </div>
        </div>
      </div>

      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="fourth">0</p>
            <p class="desc">Returned</p>
          </div>
          <div class="right-icon"> 
            <img src="../../assets/images/close-icon.png" alt="Submissions icon" class="card-icon" /> 
          </div>
        </div>
      </div>

      <!-- Activities by Term -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Activities by Term</h3>
          <img src="../../assets/images/placeholder-graph.png" alt="SDG graph" />
        </div>
      </div>

      <!-- Top 5 SDGs -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Top SDGs</h3>
          <img src="../../assets/images/placeholder-graph-2.png" alt="SDG graph" />
        </div>
      </div>

    </div>
  `;
}

initDashboard();
