import { MyActivitiesModel } from "../js/my-activities-model.js";
import { MyActivitiesView } from "../js/my-activities-view.js";

export class MyActivitiesController {
  constructor() {
    this.model = new MyActivitiesModel();
    this.view = new MyActivitiesView();
  }

  async init() {
    await this.model.loadActivities();
    await this.model.loadSubmissions();

    // ✅ Use the unified render() instead of renderActivitySummary/renderSubmissions
    this.view.render(
      this.model.getActivities(),
      this.model.getSubmissions()
    );
  }
}

// Initialize
const controller = new MyActivitiesController();
controller.init();
