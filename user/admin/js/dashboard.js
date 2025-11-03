import { protectPage } from "../../../js/auth-guard.js";

// Wait for DOM + Auth
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await protectPage("admin");
    console.log("Admin logged in. Loading dashboard...");

    // NOW load the dashboard
    await loadAdminDashboard();
  } catch (err) {
    console.error("Access denied or error:", err);
    document.body.innerHTML = "<h1>Access Denied</h1>";
  }
});

async function loadAdminDashboard() {
  try {
    // === CHANGED: Fetch from PHP (Local MongoDB) instead of JSON files ===
    const [activitiesRes, orgsRes] = await Promise.all([
      fetch("../../../server/php/get-activities.php", {
        credentials: 'include'
      }),
      fetch("../../../server/php/get-student-orgs.php", {
        credentials: 'include'
      }),
    ]);

    if (!activitiesRes.ok || !orgsRes.ok) {
      throw new Error("Failed to load data");
    }

    const activities = await activitiesRes.json();
    const orgs = await orgsRes.json();

    // === COUNTERS ===
    const total = activities.length;
    const approved = activities.filter(
      (a) => a.status?.toLowerCase() === "approved"
    ).length;
    const returned = activities.filter((a) =>
      ["pending", "revise"].includes(a.status?.toLowerCase())
    ).length;
    const orgCount = orgs.length;

    // === INJECT HTML ===
    document.getElementById("folder-body").innerHTML = `
      <div class="grid-container">
        <div class="grid-item small"><div class="card">
          <div class="left-details"><p class="number">${total}</p><p class="desc">Total Deliverables</p></div>
          <div class="right-icon"><img src="../../../assets/images/deliverables.png" class="card-icon"></div>
        </div></div>
        <div class="grid-item small"><div class="card">
          <div class="left-details"><p class="number">${approved}</p><p class="desc">Approved</p></div>
          <div class="right-icon"><img src="../../../assets/images/check-icon.png" class="card-icon"></div>
        </div></div>
        <div class="grid-item small"><div class="card">
          <div class="left-details"><p class="number">${returned}</p><p class="desc">Returned</p></div>
          <div class="right-icon"><img src="../../../assets/images/close-icon.png" class="card-icon"></div>
        </div></div>
        <div class="grid-item small"><div class="card">
          <div class="left-details"><p class="number">${orgCount}</p><p class="desc">Organizations</p></div>
          <div class="right-icon"><img src="../../../assets/images/organization.png" class="card-icon"></div>
        </div></div>

        <div class="grid-item medium"><div class="card chart">
          <h3>Approved Activities per Department</h3>
          <canvas id="activitiesChart" width="500" height="380"></canvas>
        </div></div>
        <div class="grid-item medium"><div class="card chart">
          <h3>Top SDGs Used</h3>
          <canvas id="sdgChart" width="500" height="380"></canvas>
        </div></div>
      </div>
    `;

    // === DRAW CHARTS ===
    drawBarChart(activities, orgs);
    drawDonutChart(activities);
  } catch (err) {
    console.error("Dashboard load error:", err);
    document.getElementById("folder-body").innerHTML =
      "<p>Error loading dashboard.</p>";
  }
}

// === BAR CHART ===
function drawBarChart(activities, orgs) {
  const departments = ["SAMCIS", "SEA", "SONAHBS", "STELA", "SOM"];
  const deptCount = Object.fromEntries(departments.map((d) => [d, 0]));

  activities
    .filter((a) => a.status?.toLowerCase() === "approved")
    .forEach((a) => {
      const org = orgs.find((o) => o._id?.$oid === a.org_id?.$oid);
      if (org?.department && deptCount.hasOwnProperty(org.department)) {
        deptCount[org.department]++;
      }
    });

  const canvas = document.getElementById("activitiesChart");
  const ctx = canvas.getContext("2d");
  const values = departments.map((d) => deptCount[d]);
  const maxVal = Math.max(...values, 1);
  const barWidth = 60,
    gap = 60,
    baseY = 350,
    chartHeight = 300;

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grid + Y-axis
  ctx.strokeStyle = "#e5e7eb";
  ctx.fillStyle = "#6b7280";
  for (let i = 0; i <= 5; i++) {
    const y = baseY - (i * chartHeight) / 5;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(500, y);
    ctx.stroke();
    ctx.fillText(Math.round((maxVal / 5) * i), 25, y + 5);
  }

  // Bars
  const colors = ["#FFD700", "#FF3B30", "#007AFF", "#34C759", "#9B59B6"];
  values.forEach((val, i) => {
    const x = 70 + i * (barWidth + gap);
    const h = (val / maxVal) * chartHeight;
    const y = baseY - h;

    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, baseY - y, 12);
    ctx.fill();

    ctx.fillStyle = "#111827";
    ctx.fillText(val, x + barWidth / 2, y - 10);
    ctx.fillStyle = "#374151";
    ctx.fillText(departments[i], x + barWidth / 2, baseY + 25);
  });
}

// === DONUT CHART ===
function drawDonutChart(activities) {
  const canvas = document.getElementById("sdgChart");
  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2,
    cy = canvas.height / 2 - 25;
  const radius = 120,
    cutout = 70;

  const sdgCount = {};
  activities.forEach((a) =>
    (a.sdgs || []).forEach((s) => (sdgCount[s] = (sdgCount[s] || 0) + 1))
  );
  const labels = Object.keys(sdgCount);
  const data = Object.values(sdgCount);
  const colors = [
    "#E5233D",
    "#DDA73A",
    "#4CA146",
    "#C5192D",
    "#EF402C",
    "#27BFE6",
    "#FBC412",
    "#A31C44",
    "#F26A2D",
    "#E01483",
    "#C49631",
    "#56C02B",
    "#00689D",
    "#19486A",
    "#DD1367",
  ];
  const total = data.reduce((a, b) => a + b, 0);

  let start = -Math.PI / 2;
  data.forEach((val, i) => {
    const angle = (val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.fillStyle = colors[i % colors.length];
    ctx.arc(cx, cy, radius, start, start + angle);
    ctx.closePath();
    ctx.fill();
    start += angle;
  });

  // Cutout
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.arc(cx, cy, cutout, 0, Math.PI * 2);
  ctx.fill();

  // Center text
  ctx.font = "bold 18px Poppins";
  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.fillText("SDG Focus", cx, cy + 6);

  // Legend
  ctx.font = "13px Poppins";
  ctx.textAlign = "left";
  labels.forEach((l, i) => {
    const x = 30 + (i % 2) * 200;
    const y = 330 + Math.floor(i / 2) * 20;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, y - 9, 10, 10);
    ctx.fillStyle = "#374151";
    ctx.fillText(l, x + 18, y);
  });
}

// Helper for rounded rect
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  this.beginPath();
  this.moveTo(x + r, y);
  this.lineTo(x + w - r, y);
  this.quadraticCurveTo(x + w, y, x + w, y + r);
  this.lineTo(x + w, y + h - r);
  this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  this.lineTo(x + r, y + h);
  this.quadraticCurveTo(x, y + h, x, y + h - r);
  this.lineTo(x, y + r);
  this.quadraticCurveTo(x, y, x + r, y);
  this.closePath();
};
