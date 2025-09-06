const getRoleDisplayName = (roleKey) => {
    const roleNames = {
        Student: "Student",
        UniversityAdmin: "University Admin",
        UniversityGoverningBody: "University Governing",
        UniversityRegistrar: "University Registrar",
        UniversityExamBody: "University Exam Body",
        UniversityExamCell: "University Exam Cell",
        CollegeAdmin: "College Admin",
        CollegeDirector: "Director",
        CollegeDean: "Dean",
        CollegeHOD: "HOD",
        CollegeFaculty: "Faculty",
        CollegeHostelWarden: "Hostel Warden",
        CollegeLibrarian: "Librarian",
        CollegeAdmissionDepartment: "Admission Department",
        CollegeFinance: "Finance Department",
        CollegeExamBody: "Examination Controller"
    };

    return roleNames[roleKey] || roleKey;
};

export default getRoleDisplayName;
