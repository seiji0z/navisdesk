// Select folder body container
const folderBody = document.getElementById("folder-body");

// Helper function: create form section card
function createSection(title, innerHTML) {
  const section = document.createElement("div");
  section.classList.add("activity-section");
  section.innerHTML = `
    <h3>${title}</h3>
    <div class="section-content">
      ${innerHTML}
    </div>
  `;
  return section;
}

// ===============================
// 1. Activity Details
// ===============================
const activityDetails = createSection(
  "Activity Details",
  `
    <label>Activity Title</label>
    <input type="text" placeholder="e.g. Annual Leadership Summit" />

    <label>Activity Description</label>
    <textarea placeholder="Briefly describe the purpose and objectives..."></textarea>

    <label>Activity Type</label>
    <input type="text" placeholder="e.g. Seminar, Workshop, Outreach Program" />
  `
);

// ===============================
// 2. Date and Time
// ===============================
const dateTime = createSection(
  "Date and Time",
  `
    <div class="date-time-row">
      <div>
        <label>Start Date</label>
        <input type="date" />
      </div>
      <div>
        <label>End Date</label>
        <input type="date" />
      </div>
    </div>
    <div class="date-time-row">
      <div>
        <label>Start Time</label>
        <input type="time" />
      </div>
      <div>
        <label>End Time</label>
        <input type="time" />
      </div>
    </div>
  `
);

// ===============================
// 3. Venue and Participants
// ===============================
const venueParticipants = createSection(
  "Venue and Participants",
  `
    <label>Venue</label>
    <input type="text" placeholder="e.g. SLU Fr. Burgos Gymnasium" />

    <label>Participant Description</label>
    <textarea placeholder="Who are the target participants? (e.g. IT students, faculty, etc.)"></textarea>

    <label>Expected Number of Participants</label>
    <input type="number" placeholder="e.g. 50" />
  `
);

// ===============================
// 4. SDG Alignment
// ===============================
const sdgs = Array.from({ length: 17 }, (_, i) => {
  const n = i + 1;
  const titles = [
    "No Poverty",
    "Zero Hunger",
    "Good Health and Well-being",
    "Quality Education",
    "Gender Equality",
    "Clean Water and Sanitation",
    "Affordable and Clean Energy",
    "Decent Work and Economic Growth",
    "Industry, Innovation and Infrastructure",
    "Reduced Inequalities",
    "Sustainable Cities and Communities",
    "Responsible Consumption and Production",
    "Climate Action",
    "Life Below Water",
    "Life on Land",
    "Peace, Justice and Strong Institutions",
    "Partnerships for the Goals",
  ];
  return `
    <label class="sdg-checkbox">
      <input type="checkbox" />
      <span>${n}. ${titles[i]}</span>
    </label>
  `;
}).join("");

const sdgAlignment = createSection("SDG Alignment", `<div class="sdg-grid">${sdgs}</div>`);

// ===============================
// 5. Supporting Document
// ===============================
const supportingDocs = createSection(
  "Supporting Documents",
  `
    <div class="upload-row">
      <div class="upload-box" data-target="implementationPlan">
        <div class="upload-icon"><img src="../../../assets/images/cloud-upload.png" alt="upload icon" /></div>
        <div class="upload-text"><strong>Click to upload</strong> or drag and drop</div>
        <div class="upload-filename" id="fileName1">No file chosen</div>
      </div>

      <div class="upload-box" data-target="endorsementLetter">
        <div class="upload-icon"><img src="../../../assets/images/cloud-upload.png" alt="upload icon" /></div>
        <div class="upload-text"><strong>Click to upload</strong> or drag and drop</div>
        <div class="upload-filename" id="fileName2">No file chosen</div>
      </div>
    </div>

    <input type="file" id="implementationPlan" class="file-input hidden" />
    <input type="file" id="endorsementLetter" class="file-input hidden" />
  `
);

// ===============================
// 6. Evidence of Activity
// ===============================
const evidence = createSection(
  "Evidence of Activity",
  `
    <div class="upload-row">
      <div class="upload-box" data-target="photos">
        <div class="upload-icon"><img src="../../../assets/images/cloud-upload.png" alt="upload icon" /></div>
        <div class="upload-text"><strong>Click to upload</strong> or drag and drop</div>
        <div class="upload-filename" id="fileName3">No files chosen</div>
      </div>

      <div class="upload-box" data-target="certificates">
        <div class="upload-icon"><img src="../../../assets/images/cloud-upload.png" alt="upload icon" /></div>
        <div class="upload-text"><strong>Click to upload</strong> or drag and drop</div>
        <div class="upload-filename" id="fileName4">No files chosen</div>
      </div>
    </div>

    <input type="file" id="photos" class="file-input hidden" multiple />
    <input type="file" id="certificates" class="file-input hidden" multiple />
  `
);

// Append all sections
folderBody.append(
  activityDetails,
  dateTime,
  venueParticipants,
  sdgAlignment,
  supportingDocs,
  evidence
);

// ===============================
// Buttons (Bottom Right)
// ===============================
const buttonContainer = document.createElement("div");
buttonContainer.classList.add("button-container");

buttonContainer.innerHTML = `
  <button class="cancel-btn">Cancel</button>
  <button class="submit-btn">Submit Activity</button>
`;

folderBody.appendChild(buttonContainer);

// ===============================
// Event Listeners
// ===============================
document.querySelector(".submit-btn").addEventListener("click", () => {
  alert("Activity submitted successfully!");
  window.location.href = "dashboard.html";
});

document.querySelector(".cancel-btn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// Display selected file names
document.querySelectorAll(".file-input").forEach((input) => {
  input.addEventListener("change", (e) => {
    const id = e.target.id;
    const fileSpan = document.getElementById(
      id === "implementationPlan" ? "fileName1" : id === "endorsementLetter" ? "fileName2" : id === "photos" ? "fileName3" : id === "certificates" ? "fileName4" : null
    );
    const files = Array.from(e.target.files).map((f) => f.name);
    if (fileSpan) fileSpan.textContent = files.length ? files.join(", ") : id === "photos" || id === "certificates" ? "No files chosen" : "No file chosen";
  });
});

// Wire upload-box click and drag/drop
document.querySelectorAll('.upload-box').forEach(box => {
  const targetId = box.getAttribute('data-target');
  const input = document.getElementById(targetId);

  // Open file dialog when clicking the box
  box.addEventListener('click', () => {
    if (input) input.click();
  });

  // Drag over
  box.addEventListener('dragover', (e) => {
    e.preventDefault();
    box.classList.add('dragover');
  });

  box.addEventListener('dragleave', () => {
    box.classList.remove('dragover');
  });

  box.addEventListener('drop', (e) => {
    e.preventDefault();
    box.classList.remove('dragover');
    if (!input) return;
    const dtFiles = e.dataTransfer.files;
    // For single-file inputs (implementationPlan, endorsementLetter), take only first
    if (!input.multiple && dtFiles.length > 0) {
      const file = dtFiles[0];
      // Create a DataTransfer to assign to input.files
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
    } else {
      const dataTransfer = new DataTransfer();
      Array.from(dtFiles).forEach(f => dataTransfer.items.add(f));
      input.files = dataTransfer.files;
    }
    // Trigger change to update filename display
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
});
