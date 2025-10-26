const folderBody = document.getElementById('folder-body');

// Fetch organization data (simulation for ICON)
async function fetchOrganizations() {
  try {
    const response = await fetch("../../../data/student_organizations.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Could not fetch organization data:", error);
    return null;
  }
}

// Template builder for the profile content
function renderProfileContent() {
  return `
    <div class="profile-container activity-section">
      <div class="profile-grid">
        <div class="left-col">
          <div class="avatar-card">
            <div class="avatar-wrap">
              <img id="org-avatar" src="../../../assets/images/org-photo.png" alt="Organization Photo" />
            </div>
            <label class="upload-btn" for="avatar-input">Upload New Profile</label>
            <input id="avatar-input" type="file" accept="image/*" class="file-input hidden" />
          </div>
        </div>

        <div class="right-col">
          <section class="card-section basic-info">
            <h3>Basic Information</h3>
            <div class="section-content">
              <label for="official-name">Organization Name</label>
              <input id="official-name" type="text" required />

              <label for="acronym">Acronym / Short Name</label>
              <input id="acronym" type="text" required />

              <label for="org-description">Organization Description</label>
              <textarea id="org-description" rows="3" placeholder="Enter a short description about your organization..."></textarea>

              <label for="department">Department</label>
              <select id="department" required>
                <option value="SAMCIS">School of Accountancy, Management, Computing and Information Studies | SAMCIS</option>
                <option value="SEA">School of Engineering and Architecture | SEA</option>
                <option value="SOL">School of Law | SOL</option>
                <option value="SOM">School of Medicine | SOM</option>
                <option value="SONAHBS">School of Nursing, Allied Health, and Biological Sciences Natural Sciences | SONAHBS</option>
                <option value="STELA">School of Teacher Education and Liberal Arts | STELA</option>
              </select>

              <label for="slu-email">Official SLU Institution Email</label>
              <input id="slu-email" type="email" required />

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
              Any changes made to your profile information are subject to review and approval by the Office of Student Affairs and Services (OSAS).
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

// Inject content
if (folderBody) {
  folderBody.innerHTML = renderProfileContent();
}

// Helper to create a link row
function createLinkRow(value = '', placeholder = 'https://example.com') {
  const wrapper = document.createElement('div');
  wrapper.className = 'link-row';
  wrapper.innerHTML = `
    <div class="link-input-row">
      <input type="text" class="link-input" placeholder="${placeholder}" value="${value}" />
      <button class="small-btn remove-btn remove-link">Remove</button>
    </div>
  `;
  wrapper.querySelector('.remove-link').addEventListener('click', () => wrapper.remove());
  return wrapper;
}

// Wire interactive elements and populate data
async function wireProfileBehaviors() {
  const orgData = await fetchOrganizations();
  const org = orgData?.find(o => o._id.$oid === "6716001a9b8c2001abcd0001"); // ICON as default logged in org

  const avatarInput = document.getElementById('avatar-input');
  const orgAvatar = document.getElementById('org-avatar');
  const cancelBtn = document.getElementById('cancel-btn');
  const updateBtn = document.getElementById('update-btn');

  const facebookList = document.getElementById('facebook-list');
  const instagramList = document.getElementById('instagram-list');
  const websiteList = document.getElementById('website-list');

  facebookList.appendChild(createLinkRow(org?.fb_link || '', 'https://facebook.com/your-page'));
  instagramList.appendChild(createLinkRow(org?.ig_link || '', 'https://instagram.com/your-handle'));
  websiteList.appendChild(createLinkRow(org?.website_link || '', 'https://your-website.com'));

  // Prefill fields if data is available
  if (org) {
    document.getElementById('official-name').value = org.name || '';
    document.getElementById('acronym').value = org.abbreviation || '';
    document.getElementById('org-description').value = org.description || '';
    document.getElementById('department').value = org.department || '';
    document.getElementById('slu-email').value = org.email || '';
    document.getElementById('org-type').value = org.type || '';
    document.getElementById('adviser-name').value = org.adviser?.name || '';
    document.getElementById('adviser-email').value = org.adviser?.email || '';
  }

  // Image preview
  if (avatarInput && orgAvatar) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        orgAvatar.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Add link buttons
  document.getElementById('add-fb-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    facebookList.appendChild(createLinkRow('', 'https://facebook.com/your-page'));
  });
  document.getElementById('add-ig-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    instagramList.appendChild(createLinkRow('', 'https://instagram.com/your-handle'));
  });
  document.getElementById('add-web-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    websiteList.appendChild(createLinkRow('', 'https://your-website.com'));
  });

  // Cancel button
  cancelBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const confirmExit = confirm("Are you sure you want to cancel and return to the dashboard?");
    if (confirmExit) {
      window.location.href = "../../../user/org/pages/dashboard.html";
    }
  });

  // Update button
  updateBtn?.addEventListener('click', (e) => {
    e.preventDefault();

    const official = document.getElementById('official-name');
    const acronym = document.getElementById('acronym');
    const email = document.getElementById('slu-email');

    if (!official.value.trim()) { official.focus(); alert('Organization name is required.'); return; }
    if (!acronym.value.trim()) { acronym.focus(); alert('Acronym is required.'); return; }
    if (!email.value.trim()) { email.focus(); alert('Official SLU email is required.'); return; }

    alert("Your updated profile information will be reviewed by the Office of Student Affairs and Services (OSAS) before final approval.");
  });
}

// Initialize behaviors after DOM injection
wireProfileBehaviors();
