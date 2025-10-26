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

    if (toggleBtn && sidebar && main) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        main.classList.toggle("collapsed-sidebar");
      });
    }

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
