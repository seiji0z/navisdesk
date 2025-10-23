const folderBody = document.getElementById('folder-body');

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
              <label for="official-name">Official name</label>
              <input id="official-name" type="text" required />

              <label for="acronym">Acronym</label>
              <input id="acronym" type="text" required />

              <label for="slu-email">SLU Email</label>
              <input id="slu-email" type="email" required />
            </div>
          </section>

          <section class="card-section">
            <h3>Social Media Links</h3>
            <div class="section-content">
              <div class="social-group">
                <label><span class="social-icon"><!-- placeholder SVG -->
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#6B7280" stroke-width="1.2"/><path d="M8 12h8" stroke="#6B7280" stroke-width="1.2" stroke-linecap="round"/></svg>
                  </span>Facebook</label>
                <div id="facebook-list"><!-- facebook link rows --></div>
                <div class="link-actions">
                  <button id="add-fb-btn" class="small-btn add-more-btn">Add Facebook Link</button>
                </div>
              </div>

              <div class="social-group">
                <label><span class="social-icon"><!-- placeholder SVG -->
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#6B7280" stroke-width="1.2"/><path d="M7 7l10 10" stroke="#6B7280" stroke-width="1.2" stroke-linecap="round"/></svg>
                  </span>Instagram</label>
                <div id="instagram-list"><!-- instagram link rows --></div>
                <div class="link-actions">
                  <button id="add-ig-btn" class="small-btn add-more-btn">Add Instagram Link</button>
                </div>
              </div>

              <div class="social-group">
                <label><span class="social-icon"><!-- placeholder SVG -->
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#6B7280" stroke-width="1.2"/><path d="M12 7v10" stroke="#6B7280" stroke-width="1.2" stroke-linecap="round"/></svg>
                  </span>Website</label>
                <div id="website-list"><!-- website link rows --></div>
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
  // wire remove
  wrapper.querySelector('.remove-link').addEventListener('click', () => wrapper.remove());
  return wrapper;
}

// After injection, wire interactive elements
function wireProfileBehaviors() {
  const avatarInput = document.getElementById('avatar-input');
  const orgAvatar = document.getElementById('org-avatar');
  const cancelBtn = document.getElementById('cancel-btn');
  const updateBtn = document.getElementById('update-btn');
  // (no generic linksList anymore) 

  // initial state
  const initialState = {
    avatarSrc: orgAvatar ? orgAvatar.src : '',
    officialName: '',
    acronym: '',
    sluEmail: '',
    facebook: [],
    instagram: [],
    website: []
  };

  // References to the three lists
  const facebookList = document.getElementById('facebook-list');
  const instagramList = document.getElementById('instagram-list');
  const websiteList = document.getElementById('website-list');

  // ensure each list starts with one empty input
  facebookList.appendChild(createLinkRow('', 'https://facebook.com/your-page'));
  instagramList.appendChild(createLinkRow('', 'https://instagram.com/your-handle'));
  websiteList.appendChild(createLinkRow('', 'https://your-website.com'));

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

  // Add link handlers for each social type
  const addFbBtn = document.getElementById('add-fb-btn');
  const addIgBtn = document.getElementById('add-ig-btn');
  const addWebBtn = document.getElementById('add-web-btn');

  if (addFbBtn) {
    addFbBtn.addEventListener('click', (e) => {
      e.preventDefault();
      facebookList.appendChild(createLinkRow('', 'https://facebook.com/your-page'));
    });
  }
  if (addIgBtn) {
    addIgBtn.addEventListener('click', (e) => {
      e.preventDefault();
      instagramList.appendChild(createLinkRow('', 'https://instagram.com/your-handle'));
    });
  }
  if (addWebBtn) {
    addWebBtn.addEventListener('click', (e) => {
      e.preventDefault();
      websiteList.appendChild(createLinkRow('', 'https://your-website.com'));
    });
  }

  // Cancel: reset fields and avatar
  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('official-name').value = initialState.officialName;
      document.getElementById('acronym').value = initialState.acronym;
      document.getElementById('slu-email').value = initialState.sluEmail;
      // reset social lists to one empty input each
      if (facebookList) {
        facebookList.innerHTML = '';
        facebookList.appendChild(createLinkRow('', 'https://facebook.com/your-page'));
      }
      if (instagramList) {
        instagramList.innerHTML = '';
        instagramList.appendChild(createLinkRow('', 'https://instagram.com/your-handle'));
      }
      if (websiteList) {
        websiteList.innerHTML = '';
        websiteList.appendChild(createLinkRow('', 'https://your-website.com'));
      }
      if (orgAvatar) orgAvatar.src = initialState.avatarSrc;
      if (avatarInput) avatarInput.value = '';
    });
  }

  // Update: validate required fields and show success alert
  if (updateBtn) {
    updateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const official = document.getElementById('official-name');
      const acronym = document.getElementById('acronym');
      const email = document.getElementById('slu-email');

      if (!official.value.trim()) { official.focus(); alert('Official name is required.'); return; }
      if (!acronym.value.trim()) { acronym.focus(); alert('Acronym is required.'); return; }
      if (!email.value.trim()) { email.focus(); alert('SLU Email is required.'); return; }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) { email.focus(); alert('Please enter a valid email address.'); return; }

      // collect link values per social type
      const fbValues = Array.from(facebookList.querySelectorAll('.link-input')).map(i => i.value.trim()).filter(Boolean);
      const igValues = Array.from(instagramList.querySelectorAll('.link-input')).map(i => i.value.trim()).filter(Boolean);
      const webValues = Array.from(websiteList.querySelectorAll('.link-input')).map(i => i.value.trim()).filter(Boolean);

      // Here you'd send the data to the backend. For now, just log and show success.
      console.log('facebook', fbValues);
      console.log('instagram', igValues);
      console.log('website', webValues);

      alert('Profile updated successfully.');
    });
  }
}

// Initialize behaviors after DOM injection
wireProfileBehaviors();

// Expose nothing; module keeps page scope clean
