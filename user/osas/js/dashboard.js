// ---- OSAS Dashboard ----
import { protectPage } from "../../../js/auth-guard.js";

// Wait for DOM + Auth
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await protectPage("osas");
    await loadOsasDashboard();
  } catch (err) {
    console.error("Access denied or error:", err);
    document.body.innerHTML = "<h1>Access Denied</h1>";
  }
});

async function loadOsasDashboard() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="grid-container">

      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="total-submissions">...</p>
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
            <p class="number" id="approved-count">...</p>
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
            <p class="number" id="pending-count">...</p>
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
            <p class="number" id="returned-count">...</p>
            <p class="desc">Returned</p>
          </div>
          <div class="right-icon"> 
            <img src="../../../assets/images/close-icon.png" alt="Close icon" class="card-icon" /> 
          </div>
        </div>
      </div>

      <div class="grid-item medium">
        <div class="card chart">
          <h3>Activities by Term</h3>
          <div id="activities-by-term-chart"></div>
        </div>
      </div>

      <div class="grid-item medium">
        <div class="card chart">
          <h3>Top SDGs</h3>
          <div id="top-sdgs-chart"></div>
        </div>
      </div>

    </div>
  `;

  await fetchActivityData();
}

// fetch data from json file
async function fetchActivityData() {
  try {
    const response = await fetch("../../../data/activities.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const activities = await response.json();

    const totalSubmissions = activities.length;
    const approvedCount = activities.filter(
      (a) => a.status === "Approved"
    ).length;
    const pendingCount = activities.filter(
      (a) => a.status === "Pending"
    ).length;
    const reviseCount = activities.filter(
      (a) => a.status === "Returned"
    ).length;

    document.getElementById("total-submissions").textContent = totalSubmissions;
    document.getElementById("approved-count").textContent = approvedCount;
    document.getElementById("pending-count").textContent = pendingCount;
    document.getElementById("returned-count").textContent = reviseCount;

    // --- data for charts (for future use) ---
    const activitiesByTerm = activities.reduce((acc, activity) => {
      acc[activity.term] = (acc[activity.term] || 0) + 1;
      return acc;
    }, {});
    console.log("Activities by Term:", activitiesByTerm);

    const sdgCounts = activities
      .flatMap((a) => a.sdgs)
      .reduce((acc, sdg) => {
        acc[sdg] = (acc[sdg] || 0) + 1;
        return acc;
      }, {});
    console.log("SDG Counts:", sdgCounts);
  } catch (error) {
    console.error("Could not fetch or process activities data:", error);
    document.getElementById("total-submissions").textContent = "Error";
  }
}

// init is handled by the DOMContentLoaded listener above
