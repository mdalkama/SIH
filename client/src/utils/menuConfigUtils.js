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

const menuConfig = {
        // 🔹 Student
        student: [
            {
                id: "dashboard",
                label: "Dashboard",
                icon: Home,
                path: "/student/dashboard",
            },
            {
                id: "course",
                label: "Course",
                icon: BookOpen,
                path: "/student/course",
            },
            {
                id: "exams",
                label: "Exams",
                icon: ClipboardList,
                path: "/student/exams",
            },
            {
                id: "library",
                label: "Library",
                icon: Library,
                path: "/student/library",
            },
            {
                id: "hostel",
                label: "Hostel",
                icon: Building2,
                path: "/student/hostel",
            },
            {
                id: "fees",
                label: "Fees",
                icon: Wallet,
                path: "/student/fees",
            }
        ],

        // 🔹 University Admin
        UniversityAdmin: [
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
            },
            {
                id: "departments",
                label: "Departments",
                icon: BookOpen,
                path: "/college-admin/departments",
            },
            {
                id: "students",
                label: "Students",
                icon: GraduationCap,
                path: "/college-admin/students",
            },
            {
                id: "settings",
                label: "Settings",
                icon: Settings,
                path: "/college-admin/settings",
            },
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
        ],
    };

    export default menuConfig;