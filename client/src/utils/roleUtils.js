const getRoleDisplayName = (roleKey) => {
    const roleNames = {
        Student: "Student",
        UniversityAdmin: "University Admin",
        UniversityGoverningBody: "University Governing",
        UniversityRegistrar: "University Registrar",
        UniversityExaminationBody: "University Exam Body",
        UniversityExamCellStaff: "University Exam Cell",
        CollegeAdmin: "College Admin",
        CollegeDirector: "Director",
        CollegeDean: "Dean",
        CollegeHOD: "HOD",
        CollegeFaculty: "Faculty",
        CollegeHostelWarden: "Hostel Warden",
        CollegeLibrarian: "Librarian",
        CollegeAdmissionDepartment: "Admission Department",
        CollegeFinance: "Finance Department",
        CollegeExaminationBody: "Examination Controller"
    };

    return roleNames[roleKey] || roleKey;
};

export default getRoleDisplayName;
