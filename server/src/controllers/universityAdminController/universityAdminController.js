import College from "../../models/collegeModel.js"; // Assuming you have a College model
import Course from "../../models/courseModel.js";
import Student from "../../models/studentModel.js";
import Staff from "../../models/staffModel.js";

/**
 * @description Get high-level statistics for the University Admin dashboard.
 * @route   GET /api/v1/university/dashboard-stats
 * @access  UniversityAdmin
 */
export const getUniversityDashboardStats = async (req, res) => {
  try {
    // Use Promise.all to fetch all data in parallel for maximum efficiency
    const [
      totalColleges,
      totalCourses,
      totalStudents,
      totalStaff,
      // Financials would be more complex, so we'll mock them for now
    ] = await Promise.all([
      College.countDocuments(),
      Course.countDocuments(),
      Student.countDocuments(),
      Staff.countDocuments(),
    ]);

    // --- Mock Data for elements that require more complex models ---
    const financials = {
      totalRevenueYTD: 52450000,
      pendingFees: 8975000,
      operationalExpenses: 12320000,
    };
    const enrollmentTrends = [
      { year: "2021", count: 21500 },
      { year: "2022", count: 22800 },
      { year: "2023", count: 23900 },
      { year: "2024", count: 25100 },
      { year: "2025", count: totalStudents }, // Use real data for the current year
    ];
    const activeSessions = [
      {
        id: "sess_003",
        name: "Spring 2026 Admissions",
        status: "Active",
        endDate: "2026-02-20",
      },
      {
        id: "sess_004",
        name: "Fall 2026 B.Tech Admissions",
        status: "Upcoming",
        startDate: "2026-08-01",
      },
    ];
    // Fetch recent affiliations from the College model
    const recentAffiliations = await College.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name collegeCode status createdAt");

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalColleges,
          totalCourses,
          totalStudents,
          totalStaff,
        },
        financials,
        enrollmentTrends,
        activeSessions,
        recentAffiliations: recentAffiliations.map((c) => ({
          id: c._id,
          name: c.name,
          code: c.collegeCode,
          status: c.status, // Assuming 'status' field in College model
          affiliationDate: c.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching university dashboard stats:", error);
    res
      .status(500)
      .json({
        message: "Server error fetching dashboard stats.",
        error: error.message,
      });
  }
};
