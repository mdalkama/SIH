const getRoleDisplayName = (roleKey) => {
    const roleNames = {
        Student: "Student",
        UniversityAdmin: "University Admin",
        UniversityGoverningBody: "University Governing",
        UniversityRegistrar: "University Registrar",
        UniversityExamBody: "University Exam Body",
        UniversityExamCell: "University Exam Cell",
        CollegeAdmin: "College Admin",
        CollegeDirector: "College Director",
        CollegeDean: "College Dean",
        CollegeHOD: "College HOD",
        CollegeFaculty: "College Faculty",
        CollegeWarden: "College Warden",
        CollegeLibrarian: "College Librarian",
        CollegeAdmission: "College Admission",
        CollegeFinance: "College Finance",
        CollegeExamBody: "College Exam Body"
    };

    return roleNames[roleKey] || roleKey;
};

export default getRoleDisplayName;
