// ---- ADMIN Dashboard ----
async function loadAdminDashboard() {
  // Load JSON files
  const activitiesRes = await fetch("../../../data/activities.json");
  const orgsRes = await fetch("../../../data/student_organizations.json");

  if (!activitiesRes.ok || !orgsRes.ok) {
    console.error("Failed to load JSON files. Check your file paths.");
    return;
  }

  const activities = await activitiesRes.json();
  const orgs = await orgsRes.json();

  // ======= COUNTERS =======
  const totalDeliverables = activities.length;
  const approvedDeliverables = activities.filter(a => a.status?.toLowerCase() === "approved").length;
  const returnedDeliverables = activities.filter(a =>
    ["pending", "revise"].includes(a.status?.toLowerCase())
  ).length;
  const organizationsRecognized = orgs.length;

  // Insert dashboard HTML (same structure/design)
  document.querySelector("#folder-body").innerHTML = `
    <div class="grid-container">
      <!-- Small cards -->
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="first">${totalDeliverables}</p>
            <p class="desc">Total Deliverables Submitted</p>
          </div>
          <div class="right-icon">
            <img src="../../../assets/images/deliverables.png" alt="Submissions icon" class="card-icon" />
          </div>
        </div>
      </div>
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="second">${approvedDeliverables}</p>
            <p class="desc">Approved Deliverables</p>
          </div>
          <div class="right-icon">
            <img src="../../../assets/images/check-icon.png" alt="Check icon" class="card-icon" />
          </div>
        </div>
      </div>
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="third">${returnedDeliverables}</p>
            <p class="desc">Returned Deliverables</p>
          </div>
          <div class="right-icon">
            <img src="../../../assets/images/close-icon.png" alt="Close icon" class="card-icon" />
          </div>
        </div>
      </div>
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="fourth">${organizationsRecognized}</p>
            <p class="desc">Organizations Recognized</p>
          </div>
          <div class="right-icon">
            <img src="../../../assets/images/organization.png" alt="Organizations icon" class="card-icon" />
          </div>
        </div>
      </div>

      <!-- Approved Activities per Department -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Approved Activities per Department</h3>
          <canvas id="activitiesChart" width="500" height="380"></canvas>
        </div>
      </div>

      <!-- Top SDGs -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Top SDGs Used</h3>
          <canvas id="sdgChart" width="500" height="380"></canvas>
        </div>
      </div>
    </div>
  `;

  // ======= DEPARTMENT BAR CHART (Dynamic + show zero values) =======
  const departments = ["SAMCIS", "SEA", "SONAHBS", "STELA", "SOM"]; // fixed list
  const deptCount = {};
  departments.forEach(d => (deptCount[d] = 0));

  activities
    .filter(a => a.status?.toLowerCase() === "approved")
    .forEach(a => {
      const org = orgs.find(o => o._id?.$oid === a.org_id?.$oid);
      const dept = org ? org.department : null;
      if (dept && deptCount.hasOwnProperty(dept)) {
        deptCount[dept]++;
      }
    });

  const labels1 = departments;
  const values1 = labels1.map(d => deptCount[d]);
  const colors1 = ["#FFD700", "#FF3B30", "#007AFF", "#34C759", "#9B59B6"];

  // ===== BAR CHART DESIGN (same as original) =====
  const canvas1 = document.getElementById("activitiesChart");
  const ctx1 = canvas1.getContext("2d");
  const chartHeight = 300;
  const barWidth = 60;
  const gap = 60;
  const baseY = 350;
  const maxVal = Math.max(...values1) || 1;
  const offsetX = 40;

  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx1.font = "bold 14px Poppins";
  ctx1.textAlign = "center";

  // Grid lines
  ctx1.strokeStyle = "#e5e7eb";
  ctx1.lineWidth = 1;
  ctx1.beginPath();
  for (let i = 0; i <= 5; i++) {
    const y = baseY - (i * chartHeight) / 5;
    ctx1.moveTo(offsetX, y);
    ctx1.lineTo(500, y);
  }
  ctx1.stroke();

  // Y-axis values
  ctx1.fillStyle = "#6b7280";
  for (let i = 0; i <= 5; i++) {
    const y = baseY - (i * chartHeight) / 5;
    const val = Math.round((maxVal / 5) * i);
    ctx1.fillText(val, offsetX - 15, y + 5);
  }

  const barRects = [];

  labels1.forEach((label, i) => {
    const x = 70 + i * (barWidth + gap) + offsetX - 60;
    const barHeight = (values1[i] / maxVal) * chartHeight;
    const y = baseY - barHeight;

    const radius = 12;
    ctx1.beginPath();
    ctx1.moveTo(x, y + radius);
    ctx1.lineTo(x, baseY);
    ctx1.lineTo(x + barWidth, baseY);
    ctx1.lineTo(x + barWidth, y + radius);
    ctx1.quadraticCurveTo(x + barWidth, y, x + barWidth - radius, y);
    ctx1.lineTo(x + radius, y);
    ctx1.quadraticCurveTo(x, y, x, y + radius);
    ctx1.closePath();

    ctx1.fillStyle = colors1[i];
    ctx1.fill();

    ctx1.fillStyle = "#111827";
    ctx1.fillText(values1[i], x + barWidth / 2, y - 10);
    ctx1.fillStyle = "#374151";
    ctx1.fillText(label, x + barWidth / 2, baseY + 25);

    barRects.push({ x, y, width: barWidth, height: barHeight, label, value: values1[i] });
  });

  // Tooltip for bar chart
  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.padding = "6px 10px";
  tooltip.style.background = "#111827";
  tooltip.style.color = "#fff";
  tooltip.style.font = "13px Poppins";
  tooltip.style.borderRadius = "6px";
  tooltip.style.pointerEvents = "none";
  tooltip.style.opacity = 0;
  tooltip.style.transition = "opacity 0.15s ease";
  document.body.appendChild(tooltip);

  canvas1.addEventListener("mousemove", (e) => {
    const rect = canvas1.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let hovered = false;
    barRects.forEach(bar => {
      if (mouseX >= bar.x && mouseX <= bar.x + bar.width && mouseY >= bar.y && mouseY <= baseY) {
        tooltip.innerHTML = `${bar.label}: <b>${bar.value} activities</b>`;
        tooltip.style.left = `${e.pageX + 12}px`;
        tooltip.style.top = `${e.pageY - 30}px`;
        tooltip.style.opacity = 1;
        hovered = true;
      }
    });
    if (!hovered) tooltip.style.opacity = 0;
  });

  // ===== DONUT CHART (Dynamic SDGs) =====
  const canvas2 = document.getElementById("sdgChart");
  const ctx2 = canvas2.getContext("2d");

  const sdgCount = {};
  activities.forEach(a => {
    (a.sdgs || []).forEach(sdg => {
      sdgCount[sdg] = (sdgCount[sdg] || 0) + 1;
    });
  });

  const labels2 = Object.keys(sdgCount);
  const data2 = Object.values(sdgCount);
  const colors2 = [
    "#E5233D","#DDA73A","#4CA146","#C5192D","#EF402C",
    "#27BFE6","#FBC412","#A31C44","#F26A2D","#E01483",
    "#C49631","#56C02B","#00689D","#19486A","#DD1367"
  ];

  const cx = canvas2.width / 2;
  const cy = canvas2.height / 2 - 25;
  const radius = 120;
  const cutout = 70;
  const total = data2.reduce((a, b) => a + b, 0);
  let startAngle = -Math.PI / 2;
  const slices = [];

  data2.forEach((val, i) => {
    const sliceAngle = (val / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;
    ctx2.beginPath();
    ctx2.moveTo(cx, cy);
    ctx2.fillStyle = colors2[i % colors2.length];
    ctx2.arc(cx, cy, radius, startAngle, endAngle);
    ctx2.closePath();
    ctx2.fill();
    slices.push({ startAngle, endAngle, label: labels2[i], value: val });
    startAngle = endAngle;
  });

  // Inner cutout
  ctx2.beginPath();
  ctx2.fillStyle = "#fff";
  ctx2.arc(cx, cy, cutout, 0, Math.PI * 2);
  ctx2.fill();

  // Center label
  ctx2.font = "bold 18px Poppins";
  ctx2.fillStyle = "#111827";
  ctx2.textAlign = "center";
  ctx2.fillText("SDG Focus", cx, cy + 6);

  // Legend
  ctx2.font = "13px Poppins";
  ctx2.textAlign = "left";
  labels2.forEach((label, i) => {
    const x = 30 + (i % 2) * 200;
    const y = 330 + Math.floor(i / 2) * 20;
    ctx2.fillStyle = colors2[i % colors2.length];
    ctx2.fillRect(x, y - 9, 10, 10);
    ctx2.fillStyle = "#374151";
    ctx2.fillText(label, x + 18, y);
  });

  // Tooltip for donut chart
  canvas2.addEventListener("mousemove", (e) => {
    const rect = canvas2.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - cx;
    const dy = y - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    let a = angle < -Math.PI / 2 ? angle + 2 * Math.PI : angle;

    let found = false;
    if (distance < radius && distance > cutout) {
      slices.forEach(slice => {
        if (a >= slice.startAngle && a < slice.endAngle) {
          tooltip.innerHTML = `${slice.label}: <b>${slice.value} activities</b>`;
          tooltip.style.left = `${e.pageX + 12}px`;
          tooltip.style.top = `${e.pageY - 30}px`;
          tooltip.style.opacity = 1;
          found = true;
        }
      });
    }
    if (!found) tooltip.style.opacity = 0;
  });
}

// ---- INITIALIZER ----
function initDashboard() {
  loadAdminDashboard();
}
initDashboard();
// ---- ADMIN Dashboard ----
async function loadAdminDashboard() {
  // Load JSON files
  const activitiesRes = await fetch("../../../data/activities.json");
  const orgsRes = await fetch("../../../data/student_organizations.json");

  if (!activitiesRes.ok || !orgsRes.ok) {
    console.error("❌ Failed to load JSON files. Check your file paths.");
    return;
  }

  const activities = await activitiesRes.json();
  const orgs = await orgsRes.json();

  // ======= COUNTERS =======
  const totalDeliverables = activities.length;
  const approvedDeliverables = activities.filter(a => a.status?.toLowerCase() === "approved").length;
  const returnedDeliverables = activities.filter(a =>
    ["pending", "revise"].includes(a.status?.toLowerCase())
  ).length;
  const organizationsRecognized = orgs.length;

  // Insert dashboard HTML (same structure/design)
  document.querySelector("#folder-body").innerHTML = `
    <div class="grid-container">
      <!-- Small cards -->
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="first">${totalDeliverables}</p>
            <p class="desc">Total Deliverables Submitted</p>
          </div>
          <div class="right-icon">
            <img src="../../../assets/images/deliverables.png" alt="Submissions icon" class="card-icon" />
          </div>
        </div>
      </div>
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="second">${approvedDeliverables}</p>
            <p class="desc">Approved Deliverables</p>
          </div>
          <div class="right-icon">
            <img src="../../../assets/images/check-icon.png" alt="Check icon" class="card-icon" />
          </div>
        </div>
      </div>
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="third">${returnedDeliverables}</p>
            <p class="desc">Returned Deliverables</p>
          </div>
          <div class="right-icon">
            <img src="../../../assets/images/close-icon.png" alt="Close icon" class="card-icon" />
          </div>
        </div>
      </div>
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="fourth">${organizationsRecognized}</p>
            <p class="desc">Organizations Recognized</p>
          </div>
          <div class="right-icon">
            <img src="../../../assets/images/organization.png" alt="Organizations icon" class="card-icon" />
          </div>
        </div>
      </div>

      <!-- Approved Activities per Department -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Approved Activities per Department</h3>
          <canvas id="activitiesChart" width="500" height="380"></canvas>
        </div>
      </div>

      <!-- Top SDGs -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Top SDGs Used</h3>
          <canvas id="sdgChart" width="500" height="380"></canvas>
        </div>
      </div>
    </div>
  `;

  // ======= DEPARTMENT BAR CHART (Dynamic + show zero values) =======
  const departments = ["SAMCIS", "SEA", "SONAHBS", "STELA", "SOM"]; // fixed list
  const deptCount = {};
  departments.forEach(d => (deptCount[d] = 0));

  activities
    .filter(a => a.status?.toLowerCase() === "approved")
    .forEach(a => {
      const org = orgs.find(o => o._id?.$oid === a.org_id?.$oid);
      const dept = org ? org.department : null;
      if (dept && deptCount.hasOwnProperty(dept)) {
        deptCount[dept]++;
      }
    });

  const labels1 = departments;
  const values1 = labels1.map(d => deptCount[d]);
  const colors1 = ["#FFD700", "#FF3B30", "#007AFF", "#34C759", "#9B59B6"];

  // ===== BAR CHART DESIGN (same as original) =====
  const canvas1 = document.getElementById("activitiesChart");
  const ctx1 = canvas1.getContext("2d");
  const chartHeight = 300;
  const barWidth = 60;
  const gap = 60;
  const baseY = 350;
  const maxVal = Math.max(...values1) || 1;
  const offsetX = 40;

  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx1.font = "bold 14px Poppins";
  ctx1.textAlign = "center";

  // Grid lines
  ctx1.strokeStyle = "#e5e7eb";
  ctx1.lineWidth = 1;
  ctx1.beginPath();
  for (let i = 0; i <= 5; i++) {
    const y = baseY - (i * chartHeight) / 5;
    ctx1.moveTo(offsetX, y);
    ctx1.lineTo(500, y);
  }
  ctx1.stroke();

  // Y-axis values
  ctx1.fillStyle = "#6b7280";
  for (let i = 0; i <= 5; i++) {
    const y = baseY - (i * chartHeight) / 5;
    const val = Math.round((maxVal / 5) * i);
    ctx1.fillText(val, offsetX - 15, y + 5);
  }

  const barRects = [];

  labels1.forEach((label, i) => {
    const x = 70 + i * (barWidth + gap) + offsetX - 60;
    const barHeight = (values1[i] / maxVal) * chartHeight;
    const y = baseY - barHeight;

    const radius = 12;
    ctx1.beginPath();
    ctx1.moveTo(x, y + radius);
    ctx1.lineTo(x, baseY);
    ctx1.lineTo(x + barWidth, baseY);
    ctx1.lineTo(x + barWidth, y + radius);
    ctx1.quadraticCurveTo(x + barWidth, y, x + barWidth - radius, y);
    ctx1.lineTo(x + radius, y);
    ctx1.quadraticCurveTo(x, y, x, y + radius);
    ctx1.closePath();

    ctx1.fillStyle = colors1[i];
    ctx1.fill();

    ctx1.fillStyle = "#111827";
    ctx1.fillText(values1[i], x + barWidth / 2, y - 10);
    ctx1.fillStyle = "#374151";
    ctx1.fillText(label, x + barWidth / 2, baseY + 25);

    barRects.push({ x, y, width: barWidth, height: barHeight, label, value: values1[i] });
  });

  // Tooltip for bar chart
  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.padding = "6px 10px";
  tooltip.style.background = "#111827";
  tooltip.style.color = "#fff";
  tooltip.style.font = "13px Poppins";
  tooltip.style.borderRadius = "6px";
  tooltip.style.pointerEvents = "none";
  tooltip.style.opacity = 0;
  tooltip.style.transition = "opacity 0.15s ease";
  document.body.appendChild(tooltip);

  canvas1.addEventListener("mousemove", (e) => {
    const rect = canvas1.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let hovered = false;
    barRects.forEach(bar => {
      if (mouseX >= bar.x && mouseX <= bar.x + bar.width && mouseY >= bar.y && mouseY <= baseY) {
        tooltip.innerHTML = `${bar.label}: <b>${bar.value} activities</b>`;
        tooltip.style.left = `${e.pageX + 12}px`;
        tooltip.style.top = `${e.pageY - 30}px`;
        tooltip.style.opacity = 1;
        hovered = true;
      }
    });
    if (!hovered) tooltip.style.opacity = 0;
  });

  // ===== DONUT CHART (Dynamic SDGs) =====
  const canvas2 = document.getElementById("sdgChart");
  const ctx2 = canvas2.getContext("2d");

  const sdgCount = {};
  activities.forEach(a => {
    (a.sdgs || []).forEach(sdg => {
      sdgCount[sdg] = (sdgCount[sdg] || 0) + 1;
    });
  });

  const labels2 = Object.keys(sdgCount);
  const data2 = Object.values(sdgCount);
  const colors2 = [
    "#E5233D","#DDA73A","#4CA146","#C5192D","#EF402C",
    "#27BFE6","#FBC412","#A31C44","#F26A2D","#E01483",
    "#C49631","#56C02B","#00689D","#19486A","#DD1367"
  ];

  const cx = canvas2.width / 2;
  const cy = canvas2.height / 2 - 25;
  const radius = 120;
  const cutout = 70;
  const total = data2.reduce((a, b) => a + b, 0);
  let startAngle = -Math.PI / 2;
  const slices = [];

  data2.forEach((val, i) => {
    const sliceAngle = (val / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;
    ctx2.beginPath();
    ctx2.moveTo(cx, cy);
    ctx2.fillStyle = colors2[i % colors2.length];
    ctx2.arc(cx, cy, radius, startAngle, endAngle);
    ctx2.closePath();
    ctx2.fill();
    slices.push({ startAngle, endAngle, label: labels2[i], value: val });
    startAngle = endAngle;
  });

  // Inner cutout
  ctx2.beginPath();
  ctx2.fillStyle = "#fff";
  ctx2.arc(cx, cy, cutout, 0, Math.PI * 2);
  ctx2.fill();

  // Center label
  ctx2.font = "bold 18px Poppins";
  ctx2.fillStyle = "#111827";
  ctx2.textAlign = "center";
  ctx2.fillText("SDG Focus", cx, cy + 6);

  // Legend
  ctx2.font = "13px Poppins";
  ctx2.textAlign = "left";
  labels2.forEach((label, i) => {
    const x = 30 + (i % 2) * 200;
    const y = 330 + Math.floor(i / 2) * 20;
    ctx2.fillStyle = colors2[i % colors2.length];
    ctx2.fillRect(x, y - 9, 10, 10);
    ctx2.fillStyle = "#374151";
    ctx2.fillText(label, x + 18, y);
  });

  // Tooltip for donut chart
  canvas2.addEventListener("mousemove", (e) => {
    const rect = canvas2.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - cx;
    const dy = y - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    let a = angle < -Math.PI / 2 ? angle + 2 * Math.PI : angle;

    let found = false;
    if (distance < radius && distance > cutout) {
      slices.forEach(slice => {
        if (a >= slice.startAngle && a < slice.endAngle) {
          tooltip.innerHTML = `${slice.label}: <b>${slice.value} activities</b>`;
          tooltip.style.left = `${e.pageX + 12}px`;
          tooltip.style.top = `${e.pageY - 30}px`;
          tooltip.style.opacity = 1;
          found = true;
        }
      });
    }
    if (!found) tooltip.style.opacity = 0;
  });
}

// ---- INITIALIZER ----
function initDashboard() {
  loadAdminDashboard();
}
initDashboard();