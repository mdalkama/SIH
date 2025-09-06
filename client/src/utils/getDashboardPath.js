// utils/getDashboardPath.js
const roleDashboardMap = {
    // Student
    student: "/student/dashboard",

    // University roles
    UniversityAdmin: "/university-admin/dashboard",
    UniversityGoverningBody: "/university-governing-body/dashboard",
    UniversityRegistrar: "/university-registrar/dashboard",
    UniversityExaminationBody: "/university-exam-body/dashboard",
    UniversityExamCellStaff: "/university-exam-cell/dashboard",

    // College roles
    CollegeAdmin: "/college-admin/dashboard",
    CollegeDirector: "/college-director/dashboard",
    CollegeDean: "/college-dean/dashboard",
    CollegeHOD: "/college-hod/dashboard",
    CollegeFaculty: "/college-faculty/dashboard",
    CollegeWarden: "/college-warden/dashboard",
    CollegeLibrarian: "/college-librarian/dashboard",
    CollegeAdmissionDepartment: "/college-admission/dashboard",
    CollegeFinanceBody: "/college-finance/dashboard",
    CollegeExaminationBody: "/college-exam/dashboard",
};

// role se dashboard path return karega
const getDashboardPath = (role) => {
    if (!role) return "/login"; // agar role hi nahi mila to login bhej do
    return roleDashboardMap[role] || "/not-authorized"; // fallback
};

export default getDashboardPath;
