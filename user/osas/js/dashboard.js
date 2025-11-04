// ---- OSAS Dashboard ----
// Helper: pick a friendly display name from user object
function getDisplayName(user) {
  if (!user) return "User";
  const nameCandidates = [
    user.first_name,
    user.firstName,
    user.given_name,
    user.name,
    user.displayName,
    user.full_name,
  ];
  for (const n of nameCandidates) {
    if (n && typeof n === "string" && n.trim()) {
      return n.trim();
    }
  }
  if (user.email) {
    const local = user.email.split("@")[0];
    const parts = local.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    if (parts.length) return parts[0];
  }
  return user.role || "User";
}

// Wait for DOM + Auth
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const user = await protectPage("osas");
    // Set the welcome name
    if (user) {
      const nameSpan = document.querySelector(".welcome span");
      if (nameSpan) {
        nameSpan.textContent = getDisplayName(user);
      }
    }
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
