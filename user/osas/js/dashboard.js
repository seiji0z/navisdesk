// ---- OSAS Dashboard ----
function loadOsasDashboard() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="grid-container">

      <!-- Summary Cards - First Row -->
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="first">60</p>
            <p class="desc">Total Submissions</p>
          </div>
          <div class="right-icon"> 
            <img src="../../../assets/images/blue-submissions-icon.png" alt="Submissions icon" class="card-icon" /> 
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
            <img src="../../../assets/images/check-icon.png" alt="Check icon" class="card-icon" /> 
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
            <img src="../../../assets/images/clock-icon.png" alt="Clock icon" class="card-icon" /> 
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
            <img src="../../../assets/images/close-icon.png" alt="Close icon" class="card-icon" /> 
          </div>
        </div>
      </div>

      <!-- Medium Cards - Second Row -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Activities by Term</h3>
          <div class="chart-placeholder">
            Chart: Activities by Term
          </div>
        </div>
      </div>

      <div class="grid-item medium">
        <div class="card chart">
          <h3>Top SDGs</h3>
          <div class="chart-placeholder">
            Chart: Top SDGs
          </div>
        </div>
      </div>

    </div>
  `;
}

// ---- INITIALIZER ----
function initDashboard() {
  loadOsasDashboard();
  setCurrentDate();
}

// Set current date in header
function setCurrentDate() {
  const dateElement = document.querySelector(".current-date");
  if (dateElement) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const currentDate = new Date().toLocaleDateString("en-US", options);
    dateElement.textContent = currentDate;
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initDashboard();
});
