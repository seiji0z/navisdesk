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
  updateActivityCount(title, newCount) {
  // Update in model
  this.model.updateActivityCount(title, newCount);

  // Reflect the change in the view
  this.view.updateActivityCounts(this.model.getActivities());
}

}

// Initialize
const controller = new MyActivitiesController();
controller.init();
