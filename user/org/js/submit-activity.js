// Select folder body container
const folderBody = document.getElementById("folder-body");


// Save activity to database
window.DB = {
  async saveActivity(formData) {
    const orgId = "6716001a9b8c2001abcd0001"; // ICON ORG

    const response = await fetch("../../../server/php/submit-activity.php", {
      method: "POST",
      headers: { "x-org-id": orgId },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "Submission failed");
    }
    return await response.json();
  }
};


// Helper function: create form section card
// Map card titles to icon filenames
const cardIcons = {
  "Activity Details": "activity-details.svg",
  "Date and Time": "date-and-time.svg",
  Venue: "venue.svg",
  "SDG Alignment": "sdg-alignment.svg",
  "Supporting Documents": "supporting-document.svg",
  "Evidence of Activity": "evidence-of-activity.svg",
};

function createSection(title, innerHTML) {
  const section = document.createElement("div");
  section.classList.add("activity-section");
  // Icon HTML if available
  const iconFile = cardIcons[title];
  const iconHTML = iconFile
    ? `<img src='../../../assets/images/${iconFile}' alt='' class='card-title-icon' style='width:28px;height:28px;margin-right:12px;vertical-align:middle;' />`
    : "";
  section.innerHTML = `
    <h3 style="display:flex;align-items:center;gap:10px;">
      ${iconHTML}<span>${title}</span>
    </h3>
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

    <label>Activity Objective</label>
    <textarea placeholder="Describe the specific objective of this activity"></textarea>

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
  "Venue",
  `
    <input type="text" placeholder="e.g. SLU Fr. Burgos Gymnasium" />
  `
);

// ===============================
// 4. SDG Alignment
// ===============================
function createSDGAlignmentSection() {
  const sdgSection = createSection(
    "SDG Alignment",
    `
    <div class="sdg-grid">
      ${Array.from({ length: 17 }, (_, i) => {
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
          <label class="sdg-checkbox sdg-${n}">
            <input type="checkbox" data-sdg="${n}" />
            <span class="sdg-label sdg-${n}">${n}</span>
            <span style="margin-left:8px">${titles[i]}</span>
          </label>
        `;
      }).join("")}
    </div>
    
    <!-- Mobile SDG Selector -->
    <div class="sdg-mobile-selector">
      <div class="sdg-search-container">
        <input type="text" class="sdg-search-input" placeholder="Search SDGs..." />
        <i class="fas fa-search sdg-search-icon"></i>
      </div>
      <div class="sdg-mobile-grid" id="sdg-mobile-grid"></div>
      <div class="sdg-selected-display" id="sdg-selected-display">
        <span style="color: #6b7280; font-size: 0.9rem;">No SDGs selected</span>
      </div>
    </div>
  `
  );

  return sdgSection;
}

// Initialize Mobile SDG Selector
function initMobileSDGSelector() {
  const mobileGrid = document.getElementById("sdg-mobile-grid");
  const searchInput = document.querySelector(".sdg-search-input");
  const selectedDisplay = document.getElementById("sdg-selected-display");
  const desktopCheckboxes = document.querySelectorAll(
    '.sdg-grid input[type="checkbox"]'
  );

  const sdgData = Array.from({ length: 17 }, (_, i) => {
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
    return { number: n, title: titles[i] };
  });

  // Populate mobile grid
  function populateMobileGrid(sdgs = sdgData) {
    mobileGrid.innerHTML = sdgs
      .map(
        (sdg) => `
      <label class="sdg-mobile-option">
        <input type="checkbox" data-sdg="${sdg.number}" />
        <span class="sdg-mobile-label sdg-${sdg.number}">${sdg.number}</span>
        <span class="sdg-mobile-text">${sdg.title}</span>
      </label>
    `
      )
      .join("");

    // Sync with desktop checkboxes
    syncCheckboxStates();

    // Add event listeners to mobile checkboxes
    mobileGrid
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          updateSelectedDisplay();
          syncWithDesktopCheckboxes();
        });
      });
  }

  // Sync mobile with desktop checkboxes
  function syncCheckboxStates() {
    desktopCheckboxes.forEach((desktopCheckbox) => {
      const sdgNumber = desktopCheckbox.getAttribute("data-sdg");
      const mobileCheckbox = mobileGrid.querySelector(
        `input[data-sdg="${sdgNumber}"]`
      );
      if (mobileCheckbox) {
        mobileCheckbox.checked = desktopCheckbox.checked;
        const option = mobileCheckbox.closest(".sdg-mobile-option");
        if (desktopCheckbox.checked) {
          option.classList.add("selected");
        } else {
          option.classList.remove("selected");
        }
      }
    });
  }

  // Sync desktop with mobile checkboxes
  function syncWithDesktopCheckboxes() {
    mobileGrid
      .querySelectorAll('input[type="checkbox"]')
      .forEach((mobileCheckbox) => {
        const sdgNumber = mobileCheckbox.getAttribute("data-sdg");
        const desktopCheckbox = document.querySelector(
          `.sdg-grid input[data-sdg="${sdgNumber}"]`
        );
        if (desktopCheckbox) {
          desktopCheckbox.checked = mobileCheckbox.checked;
        }
      });
  }

  // Update selected SDGs display
  function updateSelectedDisplay() {
    const selectedSDGs = Array.from(
      mobileGrid.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => {
      const sdgNumber = checkbox.getAttribute("data-sdg");
      const sdgTitle = sdgData.find((sdg) => sdg.number == sdgNumber)?.title;
      return { number: sdgNumber, title: sdgTitle };
    });

    if (selectedSDGs.length === 0) {
      selectedDisplay.innerHTML =
        '<span style="color: #6b7280; font-size: 0.9rem;">No SDGs selected</span>';
    } else {
      selectedDisplay.innerHTML = selectedSDGs
        .map(
          (sdg) => `
        <div class="sdg-selected-item">
          <span class="sdg-mobile-label sdg-${sdg.number}">${sdg.number}</span>
          <span>${sdg.title}</span>
          <button type="button" class="sdg-remove-btn" data-sdg="${sdg.number}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `
        )
        .join("");

      // Add remove button handlers
      selectedDisplay.querySelectorAll(".sdg-remove-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const sdgNumber = this.getAttribute("data-sdg");
          const checkbox = mobileGrid.querySelector(
            `input[data-sdg="${sdgNumber}"]`
          );
          if (checkbox) {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event("change"));
          }
        });
      });
    }
  }

  // Search functionality
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredSDGs = sdgData.filter(
      (sdg) =>
        sdg.title.toLowerCase().includes(searchTerm) ||
        sdg.number.toString().includes(searchTerm)
    );
    populateMobileGrid(filteredSDGs);
  });

  // Desktop checkbox change listeners
  desktopCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      syncCheckboxStates();
      updateSelectedDisplay();
    });
  });

  // Initial setup
  populateMobileGrid();
  updateSelectedDisplay();
}

// Update your section creation to use the new SDG function
const sdgAlignment = createSDGAlignmentSection();

// ===============================
// 5. Supporting Document
// ===============================
// Render section controls and let JS create one upload box by default
const supportingDocs = createSection(
  "Supporting Documents",
  `
    <div class="section-controls" id="supporting-controls">
      <button class="small-btn add-more-btn" id="supporting-add">Add another</button>
      <button class="small-btn remove-btn" id="supporting-remove">Remove</button>
    </div>
    <div class="upload-row" id="supporting-uploads"></div>
  `
);

// ===============================
// 6. Evidence of Activity
// ===============================
const evidence = createSection(
  "Evidence of Activity",
  `
    <div class="section-controls" id="evidence-controls">
      <button class="small-btn add-more-btn" id="evidence-add">Add another</button>
      <button class="small-btn remove-btn" id="evidence-remove">Remove</button>
    </div>
    <div class="upload-row" id="evidence-uploads"></div>
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
  <button class="back-btn remove-btn" style="display:none;">Back</button>
  <button class="submit-btn">Review & Submit</button>
`;

folderBody.appendChild(buttonContainer);

// ===============================
// Event Listeners
// ===============================
const backBtn = document.querySelector(".back-btn");
const submitBtn = document.querySelector(".submit-btn");

function gatherFormData() {
  const data = new FormData();

  // Activity Details
  const details = activityDetails.querySelectorAll("input, textarea");
  data.append("title", details[0].value.trim());
  data.append("description", details[1].value.trim());
  data.append("objectives", details[2].value.trim());
  data.append("type", details[3].value.trim() || "General");

  // Date & Time
  const dates = dateTime.querySelectorAll("input");
  data.append("date_start", `${dates[0].value}T${dates[2].value || "00:00"}`);
  data.append("date_end", `${dates[1].value}T${dates[3].value || "23:59"}`);

  // Academic Year & Term
  data.append("acad_year", "2025-2026");
  data.append("term", "1st Semester");

  // Venue
  data.append("venue", venueParticipants.querySelector("input").value.trim());

  // SDGs
  sdgAlignment.querySelectorAll('input[type="checkbox"]:checked')
    .forEach(cb => data.append("sdgs", cb.dataset.sdg));

  // Supporting Documents
  supportingDocs.querySelectorAll(".upload-box").forEach((box, i) => {
    const type = box.querySelector(".supporting-type").value;
    const files = box.querySelector(".file-input").files;
    for (let j = 0; j < files.length; j++) {
      data.append("supporting_docs", files[j]);
      data.append(`supporting_meta[${i}][type]`, type);
    }
  });

  // Evidence
  evidence.querySelectorAll(".upload-box").forEach(box => {
    const files = box.querySelector(".file-input").files;
    for (let f of files) data.append("evidences", f);
  });

  return data;
}

function showReview() {
  const data = gatherFormData();
  // hide form sections
  folderBody
    .querySelectorAll(".activity-section")
    .forEach((s) => (s.style.display = "none"));
  buttonContainer.querySelector(".back-btn").style.display = "inline-block";
  submitBtn.textContent = "Submit Activity";

  // create review card
  const reviewCard = document.createElement("div");
  reviewCard.classList.add("activity-section", "review-card");
  reviewCard.id = "review-card";
  reviewCard.innerHTML = `
    <h3>Review Submission</h3>
    <div class="section-content">
      <div class="review-row"><div class="review-label">Title</div><div class="review-value">${escapeHtml(
        data.title
      )}</div></div>
      <div class="review-row"><div class="review-label">Description</div><div class="review-value">${escapeHtml(
        data.description
      )}</div></div>
      <div class="review-row"><div class="review-label">Objective</div><div class="review-value">${escapeHtml(
        data.objective
      )}</div></div>
      <div class="review-row"><div class="review-label">Type</div><div class="review-value">${escapeHtml(
        data.type
      )}</div></div>
      <div class="review-row"><div class="review-label">Date / Time</div><div class="review-value">${escapeHtml(
        data.startDate
      )} ${escapeHtml(data.startTime)} — ${escapeHtml(
    data.endDate
  )} ${escapeHtml(data.endTime)}</div></div>
      <div class="review-row"><div class="review-label">Venue</div><div class="review-value">${escapeHtml(
        data.venue
      )}</div></div>
      <div class="review-row"><div class="review-label">SDG Alignment</div><div class="review-value">${data.sdgs
        .map(
          (n) =>
            `<span class="sdg-label" style="margin-right:6px;background:var(--sdg-${n})">${n}</span>`
        )
        .join(" ")}</div></div>
      <div class="review-row"><div class="review-label">Supporting Documents</div><div class="review-value">${
        data.supporting
          .map(
            (s) => `${escapeHtml(s.type)}: ${escapeHtml(s.files.join(", "))}`
          )
          .join("<br/>") || "None"
      }</div></div>
      <div class="review-row"><div class="review-label">Evidence</div><div class="review-value">${
        data.evidence.flat().join(", ") || "None"
      }</div></div>
    </div>
  `;

  folderBody.insertBefore(reviewCard, buttonContainer);
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

ssubmitBtn.addEventListener("click", () => {
  const reviewCard = document.getElementById("review-card");

  if (reviewCard) {
    // READ-ONLY MODE: Just show success, no DB update
    alert("Form reviewed! (Read-only mode – no data saved)");
    window.location.href = "dashboard.html";
    return;
  }

  const valid = validateForm();
  if (!valid.ok) return alert(valid.msg);
  showReview();
});

backBtn.addEventListener("click", () => {
  // remove review and show form
  const reviewCard = document.getElementById("review-card");
  if (reviewCard) reviewCard.remove();
  folderBody
    .querySelectorAll(".activity-section")
    .forEach((s) => (s.style.display = "block"));
  buttonContainer.querySelector(".back-btn").style.display = "none";
  submitBtn.textContent = "Review & Submit";
});

document.querySelector(".cancel-btn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// Display selected file names
// generic handler for file-inputs created dynamically
function wireFileInput(input, box) {
  // Keep track of object URLs to revoke when files change
  input.__previews = input.__previews || [];
  input.addEventListener("change", (e) => {
    // revoke previous URLs
    if (input.__previews && input.__previews.length) {
      input.__previews.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (err) {}
      });
      input.__previews = [];
    }

    const files = Array.from(e.target.files || []);
    const filenameDiv = box.querySelector(".upload-filename");
    const previewDiv = box.querySelector(".upload-preview");
    if (previewDiv) previewDiv.innerHTML = "";

    if (files.length === 0) {
      if (filenameDiv) filenameDiv.textContent = "No file chosen";
      // clear opening guard in case it was set
      try {
        input.__opening = false;
      } catch (err) {
        /* ignore */
      }
      return;
    }

    // Show previews: images as thumbnails, others as file name rows
    const previewFragments = document.createDocumentFragment();
    files.forEach((f) => {
      const type = f.type || "";
      if (type.startsWith("image/")) {
        const url = URL.createObjectURL(f);
        input.__previews.push(url);
        const img = document.createElement("img");
        img.src = url;
        img.className = "upload-thumb";
        img.alt = f.name;
        previewFragments.appendChild(img);
      } else {
        const row = document.createElement("div");
        row.className = "upload-file-row";
        row.textContent = f.name;
        previewFragments.appendChild(row);
      }
    });
    if (previewDiv) previewDiv.appendChild(previewFragments);
    if (filenameDiv)
      filenameDiv.textContent = files.map((f) => f.name).join(", ");

    // clear opening guard now that change fired
    try {
      input.__opening = false;
    } catch (err) {
      /* ignore */
    }
  });
}

// Wire upload-box click and drag/drop
// Functions to add new supporting doc upload box
function createSupportingBox(index) {
  const box = document.createElement("div");
  box.classList.add("upload-box");
  box.setAttribute("data-index", index);
  box.innerHTML = `
    <div class="upload-type">
      <label>Type:</label>
      <select class="supporting-type">
        <option value="implementationPlan">Implementation Plan</option>
        <option value="endorsementLetter">Endorsement Letter</option>
      </select>
    </div>
    <div class="upload-icon"><img src="../../../assets/images/upload.svg" alt="upload icon" /></div>
    <div class="upload-text"><strong>Click to upload</strong> or drag and drop</div>
    <div class="upload-preview"></div>
    <div class="upload-filename">No file chosen</div>
    <input type="file" class="file-input hidden" />
  `;

  const input = box.querySelector(".file-input");
  const addBtn = box.querySelector(".add-more-btn");
  const removeBtn = box.querySelector(".remove-btn");

  // click to open file dialog
  box.addEventListener("click", (e) => {
    // ignore clicks on interactive elements so selects / inputs don't trigger file dialog
    if (e.target === addBtn || e.target === removeBtn) return;
    if (e.target.closest("select, input, button, label, textarea, a")) return;
    // Prevent duplicate dialogs: guard with a short-lived flag
    if (input.__opening) return;
    try {
      input.__opening = true;
    } catch (err) {}
    input.click();
    // fallback: clear guard after 800ms in case change doesn't fire (cancel case)
    setTimeout(() => {
      try {
        input.__opening = false;
      } catch (e) {}
    }, 800);
  });

  wireFileInput(input, box);

  // drag/drop
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
    box.classList.add("dragover");
  });
  box.addEventListener("dragleave", () => box.classList.remove("dragover"));
  box.addEventListener("drop", (e) => {
    e.preventDefault();
    box.classList.remove("dragover");
    const dtFiles = e.dataTransfer.files;
    const dataTransfer = new DataTransfer();
    Array.from(dtFiles).forEach((f) => dataTransfer.items.add(f));
    input.files = dataTransfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  // per-box add button not used; section-level add will create new boxes

  // per-box remove isn't used anymore; removal handled by section controls

  return box;
}

function createEvidenceBox(index) {
  const box = document.createElement("div");
  box.classList.add("upload-box");
  box.setAttribute("data-index", index);
  box.innerHTML = `
    <div class="upload-icon"><img src="../../../assets/images/upload.svg" alt="upload icon" /></div>
    <div class="upload-text"><strong>Click to upload</strong> or drag and drop</div>
    <div class="upload-preview"></div>
    <div class="upload-filename">No files chosen</div>
    <input type="file" class="file-input hidden" multiple />
  `;

  const input = box.querySelector(".file-input");
  const addBtn = box.querySelector(".add-more-btn");
  const removeBtn = box.querySelector(".remove-btn");

  box.addEventListener("click", (e) => {
    if (e.target === addBtn || e.target === removeBtn) return;
    if (e.target.closest("select, input, button, label, textarea, a")) return;
    if (input.__opening) return;
    try {
      input.__opening = true;
    } catch (err) {}
    input.click();
    setTimeout(() => {
      try {
        input.__opening = false;
      } catch (e) {}
    }, 800);
  });

  wireFileInput(input, box);

  box.addEventListener("dragover", (e) => {
    e.preventDefault();
    box.classList.add("dragover");
  });
  box.addEventListener("dragleave", () => box.classList.remove("dragover"));
  box.addEventListener("drop", (e) => {
    e.preventDefault();
    box.classList.remove("dragover");
    const dtFiles = e.dataTransfer.files;
    const dataTransfer = new DataTransfer();
    Array.from(dtFiles).forEach((f) => dataTransfer.items.add(f));
    input.files = dataTransfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  // per-box add button not used; section-level add will create new boxes

  // per-box remove not used; removal is handled via section control

  return box;
}

// Validate form: all inputs required before showing review
function validateForm() {
  const sections = folderBody.querySelectorAll(".activity-section");
  // Activity Details
  const details = sections[0].querySelectorAll("input, textarea");
  for (let i = 0; i < details.length; i++) {
    if (!details[i].value || details[i].value.trim() === "")
      return { ok: false, msg: "Please fill out all activity detail fields." };
  }

  // Dates/Times
  const dates = sections[1].querySelectorAll("input");
  for (let i = 0; i < dates.length; i++) {
    if (!dates[i].value)
      return {
        ok: false,
        msg: "Please provide start and end dates and times.",
      };
  }

  // Venue
  const venue = sections[2].querySelector("input");
  if (!venue || !venue.value.trim())
    return { ok: false, msg: "Please provide a venue." };

  // SDGs - at least one
  const sdgCbs = sections[3].querySelectorAll('input[type="checkbox"]');
  const anySdg = Array.from(sdgCbs).some((cb) => cb.checked);
  if (!anySdg)
    return { ok: false, msg: "Please select at least one SDG alignment." };

  // Supporting docs - each upload-box must have a file
  const supportBoxes = sections[4].querySelectorAll(".upload-box");
  if (supportBoxes.length === 0)
    return { ok: false, msg: "Please add at least one supporting document." };
  for (const box of supportBoxes) {
    const input = box.querySelector(".file-input");
    if (!input || !input.files || input.files.length === 0)
      return {
        ok: false,
        msg: "Please attach files for all supporting documents.",
      };
  }

  // Evidence - at least one upload-box and files
  const evidenceBoxes = sections[5].querySelectorAll(".upload-box");
  if (evidenceBoxes.length === 0)
    return { ok: false, msg: "Please add at least one evidence item." };
  for (const box of evidenceBoxes) {
    const input = box.querySelector(".file-input");
    if (!input || !input.files || input.files.length === 0)
      return {
        ok: false,
        msg: "Please attach evidence files for all evidence upload boxes.",
      };
  }

  return { ok: true };
}

// initialize dynamic upload boxes
function initUploads() {
  const supportContainer = document.getElementById("supporting-uploads");
  const evidenceContainer = document.getElementById("evidence-uploads");

  // If static boxes exist (restored), wire their inputs and handlers.
  if (supportContainer) {
    // ensure at least one upload-box exists
    if (!supportContainer.querySelector(".upload-box")) {
      supportContainer.appendChild(createSupportingBox(0));
    }
    // ensure proper single/multi class state
    updateUploadRowState(supportContainer);
    // wire any existing boxes that use data-target
    supportContainer.querySelectorAll(".upload-box").forEach((box, idx) => {
      const target = box.getAttribute("data-target");
      const input =
        box.querySelector(".file-input") ||
        (target ? document.getElementById(target) : null);
      if (!input && target) {
        // create hidden input if a data-target references an id
        const newInput = document.getElementById(target);
        if (newInput) box.appendChild(newInput);
      }
      // if there is an input element inside the box, wire it
      const actualInput = box.querySelector(".file-input");
      if (actualInput) wireFileInput(actualInput, box);

      // click and drag/drop wiring for boxes that reference a separate input
      box.addEventListener("click", (e) => {
        const btn = e.target.closest(".add-more-btn, .remove-btn");
        if (btn) return;
        // Prevent opening file dialog when interacting with selects/inputs inside box
        if (e.target.closest("select, input, button, label, textarea, a"))
          return;
        const targId = box.getAttribute("data-target");
        const targetInput = targId
          ? document.getElementById(targId)
          : box.querySelector(".file-input");
        if (!targetInput) return;
        if (targetInput.__opening) return;
        try {
          targetInput.__opening = true;
        } catch (err) {}
        targetInput.click();
        setTimeout(() => {
          try {
            targetInput.__opening = false;
          } catch (e) {}
        }, 800);
      });
      box.addEventListener("dragover", (e) => {
        e.preventDefault();
        box.classList.add("dragover");
      });
      box.addEventListener("dragleave", () => box.classList.remove("dragover"));
      box.addEventListener("drop", (e) => {
        e.preventDefault();
        box.classList.remove("dragover");
        const targId = box.getAttribute("data-target");
        const targetInput = targId
          ? document.getElementById(targId)
          : box.querySelector(".file-input");
        if (!targetInput) return;
        const dtFiles = e.dataTransfer.files;
        const dataTransfer = new DataTransfer();
        Array.from(dtFiles).forEach((f) => dataTransfer.items.add(f));
        targetInput.files = dataTransfer.files;
        targetInput.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }

  if (evidenceContainer) {
    if (!evidenceContainer.querySelector(".upload-box")) {
      evidenceContainer.appendChild(createEvidenceBox(0));
    }
    // ensure proper single/multi class state
    updateUploadRowState(evidenceContainer);
    evidenceContainer.querySelectorAll(".upload-box").forEach((box) => {
      const targId = box.getAttribute("data-target");
      const targetInput =
        box.querySelector(".file-input") ||
        (targId ? document.getElementById(targId) : null);
      if (targetInput) wireFileInput(targetInput, box);

      box.addEventListener("click", (e) => {
        const btn = e.target.closest(".add-more-btn, .remove-btn");
        if (btn) return;
        if (e.target.closest("select, input, button, label, textarea, a"))
          return;
        const target = box.getAttribute("data-target");
        const ti = target
          ? document.getElementById(target)
          : box.querySelector(".file-input");
        if (!ti) return;
        if (ti.__opening) return;
        try {
          ti.__opening = true;
        } catch (err) {}
        ti.click();
        setTimeout(() => {
          try {
            ti.__opening = false;
          } catch (e) {}
        }, 800);
      });
      box.addEventListener("dragover", (e) => {
        e.preventDefault();
        box.classList.add("dragover");
      });
      box.addEventListener("dragleave", () => box.classList.remove("dragover"));
      box.addEventListener("drop", (e) => {
        e.preventDefault();
        box.classList.remove("dragover");
        const target = box.getAttribute("data-target");
        const ti = target
          ? document.getElementById(target)
          : box.querySelector(".file-input");
        if (!ti) return;
        const dtFiles = e.dataTransfer.files;
        const dataTransfer = new DataTransfer();
        Array.from(dtFiles).forEach((f) => dataTransfer.items.add(f));
        ti.files = dataTransfer.files;
        ti.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }

  // supporting section controls
  const supportAdd = document.getElementById("supporting-add");
  const supportRemove = document.getElementById("supporting-remove");
  if (supportAdd && supportContainer)
    supportAdd.addEventListener("click", (e) => {
      e.preventDefault();
      supportContainer.appendChild(
        createSupportingBox(
          supportContainer.querySelectorAll(".upload-box").length
        )
      );
    });
  if (supportRemove && supportContainer)
    supportRemove.addEventListener("click", (e) => {
      e.preventDefault();
      if (supportContainer.querySelectorAll(".upload-box").length > 1)
        supportContainer.removeChild(supportContainer.lastElementChild);
      updateUploadRowState(supportContainer);
    });

  // evidence section controls
  const evidenceAdd = document.getElementById("evidence-add");
  const evidenceRemove = document.getElementById("evidence-remove");
  if (evidenceAdd && evidenceContainer)
    evidenceAdd.addEventListener("click", (e) => {
      e.preventDefault();
      evidenceContainer.appendChild(
        createEvidenceBox(
          evidenceContainer.querySelectorAll(".upload-box").length
        )
      );
      updateUploadRowState(evidenceContainer);
    });
  if (evidenceRemove && evidenceContainer)
    evidenceRemove.addEventListener("click", (e) => {
      e.preventDefault();
      if (evidenceContainer.querySelectorAll(".upload-box").length > 1)
        evidenceContainer.removeChild(evidenceContainer.lastElementChild);
      updateUploadRowState(evidenceContainer);
    });

  initMobileSDGSelector();
}

// Ensure upload-row containers have a class indicating single-item state for browsers without :has()
function updateUploadRowState(container) {
  if (!container) return;
  const count = container.querySelectorAll(".upload-box").length;
  if (count === 1) container.classList.add("single-upload");
  else container.classList.remove("single-upload");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUploads);
} else {
  initUploads();
}
