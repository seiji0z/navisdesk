export class MyActivitiesModel {
  constructor() {
    this.activities = [];
    this.submissions = [];
  }

  // Load activity summary (Approved, Pending, etc.)
  async loadActivities() {
    this.activities = [
      { title: "Approved", count: 0, description: "Approved activities" },
      { title: "Needs Attention", count: 0, description: "Requires review" },
      { title: "Rejected", count: 0, description: "Rejected submissions" },
      { title: "Pending", count: 0, description: "Awaiting approval" },
    ];
  }

  updateActivityCount(title, newCount) {
    const activity = this.activities.find((a) => a.title === title);
    if (activity) {
      activity.count = newCount;
    }
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
          { date: "2025-10-12", status: "Pending", remarks: "Waiting for approval" },
          { date: "2025-10-15", status: "Approved", remarks: "All requirements met" },
        ],
        feedback: [
          { reviewer: "Admin A", date: "2025-10-16", comment: "Good initiative! Continue collaborating with local units." },
          { reviewer: "Coordinator B", date: "2025-10-17", comment: "Ensure to submit the final attendance sheet next time." },
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
          { date: "2025-10-10", status: "Draft", remarks: "Initial submission" },
        ],
        feedback: [],
      },
      {
        id: 3,
        activity: "Annual Tech Symposium",
        status: "Needs Attention",
        description: "A week-long event focused on emerging technologies, featuring guest speakers.",
        submittedDate: "2025-10-12",
        date: "2025-10-05",
        venue: "University Auditorium",
        participants: "120",
        sdg: "Industry, Innovation and Infrastructure",
        documents: ["symposium-plan.pdf", "invitation.docx"],
        evidence: ["poster.png"],
        history: [
          { date: "2025-10-07", status: "Needs Attention", remarks: "Missing speaker list" },
        ],
        feedback: [
          { reviewer: "Admin B", date: "2025-10-09", comment: "Please include final guest list before re-submission." },
        ],
      },
      {
        id: 4,
        activity: "Mental Health Awareness Workshop",
        status: "Approved",
        description: "An interactive workshop on student mental health and resilience.",
        submittedDate: "2025-10-11",
        date: "2025-10-04",
        venue: "Student Center",
        participants: "80",
        sdg: "Good Health and Well-being",
        documents: ["agenda.pdf", "participants.xlsx"],
        evidence: ["group-photo.jpg"],
        history: [
          { date: "2025-10-06", status: "Pending", remarks: "Under review" },
          { date: "2025-10-09", status: "Approved", remarks: "Looks good to proceed" },
        ],
        feedback: [],
      },
      {
        id: 5,
        activity: "Fundraising Concert for a Cause",
        status: "Rejected",
        description: "A benefit concert to raise funds for local charities.",
        submittedDate: "2025-10-09",
        date: "2025-10-01",
        venue: "City Amphitheater",
        participants: "250",
        sdg: "No Poverty",
        documents: ["proposal.pdf", "performers-list.xlsx"],
        evidence: ["concert.jpg"],
        history: [
          { date: "2025-10-05", status: "Pending", remarks: "Under review" },
          { date: "2025-10-07", status: "Rejected", remarks: "Venue booking conflict" },
        ],
        feedback: [
          { reviewer: "Coordinator C", date: "2025-10-08", comment: "Reschedule and resubmit next term." },
        ],
      },
      {
        id: 6,
        activity: "Coastal Cleanup Initiative",
        status: "Approved",
        description: "Students collaborated with NGOs to clean up coastal areas.",
        submittedDate: "2025-10-07",
        date: "2025-09-30",
        venue: "La Union Beach",
        participants: "40",
        sdg: "Life Below Water",
        documents: ["coastal-plan.pdf"],
        evidence: ["cleanup.jpg", "volunteers.jpg"],
        history: [
          { date: "2025-10-03", status: "Approved", remarks: "Great community engagement" },
        ],
        feedback: [],
      },
      {
        id: 7,
        activity: "Blood Donation Drive",
        status: "Pending",
        description: "Organized in collaboration with Red Cross for student donors.",
        submittedDate: "2025-10-10",
        date: "2025-10-03",
        venue: "Gymnasium",
        participants: "60",
        sdg: "Good Health and Well-being",
        documents: ["poster.png", "schedule.pdf"],
        evidence: [],
        history: [
          { date: "2025-10-06", status: "Pending", remarks: "Awaiting approval" },
        ],
        feedback: [],
      },
      {
        id: 8,
        activity: "Student Leadership Summit",
        status: "Needs Attention",
        description: "Leadership training and workshops for student organization officers.",
        submittedDate: "2025-10-08",
        date: "2025-10-01",
        venue: "Multipurpose Hall",
        participants: "90",
        sdg: "Quality Education",
        documents: ["summit-outline.pdf", "attendance.xlsx"],
        evidence: ["leaders.jpg"],
        history: [
          { date: "2025-10-05", status: "Needs Attention", remarks: "Incomplete logistics plan" },
        ],
        feedback: [],
      },
    ];

    // Automatically compute summary counts
    const summaryMap = {};
    this.submissions.forEach((s) => {
      summaryMap[s.status] = (summaryMap[s.status] || 0) + 1;
    });

    this.activities = [
      { title: "Approved", count: summaryMap["Approved"] || 0, description: "Approved activities" },
      { title: "Needs Attention", count: summaryMap["Needs Attention"] || 0, description: "Requires review" },
      { title: "Rejected", count: summaryMap["Rejected"] || 0, description: "Rejected submissions" },
      { title: "Pending", count: summaryMap["Pending"] || 0, description: "Awaiting approval" },
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
