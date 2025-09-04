    const getRoleDisplayName = (roleKey) => {
        const roleNames = {
            student: "Student",
            UniversityAdmin: "University Admin",
            CollegeAdmin: "College Admin",
            CollegeFaculty: "Faculty",
            CollegeHOD: "HOD",
            CollegeDean: "Dean",
            CollegeDirector: "Director",
            CollegeLibrarian: "Librarian",
            CollegeHostelWarden: "Hostel Warden",
            CollegeFinanceBody: "Finance Officer",
            CollegeExaminationBody: "Exam Officer"
        };
        return roleNames[roleKey] || roleKey;
    };

    export default getRoleDisplayName;