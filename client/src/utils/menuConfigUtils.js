// utils/menuConfigUtils.js
import {
    Home,
    Folder,
    Settings,
    FileText,
    Users,
    FileCheck,
    CheckSquare,
    Briefcase,
    Megaphone,
    Share2,
    PlusSquare,
    Package,
    PenLine,
    Shield,
    UserCog,
    Award,
    Database,
    ShieldCheck,
    Plus,
    BookOpen,
    RefreshCw,
    BarChart3,
    ClipboardCheck,
    CheckCircle,
    ClipboardList,
    CalendarDays,
    Calendar,
    GraduationCap,
    Wallet,
    Building2,
    Library,
    User,
    MessageSquare, // Added User icon for My Profile
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

// University Governing Body Components
import GoverningBodyDashboard from "../components/University/GoverningBody/GoverningBodyDashboard";
import GoverningBodyCollegeReports from "../components/University/GoverningBody/GoverningBodyCollegeReports";
import GoverningBodyPolicies from "../components/University/GoverningBody/GoverningBodyPolicies";
import GoverningBodyAdmissionRules from "../components/University/GoverningBody/GoverningBodyAdmissionRules";
import GoverningBodyBudget from "../components/University/GoverningBody/GoverningBodyBudget";
import GoverningBodyAccreditation from "../components/University/GoverningBody/GoverningBodyAccreditation";
import GoverningBodyNewColleges from "../components/University/GoverningBody/GoverningBodyNewColleges";

// University Registrar Components
import RegistrarDashboard from "../components/University/Registrar/RegistrarDashboard";
import RegistrarDegreeIssuance from "../components/University/Registrar/RegistrarDegreeIssuance";
import RegistrarStudentRecords from "../components/University/Registrar/RegistrarStudentRecords";
import RegistrarMigrationCertificates from "../components/University/Registrar/RegistrarMigrationCertificates";
import RegistrarNotifications from "../components/University/Registrar/RegistrarNotifications";
import RegistrarCompliance from "../components/University/Registrar/RegistrarCompliance";


// University Examination Body Components
import ExamBodyDashboard from "../components/University/ExamBody/ExamBodyDashboard";
import ExamBodyEntrancePolicy from "../components/University/ExamBody/ExamBodyEntrancePolicy";
import ExamBodyResultsEntry from "../components/University/ExamCell/ExamBodyResultsEntry.jsx";
import ExamBodySemesterPolicy from "../components/University/ExamBody/ExamBodySemesterPolicy";
import ExamBodyResultApproval from "../components/University/ExamBody/ExamBodyResultApproval";
import ExamBodySeatAllotmentApproval from "../components/University/ExamBody/ExamBodySeatAllotmentApproval";
import ExamBodyStaffController from "../components/University/ExamBody/ExamBodyStaffController";

// University Exam Cell Staff Components
import ExamCellDashboard from "../components/University/ExamCell/ExamCellDashboard";
import ExamCellScheduleEntranceExam from "../components/University/ExamCell/ExamCellScheduleEntranceExam";
import ExamCellConductSemesterExam from "../components/University/ExamCell/ExamCellConductSemesterExam";
import ExamCellAssignEvaluators from "../components/University/ExamCell/ExamCellAssignEvaluators";
import ExamCellCollectMarks from "../components/University/ExamCell/ExamCellCollectMarks";
import ExamCellExternalRegistration from "../components/University/ExamCell/ExamCellExternalRegistration";
import ExamCellPublishAdmitCard from "../components/University/ExamCell/ExamCellPublishAdmitCard";
import ExamCellResultProcessing from "../components/University/ExamCell/ExamCellResultProcessing";
import ExamCellSeatAllotmentExecution from "../components/University/ExamCell/ExamCellSeatAllotmentExecution";

// College Admin Components
import CollegeAdminDashboard from "../components/College/CollegeAdmin/CollegeAdminDashboard";
import CollegeAdminManageEmployees from "../components/College/CollegeAdmin/CollegeAdminManageEmployees";
import CollegeAdminPlacement from "../components/College/CollegeAdmin/CollegeAdminPlacement";
import CollegeAdminPublishInfo from "../components/College/CollegeAdmin/CollegeAdminPublishInfo";
import CollegeAdminAlumniConnect from "../components/College/CollegeAdmin/CollegeAdminAlumniConnect";
import CollegeAdminResources from "../components/College/CollegeAdmin/CollegeAdminResources";
import CollegeAdminApproveActivities from "../components/College/CollegeAdmin/CollegeAdminApproveActivities";
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

// College Director Components
import CollegeDirectorDashboard from "../components/College/CollegeDirector/CollegeDirectorDashboard";
import CollegeDirectorManageDeans from "../components/College/CollegeDirector/CollegeDirectorManageDeans";
import CollegeDirectorCollegeActivities from "../components/College/CollegeDirector/CollegeDirectorCollegeActivities";
import CollegeDirectorApproveBudget from "../components/College/CollegeDirector/CollegeDirectorApproveBudget";
import CollegeDirectorStudentAffairs from "../components/College/CollegeDirector/CollegeDirectorStudentAffairs";
import CollegeDirectorLeavesNOCs from "../components/College/CollegeDirector/CollegeDirectorLeavesNOCs";
import CollegeDirectorReports from "../components/College/CollegeDirector/CollegeDirectorReports";
import CollegeDirectorMeetings from "../components/College/CollegeDirector/CollegeDirectorMeetings";

// Common MyProfile Component (for all roles)
import MyProfile from "../components/Common/MyProfile";
import CollegeAdminManageCollege from "../components/College/CollegeAdmin/CollegeAdminManageCollege.jsx";
import CollegeAdminManageComplaints from "../components/College/CollegeAdmin/CollegeAdminManageComplaints.jsx";
import CollegeAdminManageFeedback from "../components/College/CollegeAdmin/CollegeAdminManageFeedback.jsx";
import StudentComplaintsAndFeedback from "../components/Student/StudentComplaintsAndFeedback.jsx";

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
            id: "complaints and feedback",
            label: "Complaints & Feedback",
            icon: ClipboardList,
            path: "/student/complaints-and-feedback",
            component: StudentComplaintsAndFeedback,
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
            id: "manage-courses",
            label: "Manage Courses",
            icon: BookOpen,
            path: "/university-admin/manage-courses",
            component: UniversityAdminManageCourses,
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
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/university-admin/my-profile",
            component: MyProfile,
            role: "UniversityAdmin",
        },
    ],

    UniversityGoverningBody: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/university-governing-body/dashboard",
            component: GoverningBodyDashboard,
            role: "UniversityGoverningBody",
        },
        {
            id: "college-reports",
            label: "View College Reports",
            icon: BarChart3,
            path: "/university-governing-body/college-reports",
            component: GoverningBodyCollegeReports,
            role: "UniversityGoverningBody",
        },
        {
            id: "policies",
            label: "Approve Policies",
            icon: ClipboardCheck,
            path: "/university-governing-body/policies",
            component: GoverningBodyPolicies,
            role: "UniversityGoverningBody",
        },
        {
            id: "admission-rules",
            label: "Set Admission Rules",
            icon: FileText,
            path: "/university-governing-body/admission-rules",
            component: GoverningBodyAdmissionRules,
            role: "UniversityGoverningBody",
        },
        {
            id: "budget",
            label: "Budget Approval",
            icon: Wallet,
            path: "/university-governing-body/budget",
            component: GoverningBodyBudget,
            role: "UniversityGoverningBody",
        },
        {
            id: "accreditation",
            label: "Review Accreditations",
            icon: Shield,
            path: "/university-governing-body/accreditation",
            component: GoverningBodyAccreditation,
            role: "UniversityGoverningBody",
        },
        {
            id: "new-colleges",
            label: "Approve New Colleges/Departments",
            icon: PlusSquare,
            path: "/university-governing-body/new-colleges",
            component: GoverningBodyNewColleges,
            role: "UniversityGoverningBody",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/university-governing-body/my-profile",
            component: MyProfile,
            role: "UniversityGoverningBody",
        },
    ],

    UniversityRegistrar: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/university-registrar/dashboard",
            component: RegistrarDashboard,
            role: "UniversityRegistrar",
        },
        {
            id: "degree-issuance",
            label: "Issue Degree",
            icon: Award,
            path: "/university-registrar/issue-degree",
            component: RegistrarDegreeIssuance,
            role: "UniversityRegistrar",
        },
        {
            id: "student-records",
            label: "Maintain Student Records",
            icon: Database,
            path: "/university-registrar/student-records",
            component: RegistrarStudentRecords,
            role: "UniversityRegistrar",
        },
        {
            id: "migration-certificates",
            label: "Migration / Transfer Certificates",
            icon: FileText,
            path: "/university-registrar/migration-certificates",
            component: RegistrarMigrationCertificates,
            role: "UniversityRegistrar",
        },
        {
            id: "notifications",
            label: "Publish Notifications",
            icon: Megaphone,
            path: "/university-registrar/notifications",
            component: RegistrarNotifications,
            role: "UniversityRegistrar",
        },
        {
            id: "compliance",
            label: "Legal & RTI Compliance",
            icon: ShieldCheck,
            path: "/university-registrar/compliance",
            component: RegistrarCompliance,
            role: "UniversityRegistrar",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/university-registrar/my-profile",
            component: MyProfile,
            role: "UniversityRegistrar",
        },
    ],

    UniversityExaminationBody: [

        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/university-exam-body/dashboard",
            component: ExamBodyDashboard,
            role: "UniversityExaminationBody",
        },
        {
            id: "entrance-policy",
            label: "Approve Entrance Exam Rules",
            icon: ClipboardList,
            path: "/university-exam-body/entrance-policy",
            component: ExamBodyEntrancePolicy,
            role: "UniversityExaminationBody",
        },
        {
            id: "semester-policy",
            label: "Conduct Semester Exam",
            icon: FileCheck,
            path: "/university-exam-body/semester-policy",
            component: ExamBodySemesterPolicy,
            role: "UniversityExaminationBody",
        },
        {
            id: "result-approval",
            label: "Approve Results",
            icon: CheckSquare,
            path: "/university-exam-body/result-approval",
            component: ExamBodyResultApproval,
            role: "UniversityExaminationBody",
        },
        {
            id: "seat-allotment-approval",
            label: "Approve Seat Allotment",
            icon: Users,
            path: "/university-exam-body/seat-allotment-approval",
            component: ExamBodySeatAllotmentApproval,
            role: "UniversityExaminationBody",
        },
        {
            id: "staff-controller",
            label: "Staff Controller",
            icon: UserCog,
            path: "/university-exam-body/staff-controller",
            component: ExamBodyStaffController,
            role: "UniversityExaminationBody",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/university-exam-body/my-profile",
            component: MyProfile,
            role: "UniversityExaminationBody",
        },
    ],


    UniversityExamCellStaff: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/university-exam-cell/dashboard",
            component: ExamCellDashboard,
            role: "UniversityExamCellStaff",
        },
        {
            id: "schedule-entrance-exam",
            label: "Schedule Entrance Exam",
            icon: Calendar,
            path: "/university-exam-cell/schedule-entrance-exam",
            component: ExamCellScheduleEntranceExam,
            role: "UniversityExamCellStaff",
        },
        {
            id: "conduct-semester-exam",
            label: "Conduct Semester Exam",
            icon: BookOpen,
            path: "/university-exam-cell/conduct-semester-exam",
            component: ExamCellConductSemesterExam,
            role: "UniversityExamCellStaff",
        },
        {
            id: "assign-evaluators",
            label: "Assign Evaluators",
            icon: PenLine,
            path: "/university-exam-cell/assign-evaluators",
            component: ExamCellAssignEvaluators,
            role: "UniversityExamCellStaff",
        },
        {
            id: "collect-marks",
            label: "Collect External Marks",
            icon: GraduationCap,
            path: "/university-exam-cell/collect-marks",
            component: ExamCellCollectMarks,
            role: "UniversityExamCellStaff",
        },
        {
            id: "external-registration",
            label: "External Exam Registration",
            icon: ClipboardList,
            path: "/university-exam-cell/external-registration",
            component: ExamCellExternalRegistration,
            role: "UniversityExamCellStaff",
        },
        {
            id: "publish-admit-card",
            label: "Publish Admit Card",
            icon: FileText,
            path: "/university-exam-cell/publish-admit-card",
            component: ExamCellPublishAdmitCard,
            role: "UniversityExamCellStaff",
        },
        {
            id: "result-processing",
            label: "Result Processing",
            icon: FileText,
            path: "/university-exam-cell/result-processing",
            component: ExamCellResultProcessing,
            role: "UniversityExamCellStaff",
        },
        {
            id: "seat-allotment-execution",
            label: "Seat Allotment Execution",
            icon: Users,
            path: "/university-exam-cell/seat-allotment-execution",
            component: ExamCellSeatAllotmentExecution,
            role: "UniversityExamCellStaff",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/university-exam-cell/my-profile",
            component: MyProfile,
            role: "UniversityExamCellStaff",
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
            id: "manage-employees",
            label: "Manage Employees",
            icon: Users,
            path: "/college-admin/manage-employees",
            component: CollegeAdminManageEmployees,
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
            id: "manage-college",
            label: "Manage College",
            icon: Folder,
            path: "/college-admin/manage-college",
            component: CollegeAdminManageCollege,
            role: "CollegeAdmin",
        },
        {
            id: "manage-complaints",
            label: "Manage Complaints",
            icon: MessageSquare,
            path: "/college-admin/manage-complaints",
            component: CollegeAdminManageComplaints,
            role: "CollegeAdmin",
        },
        {
            id: "manage-feedback",
            label: "Manage Feedback",
            icon: MessageSquare,
            path: "/college-admin/manage-feedback",
            component: CollegeAdminManageFeedback,
            role: "CollegeAdmin",
        },
        {
            id: "placement",
            label: "Placement Coordination",
            icon: Briefcase,
            path: "/college-admin/placement",
            component: CollegeAdminPlacement,
            role: "CollegeAdmin",
        },
        {
            id: "publish-info",
            label: "Publish Information",
            icon: Megaphone,
            path: "/college-admin/publish-info",
            component: CollegeAdminPublishInfo,
            role: "CollegeAdmin",
        },
        {
            id: "alumni-connect",
            label: "Alumni Connect",
            icon: Share2,
            path: "/college-admin/alumni-connect",
            component: CollegeAdminAlumniConnect,
            role: "CollegeAdmin",
        },
        {
            id: "resources",
            label: "Provide Resources",
            icon: Package,
            path: "/college-admin/resources",
            component: CollegeAdminResources,
            role: "CollegeAdmin",
        },
        {
            id: "approve-activities",
            label: "Approve College Activities",
            icon: ClipboardCheck,
            path: "/college-admin/approve-activities",
            component: CollegeAdminApproveActivities,
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

    CollegeDirector: [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/college-director/dashboard",
            component: CollegeDirectorDashboard,
            role: "CollegeDirector",
        },
        {
            id: "manage-deans",
            label: "Manage Deans & HODs",
            icon: Users,
            path: "/college-director/manage-deans",
            component: CollegeDirectorManageDeans,
            role: "CollegeDirector",
        },
        {
            id: "college-activities",
            label: "College Activities",
            icon: Users,
            path: "/college-director/college-activities",
            component: CollegeDirectorCollegeActivities,
            role: "CollegeDirector",
        },
        {
            id: "approve-budget",
            label: "Approve Budget",
            icon: Wallet,
            path: "/college-director/approve-budget",
            component: CollegeDirectorApproveBudget,
            role: "CollegeDirector",
        },
        {
            id: "student-affairs",
            label: "Student Affairs",
            icon: GraduationCap,
            path: "/college-director/student-affairs",
            component: CollegeDirectorStudentAffairs,
            role: "CollegeDirector",
        },
        {
            id: "leaves-nocs",
            label: "Leaves & NOCs",
            icon: ClipboardCheck,
            path: "/college-director/leaves-nocs",
            component: CollegeDirectorLeavesNOCs,
            role: "CollegeDirector",
        },
        {
            id: "reports",
            label: "Reports & Analytics",
            icon: BarChart3,
            path: "/college-director/reports",
            component: CollegeDirectorReports,
            role: "CollegeDirector",
        },
        {
            id: "meetings",
            label: "Meetings & Notices",
            icon: FileText,
            path: "/college-director/meetings",
            component: CollegeDirectorMeetings,
            role: "CollegeDirector",
        },
        {
            id: "my-profile",
            label: "My Profile",
            icon: User,
            path: "/college-director/my-profile",
            component: MyProfile,
            role: "CollegeDirector",
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
