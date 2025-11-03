// admin/js/dashboard.js
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
    const [activitiesRes, orgsRes] = await Promise.all([
      fetch("../../../data/activities.json"),
      fetch("../../../data/student_organizations.json"),
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
  // derive departments from a canonical list plus any departments present in orgs
  // This ensures common departments always appear (even with zero submissions)
  const canonicalDepartments = ["SAMCIS", "SEA", "SONAHBS", "STELA", "SOM"];
  const orgDepartments = Array.from(new Set(orgs.map((o) => o.department).filter(Boolean)));
  const extraDepartments = orgDepartments.filter((d) => !canonicalDepartments.includes(d));
  const departments = [...canonicalDepartments, ...extraDepartments];
  if (departments.length === 0) departments.push("Unknown");

  const deptCount = Object.fromEntries(departments.map((d) => [d, 0]));

  activities
    .filter((a) => a.status?.toLowerCase() === "approved")
    .forEach((a) => {
      const org = orgs.find((o) => o._id?.$oid === a.org_id?.$oid);
      const dept = org?.department || "Unknown";
      if (deptCount.hasOwnProperty(dept)) {
        deptCount[dept]++;
      } else {
        deptCount[dept] = (deptCount[dept] || 0) + 1;
        if (!departments.includes(dept)) departments.push(dept);
      }
    });

  const canvas = document.getElementById("activitiesChart");
  const ctx = canvas.getContext("2d");

  // responsive pixel sizing (desired CSS height)
  setupCanvas(canvas, 360);

  const width = canvas.clientWidth;
  const height = 320;
  const padding = { left: 50, right: 20, top: 30, bottom: 70 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "13px Poppins";
  ctx.textAlign = "center";
  ctx.fillStyle = "#374151";

  const values = departments.map((d) => deptCount[d] || 0);
  const maxVal = Math.max(...values, 1);

  // grid lines + y labels
  ctx.strokeStyle = "#e5e7eb";
  ctx.fillStyle = "#6b7280";
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartH * i) / gridLines;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartW, y);
    ctx.stroke();
    const labelVal = Math.round(((gridLines - i) * maxVal) / gridLines);
    ctx.textAlign = "right";
    ctx.fillText(labelVal, padding.left - 8, y + 4);
  }

  // bars
  const barGap = Math.max(12, Math.floor(chartW / (departments.length * 6)));
  const barWidth = Math.max(24, (chartW - barGap * (departments.length - 1)) / departments.length);
  const colors = ["#FFD700", "#FF3B30", "#007AFF", "#34C759", "#9B59B6", "#FF8C42", "#6EE7B7"];

  departments.forEach((dep, i) => {
    const val = deptCount[dep] || 0;
    const x = padding.left + i * (barWidth + barGap);
    const h = (val / maxVal) * chartH;
    const y = padding.top + (chartH - h);

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, h, 6);
    ctx.fill();

    // value label
    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.fillText(val, x + barWidth / 2, y - 8);

    // department label (wrapped)
    ctx.fillStyle = "#374151";
    const labelX = x + barWidth / 2;
    const labelY = padding.top + chartH + 18;
    wrapText(ctx, dep, labelX, labelY, barWidth + 10, 14);
  });
}

// === DONUT CHART ===
function drawDonutChart(activities) {
  const canvas = document.getElementById("sdgChart");
  const ctx = canvas.getContext("2d");

  const sdgCount = {};
  activities.forEach((a) => (a.sdgs || []).forEach((s) => (sdgCount[s] = (sdgCount[s] || 0) + 1)));
  const labels = Object.keys(sdgCount);
  const data = Object.values(sdgCount);

  if (data.length === 0) {
    setupCanvas(canvas, 260);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px Poppins";
    ctx.fillStyle = "#374151";
    ctx.textAlign = "center";
    ctx.fillText("No SDG data available", canvas.clientWidth / 2, canvas.clientHeight / 2);
    return;
  }

  setupCanvas(canvas, 300);
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2 - 10;
  const radius = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.28;
  const cutout = radius * 0.45;

  const colors = ["#E5233D","#DDA73A","#4CA146","#C5192D","#EF402C","#27BFE6","#FBC412","#A31C44","#F26A2D","#E01483","#C49631","#56C02B","#00689D","#19486A","#DD1367"];
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
  ctx.font = "bold 16px Poppins";
  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.fillText("SDG Focus", cx, cy + 6);

  // Legend
  ctx.font = "13px Poppins";
  ctx.textAlign = "left";
  let lx = canvas.clientWidth * 0.6;
  let ly = canvas.clientHeight * 0.2;
  const lineHeight = 18;
  labels.forEach((l, i) => {
    const color = colors[i % colors.length];
    ctx.fillStyle = color;
    ctx.fillRect(lx, ly - 10, 12, 12);
    ctx.fillStyle = "#374151";
    ctx.fillText(`${l} (${sdgCount[l]})`, lx + 18, ly);
    ly += lineHeight;
    if (ly > canvas.clientHeight - 20) {
      ly = canvas.clientHeight * 0.2;
      lx += 140;
    }
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

// Resize canvas to match display size and devicePixelRatio. desiredHeight is CSS pixels height.
function setupCanvas(canvas, desiredHeight) {
  const dpr = window.devicePixelRatio || 1;
  // set CSS height for layout
  canvas.style.width = "100%";
  canvas.style.height = desiredHeight + "px";
  const displayWidth = Math.floor(canvas.clientWidth);
  const displayHeight = Math.floor(desiredHeight);
  // set actual pixel size for crisp drawing
  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // default font
  ctx.font = "13px Poppins";
}

// utility to wrap text inside a given width (centered by x param)
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = (text || "").split(" ");
  let line = "";
  const lines = [];
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  // draw lines centered at x
  ctx.textAlign = "center";
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
}
