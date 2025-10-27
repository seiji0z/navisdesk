const sidebarContainer = document.querySelector("#sidebar");
const role = sidebarContainer.getAttribute("data-role");

// Determine which sidebar to load
let sidebarPath;
switch (role) {
  case "admin":
    sidebarPath = "../../admin/components/sidebar.html";
    break;
  case "osas":
    sidebarPath = "../../osas/components/sidebar.html";
    break;
  case "org":
    sidebarPath = "../../org/components/sidebar.html";
    break;
  default:
    sidebarPath = "../components/sidebar.html";
    break;
}

fetch(sidebarPath)
  .then((response) => response.text())
  .then((data) => {
    sidebarContainer.innerHTML = data;

    const toggleBtn = document.querySelector(".toggle-btn");
    const sidebar = document.querySelector(".sidebar");
    const main = document.querySelector(".main");

    // Create overlay (for mobile)
    let overlay = document.createElement("div");
    overlay.classList.add("sidebar-overlay");
    document.body.appendChild(overlay);

    if (toggleBtn && sidebar && main) {
      toggleBtn.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          // 📱 Mobile: Slide over
          sidebar.classList.toggle("show");
          overlay.classList.toggle("show");
        } else {
          // 💻 Desktop: Collapse
          sidebar.classList.toggle("collapsed");
          main.classList.toggle("collapsed-sidebar");
        }
      });
    }

    // 📱 Clicking outside closes sidebar
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
    });

    // 🌐 Highlight current active link
    const currentFile = window.location.pathname.split("/").pop().toLowerCase();
    const links = sidebar.querySelectorAll("nav a");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const linkFile = href.split("/").pop().toLowerCase();
      if (linkFile === currentFile) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    updateCurrentDate();

    // 👤 User profile dropdown
    const userProfile = document.getElementById("userProfile");
    const logoutDropdown = document.getElementById("logoutDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    if (userProfile && logoutDropdown) {
      userProfile.addEventListener("click", (e) => {
        e.stopPropagation();
        logoutDropdown.classList.toggle("show");
      });
      document.addEventListener("click", () => {
        logoutDropdown.classList.remove("show");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../../../login.html";
      });
    }
  })
  .catch((error) => console.error("Sidebar failed to load:", error));

function updateCurrentDate() {
  const dateElement = document.querySelector(".current-date");
  if (dateElement) {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    dateElement.textContent = today.toLocaleDateString("en-US", options);
  }
}

// 🔄 Auto-reset sidebar state when resizing
window.addEventListener("resize", () => {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");

  if (window.innerWidth > 768) {
    sidebar?.classList.remove("show");
    overlay?.classList.remove("show");
  }
});
