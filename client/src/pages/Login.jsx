import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Users, ArrowLeft, AlertCircle, Shield, Building2 } from 'lucide-react';
import Footer from './DTE_home/footer';

const Mylogin = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotSuccess, setForgotSuccess] = useState(false);

    // Set role based on URL parameter when component mounts
    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam && (roleParam === 'student' || roleParam === 'staff')) {
            setRole(roleParam);
        }
    }, [searchParams]);


    // Handle login
    const handleLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/${role}/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Invalid credentials. Please try again.");
                setIsLoading(false);
                return;
            }
            // redirect according to role 
            if (data) {
                setUser(data.user);
                console.log(data);
                switch (data.user.role) {
                    case 'student':
                        navigate('/student/dashboard');
                        break;
                    case 'UniversityAdmin':
                        navigate('/university-admin/dashboard');
                        break;
                    case 'UniversityGoverningBody':
                        navigate('/university-governing-body/dashboard');
                        break;
                    case 'UniversityRegistrar':
                        navigate('/university-registrar/dashboard');
                        break;
                    case 'UniversityExaminationBody':
                        navigate('/university-examination-body/dashboard');
                        break;
                    case 'UniversityFinanceBody':
                        navigate('/university-finance-body/dashboard');
                        break;
                    case 'CollegeAdmin':
                        navigate('/college-admin/dashboard');
                        break;
                    case 'CollegeDirector':
                        navigate('/college-director/dashboard');
                        break;
                    case 'CollegeDean':
                        navigate('/college-dean/dashboard');
                        break;
                    case 'CollegeHOD':
                        navigate('/college-hod/dashboard');
                        break;
                    case 'CollegeFaculty':
                        navigate('/college-faculty/dashboard');
                        break;
                    case 'CollegeHostelWarden':
                        navigate('/college-hostel-warden/dashboard');
                        break;
                    case 'CollegeLibrarian':
                        navigate('/college-librarian/dashboard');
                        break;
                    case 'CollegeFinanceBody':
                        navigate('/college-finance-body/dashboard');
                        break;
                    default:
                        navigate('/login')
                }
            }
        } catch {
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setForgotLoading(true);
        setError("");

        try {
            const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/${role}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail }),
            });

            const data = await res.json();

            if (res.ok) {
                setForgotSuccess(true);
            } else {
                setError(data.message || "Failed to send reset email.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setForgotLoading(false);
        }
    };

    const resetForgotPassword = () => {
        setShowForgotPassword(false);
        setForgotEmail("");
        setForgotSuccess(false);
        setError("");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const handleForgotKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleForgotPassword();
        }
    };
    // forget password
    if (showForgotPassword) {
        return (
            <div className="min-h-screen flex items-center justify-center relative">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://hte.rajasthan.gov.in/css_index/images/s1old.jpg)',
                        opacity: '0.3'
                    }}
                ></div>
                
                <div className="flex items-center justify-center py-12 px-4 relative z-10">
                    <div className="w-full max-w-md">
                        <div className="bg-white border border-gray-300 shadow-lg p-8 relative">
                            <div className="text-center mb-8">
                                <button
                                    onClick={resetForgotPassword}
                                    className="absolute top-6 left-6 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="w-16 h-16 bg-[#186fc060] border-2 border-[#0D2841] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-[#0D2841]" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Recovery</h2>
                                <p className="text-gray-600 text-sm">
                                    Enter your registered email address to receive password reset instructions
                                </p>
                            </div>

                            {forgotSuccess ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 border-2 border-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Sent Successfully</h3>
                                    <p className="text-gray-600 text-sm mb-6">
                                        Password reset instructions have been sent to {forgotEmail}
                                    </p>
                                    <button
                                        onClick={resetForgotPassword}
                                        className="w-full bg-blue-800 text-white py-3 hover:bg-blue-900 transition-colors font-semibold border"
                                    >
                                        Return to Login
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            <input
                                                type="email"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                onKeyPress={handleForgotKeyPress}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:border-blue-800 focus:outline-none transition-all"
                                                placeholder="Enter your registered email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 p-3 bg-red-50 border-l-4 border-red-500">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                            <p className="text-red-800 text-sm font-medium">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        disabled={forgotLoading}
                                        className="w-full bg-[#0D2841] text-white py-3 hover:bg-[#083056] transition-colors font-semibold border disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {forgotLoading ? "Sending Instructions..." : "Send Reset Instructions"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // login form
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header Section - Logo Area Only */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 md:space-x-8">
                            <div className="flex-shrink-0">
                                <img 
                                    src="https://svumshow.com/assets/images/department-logo/pngwing.png" 
                                    alt="Government of Rajasthan Logo" 
                                    className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain"
                                />
                            </div>
                            <div className="text-left">
                                <h1 className="text-xs md:text-sm lg:text-base font-bold text-gray-800 leading-tight mb-1">
                                    राजस्थान सरकार
                                </h1>
                                <h2 className="text-xs md:text-sm lg:text-base font-bold text-gray-800 leading-tight mb-2">
                                    तकनीकी शिक्षा निदेशालय
                                </h2>
                                <h4 className="text-[10px] md:text-xs lg:text-sm font-semibold text-blue-600">
                                    Government of Rajasthan - Department of Technical Education
                                </h4>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <img 
                                src="https://dte.rajasthan.gov.in/assets/img/mono.jpg" 
                                alt="DTE Mono Logo" 
                                className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 object-cover rounded-full border border-gray-200"
                            />
                            <img 
                                src="https://dte.rajasthan.gov.in/assets/img/Azadi.png" 
                                alt="Azadi Ka Amrit Mahotsav" 
                                className="h-10 md:h-12 lg:h-16 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area with Background */}
            <div className="flex-1 flex relative">
                {/* Full Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://hte.rajasthan.gov.in/css_index/images/s1old.jpg)',
                        opacity: '0.3'
                    }}
                ></div>
                
                {/* Left Side - Welcome Text */}
                <div className="hidden lg:flex lg:w-1/2 relative z-10">
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center">
                            <h1 className="text-6xl font-bold text-gray-800 mb-4">
                                Welcome to DTE Rajasthan
                            </h1>
                            <p className="text-lg text-gray-600">
                                Department of Technical Education, Government of Rajasthan
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 relative z-10">
                    <div className="w-full max-w-md">
                        <div className="bg-white border border-gray-300 shadow-2xl rounded-lg">
                            {/* Login Header */}
                            <div className="bg-[#0D2841] text-white p-6 text-center">
                                <h2 className="text-xl font-bold mb-1">Government of Rajasthan</h2>
                                <p className="text-blue-100 text-sm">Access your academic account</p>
                            </div>

                        <div className="p-8">
                            {/* Role Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                    Select User Type *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRole("student")}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 border-2 transition-all font-medium ${role === "student"
                                            ? "border-[#0D2841] bg-blue-50 text-[#0D2841]"
                                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                            }`}
                                    >
                                        <User size={18} />
                                        <span>Student</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole("staff")}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 border-2 transition-all font-medium ${role === "staff"
                                            ? "border-[#0D2841] bg-blue-50 text-[#0D2841]"
                                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                            }`}
                                    >
                                        <Users size={18} />
                                        <span>Staff</span>
                                    </button>
                                </div>
                            </div>

                            {/* Login Form */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:border-[#0D2841] focus:outline-none transition-all"
                                            placeholder="Enter your registered email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 focus:border-[#0D2841] focus:outline-none transition-all"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border-l-4 border-red-500">
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                        <p className="text-red-800 text-sm font-medium">{error}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-600">
                                        * Required fields
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForgotPassword(true)
                                            setError("")
                                        }
                                        }
                                        className="text-sm text-blue-800 hover:text-blue-900 font-medium transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className="w-full bg-[#0D2841] text-white py-3 hover:bg-[#0e2f4e] transition-colors font-semibold border disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Authenticating...
                                        </>
                                    ) : (
                                        `LOGIN AS ${role.toUpperCase()}`
                                    )}
                                </button>

                                <div className="text-center pt-4 border-t">
                                    <p className="text-xs text-gray-600">
                                        This is a secure government portal. Unauthorized access is prohibited.
                                    </p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Mylogin;