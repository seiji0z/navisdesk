// user/org/js/profile.js
const folderBody = document.getElementById("folder-body");

// =============================================
// 1. API CONFIG & HELPERS
// =============================================
const DB = "../../../server/php"; // PHP + MongoDB backend

// Get current org ID (hardcoded for now)
function getOrgId() {
  return "6716001a9b8c2001abcd0001"; // ICON ORG
}

// GET current org profile from get-student-orgs.php
async function fetchOrgProfile() {
  const orgId = getOrgId();
  const response = await fetch(`${DB}/get-student-orgs.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orgs: ${response.status}`);
  }

  const allOrgs = await response.json();
  const org = allOrgs.find((o) => o._id === orgId);

  if (!org) {
    throw new Error("Organization not found");
  }

  return org;
}

// PUT updated profile → still use update-org-profile.php
async function updateOrgProfile(data) {
  const orgId = getOrgId();
  const response = await fetch(`${DB}/update-org-profile.php`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-org-id": orgId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Update failed");
  }
  return await response.json();
}

// =============================================
// 2. RENDER PROFILE UI
// =============================================
function renderProfileContent() {
  return `
    <div class="profile-container activity-section">
      <div class="profile-grid">
        <!-- Left: Avatar -->
        <div class="left-col">
          <div class="avatar-card">
            <div class="avatar-wrap">
              <img id="org-avatar" src="../../../assets/images/org-photo.png" alt="Organization Photo" />
            </div>
            <label class="upload-btn" for="avatar-input">Upload New Profile</label>
            <input id="avatar-input" type="file" accept="image/*" class="file-input hidden" />
          </div>
        </div>

        <!-- Right: Form -->
        <div class="right-col">
          <section class="card-section basic-info">
            <h3>Basic Information</h3>
            <div class="section-content">
              <label for="official-name">Organization Name <span class="required">*</span></label>
              <input id="official-name" type="text" required />

              <label for="acronym">Acronym / Short Name <span class="required">*</span></label>
              <input id="acronym" type="text" required />

              <label for="org-description">Organization Description</label>
              <textarea id="org-description" rows="3" placeholder="Enter a short description about your organization..."></textarea>

              <label>Official SLU Institution Email</label>
              <div id="slu-email-display" style="padding: 0.75rem; background: #f3f4f6; border-radius: 0.5rem; color: #6b7280; font-size: 0.95rem;"></div>

              <label for="org-type">Type of Organization</label>
              <select id="org-type" required>
                <option value="Academic">Academic</option>
                <option value="Publication">Publication</option>
                <option value="Universal">Universal</option>
              </select>

              <label>Adviser</label>
              <div class="adviser-row">
                <input id="adviser-name" type="text" placeholder="Adviser Name" />
                <input id="adviser-email" type="email" placeholder="Adviser Email" />
              </div>
            </div>
          </section>

          <section class="card-section">
            <h3>Social Media Links</h3>
            <div class="section-content">
              <div class="social-group">
                <label>
                  <span class="social-icon">
                    <img src="../../../assets/images/facebook.png" alt="Facebook Icon" />
                  </span>
                  Facebook
                </label>
                <div id="facebook-list"></div>
                <div class="link-actions">
                  <button id="add-fb-btn" class="small-btn add-more-btn">Add Facebook Link</button>
                </div>
              </div>

              <div class="social-group">
                <label>
                  <span class="social-icon">
                    <img src="../../../assets/images/instagram.png" alt="Instagram Icon" />
                  </span>
                  Instagram
                </label>
                <div id="instagram-list"></div>
                <div class="link-actions">
                  <button id="add-ig-btn" class="small-btn add-more-btn">Add Instagram Link</button>
                </div>
              </div>

              <div class="social-group">
                <label>
                  <span class="social-icon">
                    <img src="../../../assets/images/web.png" alt="Website Icon" />
                  </span>
                  Website
                </label>
                <div id="website-list"></div>
                <div class="link-actions">
                  <button id="add-web-btn" class="small-btn add-more-btn">Add Website Link</button>
                </div>
              </div>
            </div>
          </section>

          <div class="info-note">
            <p>
              <strong>Note:</strong> Any changes made to your profile information are subject to review and approval by the Office of Student Affairs and Services (OSAS).
            </p>
          </div>

          <div class="button-container profile-actions">
            <button id="cancel-btn" class="cancel-btn">Cancel</button>
            <button id="update-btn" class="submit-btn">Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// =============================================
// 3. LINK ROW HELPER
// =============================================
function createLinkRow(value = "", placeholder = "https://example.com") {
  const wrapper = document.createElement("div");
  wrapper.className = "link-row";
  wrapper.innerHTML = `
    <div class="link-input-row">
      <input type="text" class="link-input" placeholder="${placeholder}" value="${value}" />
      <button class="small-btn remove-btn remove-link">Remove</button>
    </div>
  `;
  wrapper
    .querySelector(".remove-link")
    .addEventListener("click", () => wrapper.remove());
  return wrapper;
}

// =============================================
// 4. MAIN: Wire UI + API
// =============================================
async function wireProfileBehaviors() {
  // Render UI
  if (folderBody) {
    folderBody.innerHTML = renderProfileContent();
  }

  // DOM Elements
  const avatarInput = document.getElementById("avatar-input");
  const orgAvatar = document.getElementById("org-avatar");
  const cancelBtn = document.getElementById("cancel-btn");
  const updateBtn = document.getElementById("update-btn");

  const facebookList = document.getElementById("facebook-list");
  const instagramList = document.getElementById("instagram-list");
  const websiteList = document.getElementById("website-list");

  // =============================================
  // 4.1 Fetch & Populate Data
  // =============================================
  let org = {};
  try {
    org = await fetchOrgProfile();
  } catch (err) {
    console.error("Failed to load org data:", err);
    alert("Could not load profile. Using demo mode.");
  }

  // Fill form
  const setValue = (id, value) => {
    const el = document.getElementById(id);
    if (el && value) el.value = value;
  };

  setValue("official-name", org.name);
  setValue("acronym", org.abbreviation);
  setValue("org-description", org.description);
  // Display email as read-only
  const emailDisplay = document.getElementById("slu-email-display");
  if (emailDisplay && org.email) emailDisplay.textContent = org.email;
  setValue("org-type", org.type);
  setValue("adviser-name", org.adviser?.name);
  setValue("adviser-email", org.adviser?.email);

  // Social Links (only first non-empty)
  const getFirst = (field) => (org[field] ? org[field] : "");

  facebookList.appendChild(
    createLinkRow(getFirst("fb_link"), "https://facebook.com/your-page")
  );
  instagramList.appendChild(
    createLinkRow(getFirst("ig_link"), "https://instagram.com/your-handle")
  );
  websiteList.appendChild(
    createLinkRow(getFirst("website_link"), "https://your-website.com")
  );

  // =============================================
  // 4.2 Add More Links
  // =============================================
  document.getElementById("add-fb-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    facebookList.appendChild(
      createLinkRow("", "https://facebook.com/your-page")
    );
  });
  document.getElementById("add-ig-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    instagramList.appendChild(
      createLinkRow("", "https://instagram.com/your-handle")
    );
  });
  document.getElementById("add-web-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    websiteList.appendChild(createLinkRow("", "https://your-website.com"));
  });

  // =============================================
  // 4.3 Avatar Preview
  // =============================================
  if (avatarInput && orgAvatar) {
    avatarInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        orgAvatar.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // =============================================
  // 4.4 Cancel Button
  // =============================================
  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (
      confirm("Are you sure you want to cancel and return to the dashboard?")
    ) {
      window.location.href = "../../../user/org/pages/dashboard.html";
    }
  });

  // =============================================
  // 4.5 Update Profile
  // =============================================
  updateBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    // Required fields
    const official = document.getElementById("official-name");
    const acronym = document.getElementById("acronym");

    if (!official.value.trim()) {
      official.focus();
      alert("Organization name is required.");
      return;
    }
    if (!acronym.value.trim()) {
      acronym.focus();
      alert("Acronym is required.");
      return;
    }

    // Get first non-empty social link
    const getFirstLink = (listId) => {
      const inputs = document.querySelectorAll(`#${listId} .link-input`);
      for (const input of inputs) {
        if (input.value.trim()) return input.value.trim();
      }
      return "";
    };

    const payload = {
      name: official.value.trim(),
      abbreviation: acronym.value.trim(),
      email: org.email, // Email cannot be changed
      department: org.department || "SAMCIS",
      type: document.getElementById("org-type").value,
      adviser: {
        name: document.getElementById("adviser-name").value.trim(),
        email: document.getElementById("adviser-email").value.trim(),
      },
      description: document.getElementById("org-description").value.trim(),
      fb_link: getFirstLink("facebook-list"),
      ig_link: getFirstLink("instagram-list"),
      website_link: getFirstLink("website-list"),
    };

    try {
      const result = await updateOrgProfile(payload);
      alert("Profile update submitted! It will be reviewed by OSAS.");
      console.log("Update success:", result);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to submit update. Check console for details.");
    }
  });
}

// =============================================
// 5. INIT
// =============================================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Authenticate
    await protectPage("org");

    // Fetch organization details and update name
    const org = await fetchOrgProfile();
    const nameSpan = document.querySelector(".welcome span");
    if (nameSpan) {
      nameSpan.textContent = org.abbreviation;
    }

    // Initialize the rest of the page
    await wireProfileBehaviors();
  } catch (err) {
    console.error("Failed to initialize:", err);
  }
});
