import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  GraduationCap,
  Calendar,
  Building,
  X,
  Save,
  AlertCircle
} from 'lucide-react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'view'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    degree: '',
    branch: '',
    specialization: '',
    totalSemester: '',
    semesters: []
  });
  const [error, setError] = useState('');

  // API Base URL - Update this to match your backend
  const API_BASE = '/api/v1/courses';

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const mockCourses = [
        {
          _id: '1',
          courseId: 'CS001',
          degree: 'Bachelor of Technology',
          branch: 'Computer Science',
          specialization: 'Artificial Intelligence',
          totalSemester: 8,
          semesters: [],
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          courseId: 'ME001',
          degree: 'Bachelor of Technology',
          branch: 'Mechanical Engineering',
          specialization: 'Robotics',
          totalSemester: 8,
          semesters: [],
          createdAt: new Date().toISOString()
        }
      ];
      setCourses(mockCourses);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.courseId || !formData.degree || !formData.totalSemester) {
      setError('Course ID, Degree, and Total Semesters are required');
      setLoading(false);
      return;
    }

    try {
      if (modalType === 'create') {
        // UNCOMMENT BELOW FOR ACTUAL API CALL:
        const response = await fetch( "https://sih-4ptm.onrender.com/api/v1/course", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        const newCourse = {
          _id: Date.now().toString(),
          ...formData,
          totalSemester: parseInt(formData.totalSemester),
          createdAt: new Date().toISOString()
        };
        setCourses([newCourse, ...courses]);

      } else if (modalType === 'edit') {
        // UNCOMMENT BELOW FOR ACTUAL API CALL:
        // const response = await fetch(`${API_BASE}/${selectedCourse._id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        // const result = await response.json();
        // if (!response.ok) throw new Error(result.message);

        // Mock update - REMOVE THIS when connecting to real API
        setCourses(courses.map(course =>
          course._id === selectedCourse._id
            ? { ...course, ...formData, totalSemester: parseInt(formData.totalSemester) }
            : course
        ));
      }

      handleCloseModal();
      // Uncomment the line below when using real API:
      // fetchCourses();
    } catch (err) {
      setError(err.message || 'Operation failed. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    setLoading(true);
    try {
      // UNCOMMENT BELOW FOR ACTUAL API CALL:
      // const response = await fetch(`${API_BASE}/${courseId}`, { method: 'DELETE' });
      // const result = await response.json();
      // if (!response.ok) throw new Error(result.message);

      // Mock delete - REMOVE THIS when connecting to real API
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (err) {
      setError('Failed to delete course');
      console.error('Error deleting course:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type, course = null) => {
    setModalType(type);
    setSelectedCourse(course);

    if (type === 'create') {
      setFormData({
        courseId: '',
        degree: '',
        branch: '',
        specialization: '',
        totalSemester: '',
        semesters: []
      });
    } else if (course) {
      setFormData({
        courseId: course.courseId,
        degree: course.degree,
        branch: course.branch || '',
        specialization: course.specialization || '',
        totalSemester: course.totalSemester.toString(),
        semesters: course.semesters || []
      });
    }

    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredCourses = courses.filter(course =>
    course.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.branch && course.branch.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (course.specialization && course.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
              <p className="text-gray-600">Manage university courses and programs</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal('create')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Course
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Courses Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map(course => (
            <div key={course._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-600">{course.courseId}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal('view', course)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenModal('edit', course)}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    title="Edit Course"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{course.degree}</h3>

              {course.branch && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Building className="w-4 h-4" />
                  {course.branch}
                </div>
              )}

              {course.specialization && (
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Specialization:</span> {course.specialization}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {course.totalSemester} Semesters
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No courses found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {modalType === 'create' && 'Create New Course'}
                {modalType === 'edit' && 'Edit Course'}
                {modalType === 'view' && 'Course Details'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {modalType === 'view' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                      <p className="text-gray-900">{selectedCourse?.courseId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Semesters</label>
                      <p className="text-gray-900">{selectedCourse?.totalSemester}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <p className="text-gray-900">{selectedCourse?.degree}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <p className="text-gray-900">{selectedCourse?.branch || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <p className="text-gray-900">{selectedCourse?.specialization || 'Not specified'}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., CS001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Semesters <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="totalSemester"
                        value={formData.totalSemester}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="12"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Bachelor of Technology"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Artificial Intelligence"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : 'Save Course'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;