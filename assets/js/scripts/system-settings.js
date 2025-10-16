import { setFolderTitle, setCurrentDate } from "../components/folder.js";

function loadActivitiesModule() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <div class="activities-container">

      <div>
      </div>
    </div>
  `;
}

function initActivities() {
  setFolderTitle("Activities");
  setCurrentDate();
  loadActivitiesModule();
}

initActivities();
