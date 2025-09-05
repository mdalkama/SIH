import {
    Menu,
    X,
    Home,
    Folder,
    Users,
    Settings,
    Bell,
    Search,
    User,
    ChevronDown,
    Shield,
    Plus,
    Filter,
    MoreHorizontal,
    LogOut,
    BookOpen,
    ClipboardList,
    GraduationCap,
    Wallet,
    Building2,
    Library,
} from "lucide-react";

// Student
import StudentDashboard from "../components/Student/Studentdashboard";
import StudentCourse from "../components/Student/StudentCourse";
import StudentExams from "../components/Student/StudentExams";
import StudentLibrary from "../components/Student/StudentLibrary";
import StudentHostel from "../components/Student/StudentHostel";
import StudentFees from "../components/Student/StudentFees";

// university Admin
import UniversityAdminDashboard from "../components/University/UniversityAdmin/UniversityAdminDashboard";
import UniversityAdminManageRoles from "../components/University/UniversityAdmin/UniversityAdminManageRoles";
import UniversityAdminManageCollege from "../components/University/UniversityAdmin/UniversityAdminManageCollege";
import UniversityAdminManageUniversity from "../components/University/UniversityAdmin/UniversityAdminManageUniversity";
import UniversityAdminManageCourses from "../components/University/UniversityAdmin/UniversityAdminManageCourses";

// College Admin
import CollegeAdminDashboard from "../components/College/CollegeAdmin/CollegeAdminDashbord";
import CollegeAdminManageRoles from "../components/College/CollegeAdmin/CollegeAdminManageRoles";
import CollegeAdminManageCollege from "../components/College/CollegeAdmin/CollegeAdminManageCollege";
import CollegeAdminManageCourses from "../components/College/CollegeAdmin/CollegeAdminManageCourses";;


const menuConfig = {
    // 🔹 Student
    student: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/student/dashboard",
            component: StudentDashboard,
        },
        {
            id: "course",
            label: "Course",
            icon: BookOpen,
            path: "/student/course",
            component: StudentCourse,
        },
        {
            id: "exams",
            label: "Exams",
            icon: ClipboardList,
            path: "/student/exams",
            component: StudentExams,
        },
        {
            id: "library",
            label: "Library",
            icon: Library,
            path: "/student/library",
            component: StudentLibrary,
        },
        {
            id: "hostel",
            label: "Hostel",
            icon: Building2,
            path: "/student/hostel",
            component: StudentHostel,
        },
        {
            id: "fees",
            label: "Fees",
            icon: Wallet,
            path: "/student/fees",
            component: StudentFees,
        }
    ],

    UniversityAdmin: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/university-admin/dashboard",
            component: UniversityAdminDashboard,
        },
        {
            id: "manage-employee",
            label: "Manage Employee",
            icon: Plus,
            path: "/university-admin/manage-employee",
            component: UniversityAdminManageRoles,
        },
        {
            id: "manage-college",
            label: "Manage College",
            icon: Folder,
            path: "/university-admin/manage-college",
            component: UniversityAdminManageCollege,
        },
        {
            id: "manage-university",
            label: "Manage University",
            icon: Shield,
            path: "/university-admin/manage-university",
            component: UniversityAdminManageUniversity,
        },
        {
            id: "manage-courses",
            label: "Manage Courses",
            icon: BookOpen,
            path: "/university-admin/manage-courses",
            component: UniversityAdminManageCourses,
        }
    ],

    // 🔹 University Admin
    UniversityGoverningBody: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/university-admin/dashboard",
        },
        {
            id: "colleges",
            label: "Colleges",
            icon: Building2,
            path: "/university-admin/colleges",
        },
        {
            id: "finance",
            label: "Finance",
            icon: Wallet,
            path: "/university-admin/finance",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/university-admin/settings",
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
        },
        {
            id: "manage-employee",
            label: "Manage Employee",
            icon: Plus,
            path: "/college-admin/manage-employee",
            component: CollegeAdminManageRoles,
        },
        {
            id: "manage-college",
            label: "Manage College",
            icon: Folder,
            path: "/college-admin/manage-college",
            component: CollegeAdminManageCollege,
        },
        {
            id: "manage-courses",
            label: "Manage Courses",
            icon: BookOpen,
            path: "/college-admin/manage-courses",
            component: CollegeAdminManageCourses,
        }
    ],

    // 🔹 College Faculty
    CollegeFaculty: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-faculty/dashboard",
        },
        {
            id: "courses",
            label: "Courses",
            icon: BookOpen,
            path: "/college-faculty/courses",
        },
        {
            id: "students",
            label: "Students",
            icon: GraduationCap,
            path: "/college-faculty/students",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/college-faculty/settings",
        },
    ],

    // 🔹 College HOD
    CollegeHOD: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-hod/dashboard",
        },
        {
            id: "faculty",
            label: "Faculty",
            icon: Users,
            path: "/college-hod/faculty",
        },
        {
            id: "students",
            label: "Students",
            icon: GraduationCap,
            path: "/college-hod/students",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/college-hod/settings",
        },
    ],

    // 🔹 College Dean
    CollegeDean: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-dean/dashboard",
        },
        { id: "hods", label: "HODs", icon: Users, path: "/college-dean/hods" },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/college-dean/settings",
        },
    ],

    // 🔹 College Director
    CollegeDirector: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-director/dashboard",
        },
        {
            id: "deans",
            label: "Deans",
            icon: Users,
            path: "/college-director/deans",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/college-director/settings",
        },
    ],

    // 🔹 College Librarian
    CollegeLibrarian: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-librarian/dashboard",
        },
        {
            id: "books",
            label: "Books",
            icon: Library,
            path: "/college-librarian/books",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/college-librarian/settings",
        },
    ],

    // 🔹 College Hostel Warden
    CollegeHostelWarden: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-warden/dashboard",
        },
        {
            id: "students",
            label: "Students",
            icon: Users,
            path: "/college-warden/students",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/college-warden/settings",
        },
    ],

    // 🔹 College Finance Body
    CollegeFinanceBody: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-finance/dashboard",
        },
        {
            id: "transactions",
            label: "Transactions",
            icon: Wallet,
            path: "/college-finance/transactions",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/college-finance/settings",
        },
    ],

    // 🔹 College Examination Body
    CollegeExaminationBody: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-exam/dashboard",
        },
        {
            id: "exams",
            label: "Exams",
            icon: ClipboardList,
            path: "/college-exam/exams",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/college-exam/settings",
        },
    ]
};

export default menuConfig;