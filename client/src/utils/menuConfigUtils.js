// utils/menuConfigUtils.js
import {
    Home,
    Folder,
    Settings,
    Shield,
    Plus,
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

// 🎯 Roles mapping with studentRoles & staffRoles
const menuConfig = {
    // 🔹 Student
    student: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/student/dashboard",
            component: StudentDashboard,
            role: "student", // ✅ from studentRoles
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
    ],

    // 🔹 University Admin
    UniversityAdmin: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/university-admin/dashboard",
            component: UniversityAdminDashboard,
            role: "UniversityAdmin", // ✅ from staffRoles
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
    ],

    // 🔹 College Admin
    CollegeAdmin: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-admin/dashboard",
            component: CollegeAdminDashboard,
            role: "CollegeAdmin", // ✅ from staffRoles
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
    ],

    // 🔹 College Faculty
    CollegeFaculty: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-faculty/dashboard",
            role: "CollegeFaculty", // ✅ from staffRoles
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
    ],
};

export default menuConfig;
