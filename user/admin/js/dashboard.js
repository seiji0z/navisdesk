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
    console.log("Loading admin dashboard...");
    
    // === CHANGED: Fetch from PHP (Local MongoDB) instead of JSON files ===
    const [activitiesRes, orgsRes] = await Promise.all([
      fetch("../../../server/php/get-activities.php", {
        credentials: 'include'
      }),
      fetch("../../../server/php/get-student-orgs.php", {
        credentials: 'include'
      }),
    ]);

    console.log("Activities response status:", activitiesRes.status);
    console.log("Organizations response status:", orgsRes.status);

    if (!activitiesRes.ok) {
      throw new Error(`Failed to load activities: ${activitiesRes.status} ${activitiesRes.statusText}`);
    }
    if (!orgsRes.ok) {
      throw new Error(`Failed to load organizations: ${orgsRes.status} ${orgsRes.statusText}`);
    }

    const activities = await activitiesRes.json();
    const orgs = await orgsRes.json();

    console.log("Loaded activities:", activities.length);
    console.log("Loaded organizations:", orgs.length);

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
    try {
      // Draw bar chart
      console.log("Drawing bar chart...");
      drawBarChart(activities, orgs);

      // Draw donut chart
      console.log("Drawing donut chart...");
      drawDonutChart(activities);

      // Add resize handler
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          console.log("Resizing charts...");
          drawBarChart(activities, orgs);
          drawDonutChart(activities);
        }, 250);
      });

    } catch (chartErr) {
      console.error("Error drawing charts:", chartErr);
      throw chartErr;  // Re-throw to be caught by outer catch
    }
  } catch (err) {
    console.error("Dashboard load error:", err);
    document.getElementById("folder-body").innerHTML =
      `<p>Error loading dashboard: ${err.message}</p>`;
  }
}

// === BAR CHART ===
function drawBarChart(activities, orgs) {
  console.log("Starting bar chart draw...");
  
  if (!Array.isArray(activities)) {
    console.error("Activities is not an array:", activities);
    throw new Error("Invalid activities data");
  }
  
  if (!Array.isArray(orgs)) {
    console.error("Organizations is not an array:", orgs);
    throw new Error("Invalid organizations data");
  }

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
  if (!canvas) {
    throw new Error("Canvas element not found");
  }

  const container = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  
  // Set canvas size based on container
  const containerStyle = getComputedStyle(container);
  const containerWidth = parseInt(containerStyle.width, 10) - 40; // Account for padding
  const containerHeight = Math.min(380, containerWidth * 0.75); // Maintain aspect ratio
  
  // Update canvas size
  canvas.style.width = containerWidth + 'px';
  canvas.style.height = containerHeight + 'px';
  canvas.width = containerWidth * dpr;
  canvas.height = containerHeight * dpr;

  // Store dimensions for later use
  const rect = {
    width: containerWidth,
    height: containerHeight
  };
  
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
  if (!canvas) {
    throw new Error("Canvas element not found");
  }

  const container = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  
  // Set canvas size based on container with minimum dimensions
  const containerStyle = getComputedStyle(container);
  const minSize = 200; // Minimum size to ensure chart is visible
  const paddingSpace = 40;
  
  const containerWidth = Math.max(minSize, parseInt(containerStyle.width, 10) - paddingSpace);
  // For donut chart, prefer square aspect ratio
  const containerHeight = Math.max(minSize, Math.min(380, containerWidth));
  
  // Update canvas size
  canvas.style.width = containerWidth + 'px';
  canvas.style.height = containerHeight + 'px';
  canvas.width = containerWidth * dpr;
  canvas.height = containerHeight * dpr;

  // Store dimensions for later use
  const rect = {
    width: containerWidth,
    height: containerHeight
  };
  
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  
  // Calculate dimensions ensuring minimum sizes
  const legendSpace = Math.min(60, rect.height * 0.2); // Adaptive legend space
  const cx = rect.width / 2;
  const cy = (rect.height - legendSpace) / 2;
  
  // Ensure minimum radius while maintaining proportions
  const minRadius = 40;
  const maxRadius = Math.min(cx - 30, cy - 30);
  const radius = Math.max(minRadius, maxRadius);
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
  const legendPadding = 10;
  const legendItemHeight = Math.min(20, rect.height * 0.05);
  const maxLegendWidth = rect.width - (legendPadding * 2);
  const legendItemWidth = Math.min(200, maxLegendWidth / 2);
  const legendColumns = Math.max(1, Math.floor(maxLegendWidth / legendItemWidth));
  const legendRows = Math.ceil(labels.length / legendColumns);
  
  // Calculate legend Y position to ensure it fits
  const legendTotalHeight = legendRows * legendItemHeight;
  const legendY = rect.height - legendTotalHeight - legendPadding;
  
  ctx.font = `${Math.min(13, rect.height * 0.035)}px Poppins`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  
  labels.forEach((l, i) => {
    const column = i % legendColumns;
    const row = Math.floor(i / legendColumns);
    const x = legendPadding + column * legendItemWidth;
    const y = legendY + row * legendItemHeight;
    
    // Draw legend item box
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, y - 4, 8, 8);
    
    // Draw legend text
    ctx.fillStyle = "#374151";
    const truncatedLabel = l.length > 20 ? l.substring(0, 17) + "..." : l;
    ctx.fillText(truncatedLabel, x + 14, y);
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
