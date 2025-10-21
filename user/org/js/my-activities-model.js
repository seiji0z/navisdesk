export class MyActivitiesModel {
  constructor() {
    this.activities = [];
    this.submissions = [];
  }

  // Load activity summary (Approved, Pending, etc.)
  async loadActivities() {
    this.activities = [
      { title: "Approved", count: 12, description: "Approved activities" },
      { title: "Needs Attention", count: 3, description: "Requires review" },
      { title: "Pending", count: 5, description: "Awaiting approval" },
    ];
  }

  // Load all submission data
  async loadSubmissions() {
    this.submissions = [
      {
        id: 1,
        activity: "Community Clean-Up Drive",
        status: "Approved",
        description: "A community clean-up project around Burnham Park.",
        submittedDate: "2025-10-18",
        date: "2025-10-10",
        venue: "Burnham Park",
        participants: "25",
        sdg: "Sustainable Cities and Communities",
        documents: ["proposal.pdf", "attendance.xlsx"],
        evidence: ["evidence1.jpg", "evidence2.jpg"],
        history: [
          {
            date: "2025-10-12",
            status: "Pending",
            remarks: "Waiting for approval",
          },
          {
            date: "2025-10-15",
            status: "Approved",
            remarks: "All requirements met",
          },
        ],
        feedback: [
          {
            reviewer: "Admin A",
            date: "2025-10-16",
            comment: "Good initiative! Continue collaborating with local units.",
          },
          {
            reviewer: "Coordinator B",
            date: "2025-10-17",
            comment: "Ensure to submit the final attendance sheet next time.",
          },
        ],
      },
      {
        id: 2,
        activity: "Tree Planting Initiative",
        status: "Pending",
        description: "Planting native trees around Camp John Hay.",
        submittedDate: "2025-10-15",
        date: "2025-10-08",
        venue: "Camp John Hay",
        participants: "30",
        sdg: "Life on Land",
        documents: ["plan.pdf", "list.xlsx"],
        evidence: ["photo1.jpg", "photo2.jpg"],
        history: [
          {
            date: "2025-10-10",
            status: "Draft",
            remarks: "Initial submission",
          },
        ],
        feedback: [],
      },
    ];
  }

  // Getters
  getActivities() {
    return this.activities;
  }

  getSubmissions() {
    return this.submissions;
  }

  getSubmissionById(id) {
    return this.submissions.find((s) => s.id === id);
  }
}
