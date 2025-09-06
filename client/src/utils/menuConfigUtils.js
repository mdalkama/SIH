// utils/menuConfigUtils.js
import {
    Home,
    Folder,
    Settings,
    Shield,
    Plus,
    BookOpen, 
    RefreshCw,
    CheckCircle,
    ClipboardList,
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
import CollegeWardenManageRooms from "../components/College/CollegeWarden/CollegeWardenManageRooms";
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
            label: "Manage Hostel Rooms",
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

    // 🔹 College Faculty
    CollegeFaculty: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-faculty/dashboard",
            role: "CollegeFaculty",
        },
        {
            id: "courses",
            label: "Courses",
            icon: BookOpen,
            path: "/college-faculty/courses",
            role: "CollegeFaculty",
        },
        {
            id: "students",
            label: "Students",
            icon: GraduationCap,
            path: "/college-faculty/students",
            role: "CollegeFaculty",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/college-faculty/settings",
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
};

export default menuConfig;
