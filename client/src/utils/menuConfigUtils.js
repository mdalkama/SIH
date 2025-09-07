// utils/menuConfigUtils.js
import {
    Home,
    Folder,
    Settings,
    FileText,
    Users,
    Shield,
    Plus,
    BookOpen,
    RefreshCw,
    CheckCircle,
    ClipboardList,
    CalendarDays,
    Calendar,
    GraduationCap,
    Wallet,
    Building2,
    Library,
    User, // 👈 Added User icon for My Profile
} from "lucide-react";

// Student
import StudentDashboard from "../components/Student/Studentdashboard";
import StudentCourse from "../components/Student/StudentCourse";
import StudentExams from "../components/Student/StudentExams";
import StudentLibrary from "../components/Student/StudentLibrary";
import StudentHostel from "../components/Student/StudentHostel";
import StudentFees from "../components/Student/StudentFees";

// University Admin
import UniversityAdminDashboard from "../components/University/UniversityAdmin/UniversityAdminDashboard";
import UniversityAdminManageRoles from "../components/University/UniversityAdmin/UniversityAdminManageRoles";
import UniversityAdminManageCollege from "../components/University/UniversityAdmin/UniversityAdminManageCollege";
import UniversityAdminManageUniversity from "../components/University/UniversityAdmin/UniversityAdminManageUniversity";
import UniversityAdminManageCourses from "../components/University/UniversityAdmin/UniversityAdminManageCourses";

// College Admin
import CollegeAdminDashboard from "../components/College/CollegeAdmin/CollegeAdminDashbord";
import CollegeAdminManageRoles from "../components/College/CollegeAdmin/CollegeAdminManageRoles";
import CollegeAdminManageCollege from "../components/College/CollegeAdmin/CollegeAdminManageCollege";
import CollegeAdminManageCourses from "../components/College/CollegeAdmin/CollegeAdminManageCourses";

// College Librarian
import CollegeLibrarianDashboard from "../components/College/CollegeLibrarian/CollegeLibrarianDashboard";
import CollegeLibrarianIssueBook from "../components/College/CollegeLibrarian/CollegeLibrarianIssueBook";
import CollegeLibrarianAddBook from "../components/College/CollegeLibrarian/CollegeLibrarianAddBook";
import CollegeLibrarianTrackReturn from "../components/College/CollegeLibrarian/CollegeLibrarianTrackReturn";

// College Warden
import CollegeWardenDashboard from "../components/College/CollegeWarden/CollegeWardenDashboard";
import CollegeWardenManageRooms from "../components/College/CollegeWarden/CollegeWardenManageRooms/CollegeWardenManageRooms";
import CollegeWardenHandleComplaint from "../components/College/CollegeWarden/CollegeWardenHandleComplaint";

// College Admission
import CollegeAdmissionDashboard from "../components/College/CollegeAdmission/CollegeAdmissionDashboard";
import CollegeAdmissionManageApplications from "../components/College/CollegeAdmission/CollegeAdmissionManageApplications";
import CollegeAdmissionStudentEnrollment from "../components/College/CollegeAdmission/CollegeAdmissionStudentEnrollment";
import CollegeAdmissionDocumentVerification from "../components/College/CollegeAdmission/CollegeAdmissionDocumentVerification";

// College Finance Department
import CollegeFinanceDashboard from "../components/College/CollegeFinance/CollegeFinanceDashboard";
import CollegeFinanceVerifyPayment from "../components/College/CollegeFinance/CollegeFinanceVerifyPayment";
import CollegeFinanceFeeManagement from "../components/College/CollegeFinance/CollegeFinanceFeeManagement";
import CollegeFinanceRefund from "../components/College/CollegeFinance/CollegeFinanceRefund";

// College Examination Body
import CollegeExamDashboard from "../components/College/CollegeExamination/CollegeExamDashboard";
import CollegeExamSchedule from "../components/College/CollegeExamination/CollegeExamSchedule";
import CollegeExternalExamRegistration from "../components/College/CollegeExamination/CollegeExternalExamRegistration";

// College Faculty
import CollegeFacultyDashboard from "../components/College/CollegeFaculty/CollegeFacultyDashboard";
import CollegeFacultyCourses from "../components/College/CollegeFaculty/CollegeFacultyCourses";
import CollegeFacultyAttendance from "../components/College/CollegeFaculty/CollegeFacultyAttendance";
import CollegeFacultyMarks from "../components/College/CollegeFaculty/CollegeFacultyMarks";
import CollegeFacultyAssignments from "../components/College/CollegeFaculty/CollegeFacultyAssignments";
import CollegeFacultyMentorship from "../components/College/CollegeFaculty/CollegeFacultyMentorship";

//College HOD
import CollegeHODDashboard from "../components/College/CollegeHOD/CollegeHODDashboard";
import CollegeHODManageFaculty from "../components/College/CollegeHOD/CollegeHODManageFaculty";
import CollegeHODCourseAllocation from "../components/College/CollegeHOD/CollegeHODCourseAllocation";
import CollegeHODStudentPerformance from "../components/College/CollegeHOD/CollegeHODStudentPerformance";
import CollegeHODMeetings from "../components/College/CollegeHOD/CollegeHODMeetings";
import CollegeHODSchedule from "../components/College/CollegeHOD/CollegeHODSchedule.jsx";

// College Dean
import CollegeDeanDashboard from "../components/College/CollegeDean/CollegeDeanDashboard";
import CollegeDeanApproveCourses from "../components/College/CollegeDean/CollegeDeanApproveCourses";
import CollegeDeanEvaluateFaculty from "../components/College/CollegeDean/CollegeDeanEvaluateFaculty";
import CollegeDeanBudgetResources from "../components/College/CollegeDean/CollegeDeanBudgetResources";


// Common MyProfile Component (for all roles)
import MyProfile from "../components/Common/MyProfile";

// 🎯 Roles mapping
const menuConfig = {
    // 🔹 Student
    student: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/student/dashboard",
            component: StudentDashboard,
            role: "student",
        },
        {
            id: "course",
            label: "Course",
            icon: BookOpen,
            path: "/student/course",
            component: StudentCourse,
            role: "student",
        },
        {
            id: "exams",
            label: "Exams",
            icon: ClipboardList,
            path: "/student/exams",
            component: StudentExams,
            role: "student",
        },
        {
            id: "library",
            label: "Library",
            icon: Library,
            path: "/student/library",
            component: StudentLibrary,
            role: "student",
        },
        {
            id: "hostel",
            label: "Hostel",
            icon: Building2,
            path: "/student/hostel",
            component: StudentHostel,
            role: "student",
        },
        {
            id: "fees",
            label: "Fees",
            icon: Wallet,
            path: "/student/fees",
            component: StudentFees,
            role: "student",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/student/my-profile",
            component: MyProfile,
            role: "student",
        },
    ],

    // 🔹 University Admin
    UniversityAdmin: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/university-admin/dashboard",
            component: UniversityAdminDashboard,
            role: "UniversityAdmin",
        },
        {
            id: "manage-employee",
            label: "Manage Employee",
            icon: Plus,
            path: "/university-admin/manage-employee",
            component: UniversityAdminManageRoles,
            role: "UniversityAdmin",
        },
        {
            id: "manage-college",
            label: "Manage College",
            icon: Folder,
            path: "/university-admin/manage-college",
            component: UniversityAdminManageCollege,
            role: "UniversityAdmin",
        },
        {
            id: "manage-university",
            label: "Manage University",
            icon: Shield,
            path: "/university-admin/manage-university",
            component: UniversityAdminManageUniversity,
            role: "UniversityAdmin",
        },
        {
            id: "manage-courses",
            label: "Manage Courses",
            icon: BookOpen,
            path: "/university-admin/manage-courses",
            component: UniversityAdminManageCourses,
            role: "UniversityAdmin",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/university-admin/my-profile",
            component: MyProfile,
            role: "UniversityAdmin",
        },
    ],

    // 🔹 College Admin
    CollegeAdmin: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-admin/dashboard",
            component: CollegeAdminDashboard,
            role: "CollegeAdmin",
        },
        {
            id: "manage-employee",
            label: "Manage Employee",
            icon: Plus,
            path: "/college-admin/manage-employee",
            component: CollegeAdminManageRoles,
            role: "CollegeAdmin",
        },
        {
            id: "manage-college",
            label: "Manage College",
            icon: Folder,
            path: "/college-admin/manage-college",
            component: CollegeAdminManageCollege,
            role: "CollegeAdmin",
        },
        {
            id: "manage-courses",
            label: "Manage Courses",
            icon: BookOpen,
            path: "/college-admin/manage-courses",
            component: CollegeAdminManageCourses,
            role: "CollegeAdmin",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/college-admin/my-profile",
            component: MyProfile,
            role: "CollegeAdmin",
        },
    ],

    CollegeDean: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-dean/dashboard",
            component: CollegeDeanDashboard,
            role: "CollegeDean",
        },
        {
            id: "approve-courses",
            label: "Approve Courses",
            icon: BookOpen,
            path: "/college-dean/approve-courses",
            component: CollegeDeanApproveCourses,
            role: "CollegeDean",
        },
        {
            id: "evaluate-faculty",
            label: "Evaluate Faculty",
            icon: Users,
            path: "/college-dean/evaluate-faculty",
            component: CollegeDeanEvaluateFaculty,
            role: "CollegeDean",
        },
        {
            id: "budget-resources",
            label: "Budget & Resources",
            icon: Wallet,
            path: "/college-dean/budget-resources",
            component: CollegeDeanBudgetResources,
            role: "CollegeDean",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/college-dean/my-profile",
            component: MyProfile,
            role: "CollegeDean",
        },
    ],

     CollegeHOD: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-hod/dashboard",
            component: CollegeHODDashboard,
            role: "CollegeHOD",
        },
        {
            id: "manage-faculty",
            label: "Manage Faculty",
            icon: Users,
            path: "/college-hod/manage-faculty",
            component: CollegeHODManageFaculty,
            role: "CollegeHOD",
        },
        {
            id: "course-allocation",
            label: "Course Allocation",
            icon: BookOpen,
            path: "/college-hod/course-allocation",
            component: CollegeHODCourseAllocation,
            role: "CollegeHOD",
        },
        {
            id: "student-performance",
            label: "Student Performance",
            icon: GraduationCap,
            path: "/college-hod/student-performance",
            component: CollegeHODStudentPerformance,
            role: "CollegeHOD",
        },
        {
            id: "schedule",
            label: "Schedule",
            icon: Calendar,
            path: "/college-hod/schedule",
            component: CollegeHODSchedule,
            role: "CollegeHOD",
        },
        {
            id: "meetings",
            label: "Meetings & Notices",
            icon: ClipboardList,
            path: "/college-hod/meetings",
            component: CollegeHODMeetings,
            role: "CollegeHOD",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/college-hod/my-profile",
            component: MyProfile,
            role: "CollegeHOD",
        },
    ],

    CollegeFaculty: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-faculty/dashboard",
            component: CollegeFacultyDashboard,
            role: "CollegeFaculty",
        },
        {
            id: "courses",
            label: "Manage Courses",
            icon: BookOpen,
            path: "/college-faculty/courses",
            component: CollegeFacultyCourses,
            role: "CollegeFaculty",
        },
        {
            id: "attendance",
            label: "Mark Attendance",
            icon: ClipboardList,
            path: "/college-faculty/attendance",
            component: CollegeFacultyAttendance,
            role: "CollegeFaculty",
        },
        {
            id: "marks",
            label: "Upload Marks",
            icon: GraduationCap,
            path: "/college-faculty/marks",
            component: CollegeFacultyMarks,
            role: "CollegeFaculty",
        },
        {
            id: "assignments",
            label: "Assignments & Materials",
            icon: FileText,
            path: "/college-faculty/assignments",
            component: CollegeFacultyAssignments,
            role: "CollegeFaculty",
        },
        {
            id: "mentorship",
            label: "Student Mentorship",
            icon: Users,
            path: "/college-faculty/mentorship",
            component: CollegeFacultyMentorship,
            role: "CollegeFaculty",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/college-faculty/my-profile",
            component: MyProfile,
            role: "CollegeFaculty",
        },
    ],

    // 🔹 College Librarian
    CollegeLibrarian: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-librarian/dashboard",
            component: CollegeLibrarianDashboard,
            role: "CollegeLibrarian",
        },
        {
            id: "issue-book",
            label: "Issue Book",
            icon: ClipboardList,
            path: "/college-librarian/issue-book",
            component: CollegeLibrarianIssueBook,
            role: "CollegeLibrarian",
        },
        {
            id: "add-book",
            label: "Add Book",
            icon: Plus,
            path: "/college-librarian/add-book",
            component: CollegeLibrarianAddBook,
            role: "CollegeLibrarian",
        },
        {
            id: "track-return",
            label: "Track & Return",
            icon: BookOpen,
            path: "/college-librarian/track-return",
            component: CollegeLibrarianTrackReturn,
            role: "CollegeLibrarian",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/college-librarian/my-profile",
            component: MyProfile,
            role: "CollegeLibrarian",
        },
    ],

    // 🔹 College Hostel Warden
    CollegeHostelWarden: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-warden/dashboard",
            component: CollegeWardenDashboard,
            role: "CollegeHostelWarden",
        },
        {
            id: "manage-rooms",
            label: "Manage Hostel",
            icon: Building2,
            path: "/college-warden/manage-rooms",
            component: CollegeWardenManageRooms,
            role: "CollegeHostelWarden",
        },
        {
            id: "handle-complaint",
            label: "Handle Complaints",
            icon: ClipboardList,
            path: "/college-warden/handle-complaint",
            component: CollegeWardenHandleComplaint,
            role: "CollegeHostelWarden",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/college-warden/my-profile",
            component: MyProfile,
            role: "CollegeHostelWarden",
        },
    ],

    // 🔹 College Admission Department
    CollegeAdmissionDepartment: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-admission/dashboard",
            component: CollegeAdmissionDashboard,
            role: "CollegeAdmissionDepartment",
        },
        {
            id: "manage-applications",
            label: "Manage Applications",
            icon: ClipboardList,
            path: "/college-admission/manage-applications",
            component: CollegeAdmissionManageApplications,
            role: "CollegeAdmissionDepartment",
        },
        {
            id: "student-enrollment",
            label: "Student Enrollment",
            icon: GraduationCap,
            path: "/college-admission/student-enrollment",
            component: CollegeAdmissionStudentEnrollment,
            role: "CollegeAdmissionDepartment",
        },
        {
            id: "document-verification",
            label: "Document Verification",
            icon: Folder,
            path: "/college-admission/document-verification",
            component: CollegeAdmissionDocumentVerification,
            role: "CollegeAdmissionDepartment",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/college-admission/my-profile",
            component: MyProfile,
            role: "CollegeAdmissionDepartment",
        },
    ],

    CollegeFinanceBody: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-finance/dashboard",
            component: CollegeFinanceDashboard,
            role: "CollegeFinanceBody",
        },
        {
            id: "verify-payment",
            label: "Verify Payment",
            icon: CheckCircle,
            path: "/college-finance/verify-payment",
            component: CollegeFinanceVerifyPayment,
            role: "CollegeFinanceBody",
        },
        {
            id: "fee-management",
            label: "Fee Management",
            icon: Wallet,
            path: "/college-finance/fee-management",
            component: CollegeFinanceFeeManagement,
            role: "CollegeFinanceBody",
        },
        {
            id: "refund",
            label: "Refund",
            icon: RefreshCw,
            path: "/college-finance/refund",
            component: CollegeFinanceRefund,
            role: "CollegeFinanceBody",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/college-finance/my-profile",
            component: MyProfile,
            role: "CollegeFinanceBody",
        },
    ],

    CollegeExaminationBody: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-exam/dashboard",
            component: CollegeExamDashboard,
            role: "CollegeExaminationBody",
        },
        {
            id: "schedule-exam",
            label: "Schedule Exam",
            icon: CalendarDays,
            path: "/college-exam/schedule-exam",
            component: CollegeExamSchedule,
            role: "CollegeExaminationBody",
        },
        {
            id: "external-exam-registration",
            label: "External Exam Registration",
            icon: ClipboardList,
            path: "/college-exam/external-exam-registration",
            component: CollegeExternalExamRegistration,
            role: "CollegeExaminationBody",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/college-exam/my-profile",
            component: MyProfile,
            role: "CollegeExaminationBody",
        },
    ],

};

export default menuConfig;
