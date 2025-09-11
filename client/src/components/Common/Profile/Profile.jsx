import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { checkStaffOrStudent } from '../../../utils/checkStaffOrStudentUtils';
import StudentProfile from './Student/StudentProfile';
import StaffProfile from './Staff/StaffProfile';
import Loading from '../../Loading';

const Profile = () => {
  const { user, loading } = useUser();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (user) {
      const type = checkStaffOrStudent(user.role);
      setUserType(type);
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Please login to view profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {userType === 'student' && <StudentProfile />}
      {userType === 'staff' && <StaffProfile />}
      {!userType && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">Invalid user type</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;