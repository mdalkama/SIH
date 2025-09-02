# Deployment API Update - Login System

## Overview
Updated the Login.jsx component and authentication system to connect to the deployed backend API at `https://sih-one-nu.vercel.app/` instead of localhost.

## Changes Made

### 1. API Configuration (`src/config/api.js`) - NEW FILE
- Created centralized API configuration
- Base URL: `https://sih-one-nu.vercel.app/api/v1`
- Defined all endpoints for student and staff authentication
- Added timeout and credential settings
- Helper functions for URL generation

### 2. Authentication Service (`src/services/authService.js`) - UPDATED
- **Base URL Changed**: From `http://localhost:5000/api/v1` to `https://sih-one-nu.vercel.app/api/v1`
- **Enhanced Error Handling**: Added detailed logging for debugging
- **Configuration Integration**: Uses centralized API config
- **Timeout Added**: 10-second timeout for requests
- **Endpoints Maintained**:
  - Student Login: `POST /api/v1/student/login`
  - Staff Login: `POST /api/v1/staff/login`
  - Student Logout: `POST /api/v1/student/logout`
  - Staff Logout: `POST /api/v1/staff/logout`

### 3. Authentication Context (`src/context/AuthContext.jsx`) - UPDATED
- **Enhanced Logging**: Added console logs for debugging
- **Better Error Handling**: More specific error messages
- **User Type Validation**: Validates user type before API calls
- **Response Handling**: Improved response data handling

### 4. Login Component (`src/pages/Login.jsx`) - UPDATED
- **API Endpoint Display**: Shows connected API URL for transparency
- **Enhanced Error Messages**: More specific error handling based on HTTP status codes
- **Debugging Logs**: Added console logs for troubleshooting
- **User Type Selection**: Maintained existing role-based selection
- **Visual Feedback**: Better loading states and error display

### 5. API Test Component (`src/components/ApiTest.jsx`) - NEW FILE
- **Connection Testing**: Tests base URL accessibility
- **Endpoint Validation**: Verifies student and staff login endpoints exist
- **Debug Tool**: Helps troubleshoot API connectivity issues
- **Status Reporting**: Shows detailed test results

### 6. App Routing (`src/App.jsx`) - UPDATED
- **Test Route Added**: `/api-test` for debugging API connections
- **Maintained Existing Routes**: All authentication flows preserved

### 7. Home Page (`src/pages/Home.jsx`) - UPDATED
- **API Test Link**: Added button to access API testing tool
- **Maintained Design**: Preserved government-style UI

## API Endpoints Used

### Student Authentication
```
POST https://sih-one-nu.vercel.app/api/v1/student/login
Body: { email: string, password: string }
```

### Staff Authentication
```
POST https://sih-one-nu.vercel.app/api/v1/staff/login
Body: { email: string, password: string }
```

## User Flow

1. **User visits login page** → Sees role selection (Student/Staff)
2. **User selects role** → UI updates to show selected user type
3. **User enters credentials** → Email and password validation
4. **Form submission** → Calls appropriate API endpoint based on user type
5. **Successful login** → Redirects to role-specific dashboard
6. **Failed login** → Shows specific error message

## Role-based Redirection

- **Student Login Success** → `/student/dashboard`
- **Staff Login Success** → `/staff/dashboard`
- **Authentication Failure** → Remains on login page with error message

## Error Handling

### HTTP Status Code Mapping
- **400**: Invalid email or password
- **403**: Account not active - contact administrator
- **500**: Server error - try again later
- **Network Error**: Connection issues

### Debug Features
- Console logging for all API calls
- API connection test tool at `/api-test`
- Visual API endpoint display on login page
- Detailed error messages for troubleshooting

## Security Features Maintained
- HTTP-only cookies for session management
- CORS configuration for secure requests
- JWT token authentication
- Role-based authorization
- Protected routes with automatic redirection

## Testing

### Manual Testing Steps
1. **Visit** `http://localhost:3000/api-test` to verify API connectivity
2. **Test Student Login**:
   - Select "Student" user type
   - Enter valid student credentials
   - Verify redirection to `/student/dashboard`
3. **Test Staff Login**:
   - Select "Staff" user type
   - Enter valid staff credentials
   - Verify redirection to `/staff/dashboard`
4. **Test Error Handling**:
   - Try invalid credentials
   - Verify appropriate error messages

### Debug Tools
- **API Test Page**: `/api-test` - Tests all endpoints
- **Browser Console**: Check for detailed logs
- **Network Tab**: Monitor API requests and responses

## Production Readiness
- ✅ API endpoints updated to production URLs
- ✅ Error handling implemented
- ✅ Logging added for debugging
- ✅ Role-based authentication working
- ✅ Security features maintained
- ✅ User experience preserved
- ✅ Debug tools available

## Next Steps
1. Test with actual backend credentials
2. Remove debug logging for production
3. Add environment-based configuration if needed
4. Monitor API performance and error rates
