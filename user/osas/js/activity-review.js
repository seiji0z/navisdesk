// temp wala pang database e
const sdgTitlesMap = {
  1: "No Poverty",
  2: "Zero Hunger",
  3: "Good Health and Well-being",
  4: "Quality Education",
  5: "Gender Equality",
  6: "Clean Water and Sanitation",
  7: "Affordable and Clean Energy",
  8: "Decent Work and Economic Growth",
  9: "Industry, Innovation and Infrastructure",
  10: "Reduced Inequalities",
  11: "Sustainable Cities and Communities",
  12: "Responsible Consumption and Production",
  13: "Climate Action",
  14: "Life Below Water",
  15: "Life on Land",
  16: "Peace, Justice and Strong Institutions",
  17: "Partnerships for the Goals",
};

// forked from submit-activity

// map card titles to icon filenames
const cardIcons = {
  "Activity Details": "activity-details.svg",
  "Date and Time": "date-and-time.svg",
  Venue: "venue.svg",
  "SDG Alignment": "sdg-alignment.svg",
  "Supporting Documents": "supporting-document.svg",
  "Evidence of Activity": "evidence-of-activity.svg",
  "OSAS Review": "review-icon.svg",
};

// create section cards
function createSection(title, innerHTML, prependHTML = "") {
  const section = document.createElement("div");
  section.classList.add("activity-section");
  const iconFile = cardIcons[title];
  const iconPath = `../../../assets/images/${iconFile}`;
  const iconHTML = iconFile
    ? `<img src='${iconPath}' alt='' class='card-title-icon' style='width:28px;height:28px;margin-right:12px;vertical-align:middle;' />`
    : "";

  section.innerHTML = `
    ${prependHTML}
    <h3 style="display:flex;align-items:center;gap:10px;">
      ${iconHTML}<span>${title}</span>
    </h3>
    <div class="section-content">
      ${innerHTML}
    </div>
  `;
  return section;
}

// date formatter (string)
function formatDateForDisplay(isoString) {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return isoString;
  }
}

// table redirection
function showActivityReview(activity) {
  const folderBody = document.getElementById("folder-body");
  folderBody.innerHTML = generateReview(activity);

  document
    .getElementById("back-to-table-btn")
    .addEventListener("click", loadActivities);

  const handleAcceptActivity = () => {
    const remarks = document.getElementById("osas-remarks").value;
    alert(
      `Activity "${activity.title}" ACCEPTED.\nRemarks: ${remarks || "None"}`
    );
    loadActivities();
  };

  document
    .getElementById("accept-activity-btn")
    .addEventListener("click", () => {
      showConfirmationModal(
        "Are you sure you want to accept this activity?",
        "Accept Activity",
        "active",
        handleAcceptActivity
      );
    });

  const handleReturnActivity = () => {
    const remarks = document.getElementById("osas-remarks").value;
    alert(`Activity "${activity.title}" RETURNED.\nRemarks: ${remarks}`);
    loadActivities();
  };

  document
    .getElementById("return-activity-btn")
    .addEventListener("click", () => {
      const remarks = document.getElementById("osas-remarks").value;

      if (!remarks || remarks.trim() === "") {
        alert("Please provide remarks before returning the activity.");
        return;
      }

      showConfirmationModal(
        "Are you sure you want to return this activity with your remarks?",
        "Return Activity",
        "inactive",
        handleReturnActivity
      );
    });
}

// generate the review display
function generateReview(activity) {
  const backButtonHTML = `
  <div class="back-button-container" style="margin-bottom: 15px;">
    <button class="back-button" id="back-to-table-btn">Back to Activities</button>
  </div>
  `;

  // activity details
  const detailsHTML = `
    <div class="review-row"><div class="review-label">Title</div><div class="review-value">${activity.title}</div></div>
    <div class="review-row"><div class="review-label">Description</div><div class="review-value">${activity.description}</div></div>
    <div class="review-row"><div class="review-label">Objectives</div><div class="review-value">${activity.objectives}</div></div>
    <div class="review-row"><div class="review-label">Academic Year</div><div class="review-value">${activity.acad_year}</div></div>
    <div class="review-row"><div class="review-label">Term</div><div class="review-value">${activity.term}</div></div>
  `;
  const detailsSection = createSection(
    "Activity Details",
    detailsHTML,
    backButtonHTML
  ).outerHTML;

  // date and time
  const dateTimeHTML = `
    <div class="review-row"><div class="review-label">Start</div><div class="review-value">${formatDateForDisplay(
      activity.date_start
    )}</div></div>
    <div class="review-row"><div class="review-label">End</div><div class="review-value">${formatDateForDisplay(
      activity.date_end
    )}</div></div>
  `;
  const dateTimeSection = createSection(
    "Date and Time",
    dateTimeHTML
  ).outerHTML;

  // venue
  const venueHTML = `
    <div class="review-row"><div class="review-label">Location</div><div class="review-value">${activity.venue}</div></div>
  `;
  const venueSection = createSection("Venue", venueHTML).outerHTML;

  // sdgs
  const sdgsHTML =
    activity.sdgs && activity.sdgs.length > 0
      ? activity.sdgs
          .map((sdg) => {
            const sdgNumberMatch = sdg.match(/\d+/);
            const n = sdgNumberMatch ? sdgNumberMatch[0] : "";
            // Look up the name using the extracted number
            const sdgName = sdgTitlesMap[n] || sdg;
            return `
              <div class="sdg-box sdg-${n}">
                <span class="sdg-label sdg-${n}">${n}</span>
                <span class="sdg-text">${sdgName}</span>
              </div>`;
          })
          .join("")
      : '<div class="review-value">No SDGs aligned.</div>';

  const sdgSection = createSection(
    "SDG Alignment",
    `<div class="sdg-grid">${sdgsHTML}</div>`
  ).outerHTML;

  // supporting document
  const supportingDocsHTML =
    activity.supporting_docs && activity.supporting_docs.length > 0
      ? activity.supporting_docs
          .map(
            (doc) =>
              `<div class="review-value"><a href="${
                doc.url || "#"
              }" target="_blank">${doc.filename || "file"}</a></div>`
          )
          .join("")
      : '<div class="review-value">No supporting documents uploaded.</div>';
  const supportingDocsSection = createSection(
    "Supporting Documents",
    supportingDocsHTML
  ).outerHTML;

  // evidence
  const evidenceHTML =
    activity.evidences && activity.evidences.length > 0
      ? activity.evidences
          .map(
            (evi) =>
              `<div class="review-value"><a href="${
                evi.url || "#"
              }" target="_blank">${evi.filename || "file"}</a></div>`
          )
          .join("")
      : '<div class="review-value">No evidence uploaded.</div>';
  const evidenceSection = createSection(
    "Evidence of Activity",
    evidenceHTML
  ).outerHTML;

  // remarks
  const osasActionHTML = `
    <label for="osas-remarks">Remarks</label>
    <textarea id="osas-remarks" placeholder="Provide feedback here (required if returning the activity)..."></textarea>
    <div class="osas-button-container"></div>
    <div class="button-container">
      <button class="remove-btn" id="return-activity-btn">Return Activity</button>
      <button class="accept-btn" id="accept-activity-btn">Accept Activity</button>
    </div>
  `;
  const osasSection = createSection("OSAS Review", osasActionHTML).outerHTML;

  // combine all sections
  return `
    ${detailsSection}
    ${dateTimeSection}
    ${venueSection}
    ${sdgSection}
    ${supportingDocsSection}
    ${evidenceSection}
    ${osasSection}
  `;
}

// confirmation prompt
function showConfirmationModal(message, confirmText, confirmClass, onConfirm) {
  closeConfirmationModal();

  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.id = "confirmationModal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  modalContent.innerHTML = `
    <h4>Confirmation</h4>
    <p>${message}</p>
    <div class="modal-buttons">
      <button class="modal-btn modal-btn-cancel" onclick="closeConfirmationModal()">Cancel</button>
      <button class="modal-btn modal-btn-confirm ${confirmClass}" id="modalConfirmButton">${confirmText}</button>
    </div>
  `;

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  document.getElementById("modalConfirmButton").onclick = function () {
    onConfirm();
    closeConfirmationModal();
  };

  modalOverlay.onclick = function (e) {
    if (e.target === modalOverlay) {
      closeConfirmationModal();
    }
  };

  window.closeConfirmationModal = closeConfirmationModal;
}

function closeConfirmationModal() {
  const modal = document.getElementById("confirmationModal");
  if (modal) {
    modal.parentNode.removeChild(modal);
  }
}
