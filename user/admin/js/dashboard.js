// ---- ADMIN Dashboard ----
function loadAdminDashboard() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="grid-container">
      <!-- Small cards -->
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="first">1,200</p>
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
            <p class="number" id="second">45</p>
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
            <p class="number" id="third">45</p>
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
            <p class="number" id="fourth">7</p>
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
          <canvas id="activitiesChart"></canvas>
        </div>
      </div>

      <!-- Top SDGs -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Top SDGs Used</h3>
          <canvas id="sdgChart"></canvas>
        </div>
      </div>
    </div>
  `;

  // === Chart 1: Department Bar Chart (UNCHANGED) ===
  const ctx1 = document.getElementById("activitiesChart").getContext("2d");
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels: ["SAMCIS", "SEA", "SONAHBS", "STELA"],
      datasets: [{
        label: "Approved Activities",
        data: [25, 18, 12, 20],
        backgroundColor: [
          "#FFD700", // SAMCIS - Yellow
          "#FF3B30", // SEA - Red  
          "#007AFF", // SONAHBS - Blue
          "#34C759"  // STELA - Green
        ],
        borderColor: [
          "#FFD700", "#FF3B30", "#007AFF", "#34C759"
        ],
        borderWidth: 2,
        borderRadius: 12,
        borderSkipped: false,
        barThickness: 32,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 30,
          grid: { display: false },
          ticks: {
            font: { family: "'Poppins', sans-serif", size: 14, weight: '700' },
            color: '#6b7280'
          },
          border: { display: false }
        },
        y: {
          grid: { color: '#f3f4f6', drawBorder: false },
          ticks: {
            font: { family: "'Poppins', sans-serif", size: 14, weight: '600' },
            color: '#1f2937'
          }
        }
      },
      animation: { duration: 2000, easing: 'easeOutQuart' }
    }
  });

  // === Chart 2: ALL 17 SDGs in Pie, TOP 10 in Legend ===
  const ctx2 = document.getElementById("sdgChart").getContext("2d");
  
  const sdgLabels = ["SDG 1", "SDG 2", "SDG 3", "SDG 4", "SDG 5", "SDG 6", "SDG 7", "SDG 8", "SDG 9", "SDG 10", "SDG 11", "SDG 12", "SDG 13", "SDG 14", "SDG 15", "SDG 16", "SDG 17"];
  const sdgData = [5, 3, 7, 9, 2, 4, 6, 8, 3, 5, 4, 6, 5, 2, 7, 3, 4];
  const sdgColors = [
    "#E5233D", "#DDA73A", "#4CA146", "#C5192D", "#EF402C", "#27BFE6", "#FBC412", 
    "#A31C44", "#F26A2D", "#E01483", "#F89D2A", "#BF8D2C", "#407F46", "#1F97D4", 
    "#59BA48", "#126A9F", "#13496B"
  ];

  const top10Indices = [7, 3, 14, 2, 12, 6, 0, 9, 11, 16];

  new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: sdgLabels,
      datasets: [{
        data: sdgData,
        backgroundColor: sdgColors,
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4,
        cutout: '65%',
        offset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 25,
            usePointStyle: true,
            pointStyle: 'circle',
            font: {
              family: "'Poppins', sans-serif",
              size: 14,
              weight: '700'
            },
            color: '#374151',
            generateLabels: function(chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return top10Indices.map((index, i) => {
                  const label = data.labels[index];
                  const color = data.datasets[0].backgroundColor[index];
                  return {
                    text: label,
                    fillStyle: color,
                    strokeStyle: color,
                    lineWidth: 2,
                    pointStyle: 'circle',
                    hidden: false,
                    index: index
                  };
                });
              }
              return [];
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 2000,
        easing: 'easeOutBack'
      }
    }
  });
}

// ---- INITIALIZER ----
function initDashboard() {
  loadAdminDashboard();
}
initDashboard();