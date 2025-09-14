// Utility to extract course configurations dynamically from header navigation
export const getCoursesFromNavigation = () => {
  // This matches the structure from header_dte.jsx
  const navigationConfig = {
    name: 'Admissions',
    items: [
      { 
        name: 'Diploma Engineering', 
        subitems: [
          { name: 'First Year Diploma Engineering', path: '/admission/diploma-engineering-first-year' },
          { name: 'Lateral Entry Diploma Engineering', path: '/admission/diploma-engineering-lateral-entry' }
        ]
      },
      { 
        name: 'Diploma Non-Engineering', 
        subitems: [
          { name: 'First Year Diploma Non-Engineering', path: '/admission/diploma-non-engineering-first-year' },
          { name: 'Second Year Graduate Non-Engineering Courses', path: '/admission/diploma-non-engineering-second-year-graduate' },
          { name: 'First Year Degree Non-Engineering', path: '/admission/diploma-non-engineering-first-year-degree' }
        ]
      }
    ]
  };

  const courses = {};
  
  navigationConfig.items.forEach(category => {
    if (category.subitems) {
      category.subitems.forEach(subitem => {
        if (subitem.path && subitem.path.startsWith('/admission/')) {
          const courseId = subitem.path.replace('/admission/', '');
          
          // Generate course configuration based on course ID
          let admissionType = 'diploma';
          let formName = `${subitem.name} Admission Form 2025`;
          
          // Determine admission type based on course name
          if (subitem.name.toLowerCase().includes('degree')) {
            admissionType = 'degree';
          } else if (subitem.name.toLowerCase().includes('bsc') || subitem.name.toLowerCase().includes('b.sc')) {
            admissionType = 'degree';
          } else if (subitem.name.toLowerCase().includes('iti')) {
            admissionType = 'iti';
          }
          
          courses[courseId] = {
            formName,
            admissionType,
            sessionYear: '2025',
            displayName: subitem.name
          };
        }
      });
    }
  });

  return courses;
};

// Get available course IDs
export const getAvailableCourseIds = () => {
  return Object.keys(getCoursesFromNavigation());
};

// Check if a course ID is valid
export const isValidCourseId = (courseId) => {
  return getAvailableCourseIds().includes(courseId);
};

// Get course configuration by ID
export const getCourseConfig = (courseId) => {
  const courses = getCoursesFromNavigation();
  return courses[courseId] || {
    formName: 'Admission Form 2025',
    admissionType: 'diploma',
    sessionYear: '2025',
    displayName: 'Unknown Course'
  };
};
