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
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  // Set display size
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  // Set actual size in memory
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const values = departments.map((d) => deptCount[d]);
  const maxVal = Math.max(...values, 1);
  
  // Calculate dimensions based on canvas size
  const padding = { top: 40, right: 20, bottom: 60, left: 50 };
  const chartWidth = rect.width - padding.left - padding.right;
  const chartHeight = rect.height - padding.top - padding.bottom;
  const barCount = departments.length;
  const barWidth = Math.min(40, (chartWidth / barCount) * 0.6);
  const barGap = (chartWidth - barWidth * barCount) / (barCount + 1);
  const baseY = rect.height - padding.bottom;

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grid + Y-axis
  ctx.textAlign = "right";
  ctx.font = "12px Poppins";
  ctx.strokeStyle = "#e5e7eb";
  ctx.fillStyle = "#6b7280";
  
  for (let i = 0; i <= 5; i++) {
    const y = baseY - (i * chartHeight) / 5;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(rect.width - padding.right, y);
    ctx.stroke();
    ctx.fillText(Math.round((maxVal / 5) * i), padding.left - 8, y + 4);
  }

  // Bars
  const colors = ["#FFD700", "#FF3B30", "#007AFF", "#34C759", "#9B59B6"];
  values.forEach((val, i) => {
    const x = padding.left + barGap + i * (barWidth + barGap);
    const h = (val / maxVal) * chartHeight;
    const y = baseY - h;

    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, baseY - y, 12);
    ctx.fill();

    // Value label
    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.font = "bold 13px Poppins";
    ctx.fillText(val, x + barWidth / 2, y - 8);
    
    // Department label
    ctx.fillStyle = "#374151";
    ctx.font = "12px Poppins";
    ctx.fillText(departments[i], x + barWidth / 2, baseY + 20);
  });
}

// === DONUT CHART ===
function drawDonutChart(activities) {
  const canvas = document.getElementById("sdgChart");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  // Set display size
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  // Set actual size in memory
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  
  // Calculate dimensions
  const cx = rect.width / 2;
  const cy = (rect.height - 60) / 2;  // Account for legend space
  const radius = Math.min(cx - 60, cy - 60);
  const cutout = radius * 0.6;

  const sdgCount = {};
  activities.forEach((a) =>
    (a.sdgs || []).forEach((s) => (sdgCount[s] = (sdgCount[s] || 0) + 1))
  );
  // Sort SDGs by count
  const sortedEntries = Object.entries(sdgCount).sort((a, b) => b[1] - a[1]);
  const labels = sortedEntries.map(([label]) => label);
  const data = sortedEntries.map(([_, count]) => count);
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

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw donut segments
  let start = -Math.PI / 2;
  data.forEach((val, i) => {
    const angle = (val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.fillStyle = colors[i % colors.length];
    ctx.arc(cx, cy, radius, start, start + angle);
    ctx.closePath();
    ctx.fill();
    
    // Add percentage label if segment is large enough
    const percent = ((val / total) * 100).toFixed(0);
    if (percent > 5) {  // Only show label if segment is > 5%
      const midAngle = start + angle / 2;
      const labelRadius = radius * 0.8;  // Position label at 80% of radius
      const x = cx + Math.cos(midAngle) * labelRadius;
      const y = cy + Math.sin(midAngle) * labelRadius;
      
      ctx.font = "bold 12px Poppins";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(percent + "%", x, y);
    }
    
    start += angle;
  });

  // Cutout
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.arc(cx, cy, cutout, 0, Math.PI * 2);
  ctx.fill();

  // Center text with count
  ctx.font = "bold 18px Poppins";
  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SDG Focus", cx, cy - 12);
  ctx.font = "bold 24px Poppins";
  ctx.fillText(total.toString(), cx, cy + 12);
  ctx.font = "12px Poppins";
  ctx.fillText("Total", cx, cy + 30);

  // Legend
  const legendY = rect.height - 50;  // Fixed position from bottom
  const legendItemWidth = Math.min(200, rect.width / 2);
  const legendItemHeight = 20;
  const legendColumns = Math.floor(rect.width / legendItemWidth);
  
  ctx.font = "13px Poppins";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  
  labels.forEach((l, i) => {
    const column = i % legendColumns;
    const row = Math.floor(i / legendColumns);
    const x = 30 + column * legendItemWidth;
    const y = legendY + row * legendItemHeight;
    
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, y - 5, 10, 10);
    
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
