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
                            <th>Department</th> <th>SDGs</th>
                            <th>Term</th>
                            <th>Status</th>
                            <th>Submission Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="activities-table-body">
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  `;

  if (!allActivitiesData) {
    const activitiesData = await fetchActivities();
    if (activitiesData) {
      allActivitiesData = activitiesData;

      // since wala pang database and I can't use lookup, let me just create fluff data
      const orgMap = {
        "6716001a9b8c2001abcd0001": {
          name: "Integrated Confederacy",
          dept: "SAMCIS",
        },
        "6716001a9b8c2001abcd0002": { name: "Green Core", dept: "SAS" },
      };
      currentOrgMap = orgMap;
    } else {
      folderBody.innerHTML = "<p>Error loading activities.</p>";
      return;
    }
  }

  populateFilters(allActivitiesData, currentOrgMap);
  renderActivitiesTable(allActivitiesData, currentOrgMap);
  addFilterEventListeners();
  addReviewButtonListener();
}

// fetch activities from temp json
async function fetchActivities() {
  try {
    const response = await fetch("../../../data/activities.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Could not fetch activities data:", error);
    return null;
  }
}

// orgMap param is temp
function populateFilters(activities, orgMap) {
  const statuses = new Set();
  const organizations = new Set();
  const departments = new Set();
  const sdgs = new Set();

  activities.forEach((activity) => {
    statuses.add(activity.status);

    const orgInfo = orgMap[activity.org_id["$oid"]] || {
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

// populate select element
function populateSelect(selectId, optionsSet) {
  const select = document.getElementById(selectId);
  // sort options to make it look better
  if (select) {
    select.length = 1;
    
    const sortedOptions = Array.from(optionsSet).sort((a, b) => {
      return a.localeCompare(b, "en", { numeric: true });
    });

    sortedOptions.forEach((option) => {
      const newOption = document.createElement("option");
      newOption.value = option;
      newOption.textContent = option;
      select.appendChild(newOption);
    });
  }
}

// renders the table rows, orgMap param still temporary
function renderActivitiesTable(activities, orgMap) {
  const tableBody = document.getElementById("activities-table-body");
  if (!tableBody) return;

  if (activities.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="8" style="text-align: center;">No activities match the current filters.</td></tr>';
    return;
  }

  tableBody.innerHTML = "";

  const rowsHTML = activities
    .map((activity) => {
      // temp lookup
      const orgInfo = orgMap[activity.org_id["$oid"]] || {
        name: "Unknown Organization",
        dept: "Unknown Department",
      };

      const submitDate = activity.submitted_at
        ? new Date(activity.submitted_at)
        : new Date(); // fallback only temp
      const formattedDate = submitDate
        .toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", "");

      const activitySdgs = Array.isArray(activity.sdgs) ? activity.sdgs : [];

      const sdgTooltip =
        activitySdgs.length > 0
          ? `<div class="sdg-tooltip">
                  <span class="sdg-count">${activitySdgs.length} SDGs</span>
                  <div class="sdg-tooltip-content">
                      ${activitySdgs
                        .map((sdg) => {
                          const sdgNumberMatch = sdg.match(/\d+/);
                          const sdgNumber = sdgNumberMatch
                            ? sdgNumberMatch[0]
                            : "";
                          const sdgClass = `sdg sdg-${sdgNumber}`;
                          return `<span class="${sdgClass}">${sdg}</span>`;
                        })
                        .join(" ")}
                  </div>
              </div>`
          : "N/A";

      const statusClass = activity.status
        ? activity.status.toLowerCase().replace(" ", "-")
        : "unknown";

      return `
            <tr>
                <td>
                    <p class="activity-name">${activity.title}</p>
                    <p class="activity-desc">${
                      activity.description
                    }</p>
                </td>
                <td>${orgInfo.name}</td>
                <td>${orgInfo.dept}</td> <td>${sdgTooltip}</td>
                <td>${activity.term}</td>
                <td><span class="status ${statusClass}">${
        activity.status
      }</span></td>
                <td>${formattedDate}</td>
                <td><button class="review-btn" data-activity-id="${
                  activity._id["$oid"]
                }">Review</button></td>
            </tr>
        `;
    })
    .join("");

  tableBody.innerHTML = rowsHTML;
}

// filter and search event listeners
function addFilterEventListeners() {
  const filterIds = [
    "status-filter",
    "organization-filter",
    "department-filter",
    "sdgs-filter",
  ];
  filterIds.forEach((id) => {
    const selectElement = document.getElementById(id);
    if (selectElement) {
      selectElement.addEventListener("change", filterAndRenderActivities);
    }
  });

  const searchInput = document.getElementById("activity-search");
  const searchButton = document.getElementById("search-button");

  if (searchInput) {
    // detect enter
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        filterAndRenderActivities();
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", filterAndRenderActivities);
  }
}

// filter and search
function filterAndRenderActivities() {
  if (!allActivitiesData || !currentOrgMap) return;

  // current filter values
  const searchTerm =
    document.getElementById("activity-search")?.value.toLowerCase().trim() ||
    "";
  const statusFilter = document.getElementById("status-filter")?.value || "";
  const organizationFilter =
    document.getElementById("organization-filter")?.value || "";
  const departmentFilter =
    document.getElementById("department-filter")?.value || "";
  const sdgsFilter = document.getElementById("sdgs-filter")?.value || "";

  // filter data
  const filteredActivities = allActivitiesData.filter((activity) => {
    const orgInfo = currentOrgMap[activity.org_id["$oid"]] || {
      name: "Unknown Organization",
      dept: "Unknown Department",
    };

    // search
    const matchesSearch =
      !searchTerm ||
      activity.title.toLowerCase().includes(searchTerm) ||
      activity.description.toLowerCase().includes(searchTerm) ||
      activity.term.toLowerCase().includes(searchTerm) ||
      orgInfo.dept.toLowerCase().includes(searchTerm) ||
      orgInfo.name.toLowerCase().includes(searchTerm);

    // filters
    const matchesStatus = !statusFilter || activity.status === statusFilter;
    const matchesOrganization =
      !organizationFilter || orgInfo.name === organizationFilter;
    const matchesDepartment =
      !departmentFilter || orgInfo.dept === departmentFilter;
    const matchesSdgs =
      !sdgsFilter ||
      (Array.isArray(activity.sdgs) && activity.sdgs.includes(sdgsFilter));
    return (
      matchesSearch &&
      matchesStatus &&
      matchesOrganization &&
      matchesDepartment &&
      matchesSdgs
    );
  });

  renderActivitiesTable(filteredActivities, currentOrgMap);
}

// listener for review button
function addReviewButtonListener() {
  const folderBody = document.getElementById("folder-body");
  
  // flag to avoid adding multiple listeners
  if (folderBody.dataset.listenerAttached) return;

  folderBody.addEventListener("click", (e) => {
    const reviewBtn = e.target.closest(".review-btn");
    if (reviewBtn) {
      const activityId = reviewBtn.getAttribute("data-activity-id");
      const activity = allActivitiesData.find(
        (act) => act._id["$oid"] === activityId
      );
      if (activity) {
        showActivityReview(activity); 
      } else {
        console.error("Activity not found:", activityId);
      }
    }
  });
  folderBody.dataset.listenerAttached = "true";
}

function initActivities() {
  loadActivities();
}

initActivities();