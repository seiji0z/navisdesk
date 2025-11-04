import { showActivityReview } from "./activity-review.js";

let allActivitiesData = null;
let currentOrgMap = null;

export async function loadActivities() {
  const folderBody = document.querySelector("#folder-body");

  folderBody.innerHTML = `
    <div class="folder-content-card">
      <div class="activities-container">
        <div class="filter-search">
          <h2>Filter & Search</h2>
          <div class="filters-row">
            <div class="search-box">
              <label>Search Activities</label>
              <div class="input-icon">
                <input type="text" id="activity-search" placeholder="Search activities by keyword" />
                <button class="search-btn" id="search-button">
                  <img src="../../../assets/images/review-icon.png" alt="Search" />
                </button>
              </div>
            </div>
            <div class="select-group">
              <label>Status</label>
              <select id="status-filter">
                <option value="">All Status</option>
              </select>
            </div>
            <div class="select-group">
              <label>Organization</label>
              <select id="organization-filter">
                <option value="">All Organization</option>
              </select>
            </div>
            <div class="select-group">
              <label>Department</label>
              <select id="department-filter">
                <option value="">All Department</option>
              </select>
            </div>
            <div class="select-group">
              <label>SDGs</label>
              <select id="sdgs-filter">
                <option value="">All SDGs</option>
              </select>
            </div>
          </div>
        </div>

        <div class="activities-table">
          <table>
            <thead>
              <tr>
                <th>Activity Name</th>
                <th>Organization</th>
                <th>Department</th>
                <th>SDGs</th>
                <th>Term</th>
                <th>Status</th>
                <th>Submission Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="activities-table-body"></tbody>
          </table>
        </div>

        <div class="activities-cards" id="activities-cards-container"></div>
      </div>
    </div>
  `;

  try {
    const [activities, orgs] = await Promise.all([
      fetchActivitiesFromDB(),
      fetchOrganizationsFromDB()
    ]);

    if (!activities || !orgs) {
      folderBody.innerHTML = "<p>Error loading activities or organizations.</p>";
      return;
    }

    allActivitiesData = activities;

    // Build org map from student_orgs collection
    currentOrgMap = orgs.reduce((map, org) => {
      map[org._id] = {
        name: org.name || "Unknown Organization",
        dept: org.department || "Unknown Department"
      };
      return map;
    }, {});

    populateFilters(allActivitiesData, currentOrgMap);
    renderActivitiesTable(allActivitiesData, currentOrgMap);
    addFilterEventListeners();
    addReviewButtonListener();
  } catch (err) {
    console.error("Error loading data:", err);
    folderBody.innerHTML = "<p>Failed to load data from database.</p>";
  }
}

async function fetchActivitiesFromDB() {
  try {
    const res = await fetch("../../../server/php/get-activities.php");
    if (!res.ok) throw new Error("Failed to fetch activities");
    return await res.json();
  } catch (err) {
    console.error("fetchActivitiesFromDB error:", err);
    return null;
  }
}

async function fetchOrganizationsFromDB() {
  try {
    const res = await fetch("../../../server/php/get-student-orgs.php");
    if (!res.ok) throw new Error("Failed to fetch orgs");
    return await res.json();
  } catch (err) {
    console.error("fetchOrganizationsFromDB error:", err);
    return null;
  }
}

// Reuse your existing helper functions below
function populateFilters(activities, orgMap) {
  const statuses = new Set();
  const organizations = new Set();
  const departments = new Set();
  const sdgs = new Set();

  activities.forEach((activity) => {
    statuses.add(activity.status);

    const orgInfo = orgMap[activity.org_id?._id || activity.org_id] || {
      name: "Unknown Organization",
      dept: "Unknown Department",
    };
    organizations.add(orgInfo.name);
    departments.add(orgInfo.dept);

    if (Array.isArray(activity.sdgs)) {
      activity.sdgs.forEach((sdg) => sdgs.add(sdg));
    }
  });

  populateSelect("status-filter", statuses);
  populateSelect("organization-filter", organizations);
  populateSelect("department-filter", departments);
  populateSelect("sdgs-filter", sdgs);
}

function populateSelect(selectId, optionsSet) {
  const select = document.getElementById(selectId);
  if (select) {
    select.length = 1;
    Array.from(optionsSet)
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
      .forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
      });
  }
}

function renderActivitiesTable(activities, orgMap) {
  const tableBody = document.getElementById("activities-table-body");
  const cardsContainer = document.getElementById("activities-cards-container");
  if (!tableBody || !cardsContainer) return;

  if (!activities.length) {
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No activities found.</td></tr>';
    cardsContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:#666;">No activities found.</div>';
    return;
  }

  tableBody.innerHTML = "";
  cardsContainer.innerHTML = "";

  activities.forEach((activity) => {
    const orgInfo = orgMap[activity.org_id?._id || activity.org_id] || {
      name: "Unknown Organization",
      dept: "Unknown Department",
    };

    const submitDate = activity.submitted_at
      ? new Date(activity.submitted_at)
      : new Date();
    const formattedDate = submitDate.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(",", "");

    const activitySdgs = Array.isArray(activity.sdgs) ? activity.sdgs : [];
    const sdgTooltip =
      activitySdgs.length > 0
        ? `<div class="sdg-tooltip">
            <span class="sdg-count">${activitySdgs.length} SDGs</span>
            <div class="sdg-tooltip-content">
              ${activitySdgs
                .map((sdg) => {
                  const num = sdg.match(/\d+/)?.[0] || "";
                  return `<span class="sdg sdg-${num}">${sdg}</span>`;
                })
                .join(" ")}
            </div>
          </div>`
        : "N/A";

    const statusClass = activity.status
      ? activity.status.toLowerCase().replace(" ", "-")
      : "unknown";

    tableBody.innerHTML += `
      <tr>
        <td>
          <p class="activity-name">${activity.title}</p>
          <p class="activity-desc">${activity.description}</p>
        </td>
        <td>${orgInfo.name}</td>
        <td>${orgInfo.dept}</td>
        <td>${sdgTooltip}</td>
        <td>${activity.term || "N/A"}</td>
        <td><span class="status ${statusClass}">${activity.status}</span></td>
        <td>${formattedDate}</td>
        <td><button class="review-btn" data-activity-id="${activity._id}">Review</button></td>
      </tr>
    `;

    cardsContainer.innerHTML += `
      <div class="activity-card">
        <div class="activity-card-header">
          <div class="activity-card-title">
            <p class="activity-name">${activity.title}</p>
            <p class="activity-desc">${activity.description}</p>
          </div>
          <div class="activity-card-status">
            <span class="status ${statusClass}">${activity.status}</span>
          </div>
        </div>
        <div class="activity-card-details">
          <div class="activity-card-detail">
            <span class="detail-label">Organization</span>
            <span class="detail-value">${orgInfo.name}</span>
          </div>
          <div class="activity-card-detail">
            <span class="detail-label">Department</span>
            <span class="detail-value">${orgInfo.dept}</span>
          </div>
          <div class="activity-card-detail">
            <span class="detail-label">SDGs</span>
            <span class="detail-value">${
              activitySdgs.length > 0 ? `${activitySdgs.length} SDGs` : "N/A"
            }</span>
          </div>
          <div class="activity-card-detail">
            <span class="detail-label">Term</span>
            <span class="detail-value">${activity.term || "N/A"}</span>
          </div>
          <div class="activity-card-detail">
            <span class="detail-label">Submission Date</span>
            <span class="detail-value">${formattedDate}</span>
          </div>
        </div>
        <div class="activity-card-actions">
          <button class="review-btn" data-activity-id="${activity._id}">Review</button>
        </div>
      </div>
    `;
  });
}

function addFilterEventListeners() {
  ["status-filter", "organization-filter", "department-filter", "sdgs-filter"].forEach((id) => {
    const select = document.getElementById(id);
    if (select) select.addEventListener("change", filterAndRenderActivities);
  });

  const searchInput = document.getElementById("activity-search");
  const searchButton = document.getElementById("search-button");

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") filterAndRenderActivities();
    });
  }
  if (searchButton) {
    searchButton.addEventListener("click", filterAndRenderActivities);
  }
}

function filterAndRenderActivities() {
  if (!allActivitiesData || !currentOrgMap) return;

  const searchTerm = document.getElementById("activity-search")?.value.toLowerCase().trim() || "";
  const statusFilter = document.getElementById("status-filter")?.value || "";
  const organizationFilter = document.getElementById("organization-filter")?.value || "";
  const departmentFilter = document.getElementById("department-filter")?.value || "";
  const sdgsFilter = document.getElementById("sdgs-filter")?.value || "";

  const filtered = allActivitiesData.filter((activity) => {
    const orgInfo = currentOrgMap[activity.org_id?._id || activity.org_id] || {
      name: "Unknown Organization",
      dept: "Unknown Department",
    };

    const matchesSearch =
      !searchTerm ||
      activity.title.toLowerCase().includes(searchTerm) ||
      activity.description.toLowerCase().includes(searchTerm) ||
      (activity.term || "").toLowerCase().includes(searchTerm) ||
      orgInfo.name.toLowerCase().includes(searchTerm) ||
      orgInfo.dept.toLowerCase().includes(searchTerm);

    const matchesStatus = !statusFilter || activity.status === statusFilter;
    const matchesOrg = !organizationFilter || orgInfo.name === organizationFilter;
    const matchesDept = !departmentFilter || orgInfo.dept === departmentFilter;
    const matchesSdgs =
      !sdgsFilter ||
      (Array.isArray(activity.sdgs) && activity.sdgs.includes(sdgsFilter));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesOrg &&
      matchesDept &&
      matchesSdgs
    );
  });

  renderActivitiesTable(filtered, currentOrgMap);
}

function addReviewButtonListener() {
  const folderBody = document.getElementById("folder-body");
  if (folderBody.dataset.listenerAttached) return;

  folderBody.addEventListener("click", (e) => {
    const btn = e.target.closest(".review-btn");
    if (btn) {
      const id = btn.dataset.activityId;
      const activity = allActivitiesData.find((a) => a._id === id);
      if (activity) showActivityReview(activity);
    }
  });
  folderBody.dataset.listenerAttached = "true";
}

function initActivities() {
  loadActivities();
}

initActivities();
