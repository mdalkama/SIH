import React, { useState } from 'react';
// Step 1: `useSearchParams` aur `Link` ko import karein
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';

// Prop (userType) ki ab zaroorat nahi hai
const ResetPasswordPage = () => {
    // Step 2: `useSearchParams` ka istemaal karein
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

    // URL se 'token' aur 'role' nikalein
    const token = searchParams.get('token');
    const userType = searchParams.get('role');

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

    // Invalid link ke liye error handling
    if (!token || !userType || (userType !== 'student' && userType !== 'staff')) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
                <div>
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800">Invalid Link</h1>
                    <p className="text-gray-600 mt-2">The password reset link is incorrect or missing information. Please request a new one.</p>
                    <Link to="/login" className="mt-6 inline-block bg-[#0D2841] text-white px-6 py-2 rounded-md hover:bg-[#083056]">
                        Go to Login Page
                    </Link>
                </div>
            </div>
        );
    }

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (password.length < 6) {
			setError('Password must be at least 6 characters long.');
			return;
		}
		if (password !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		setIsLoading(true);

		try {
			const res = await fetch(`https://sih-4ptm.onrender.com/api/v1/${userType}/reset-password/${token}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Failed to reset password. The link may be invalid or expired.');
			}

			setSuccess('Your password has been reset successfully! Redirecting to login...');
			setTimeout(() => {
				navigate(`/login?role=${userType}`);
			}, 3000);

		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
        // Aapka original design yahan se shuru hota hai
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="flex items-center justify-center py-12 px-4">
				<div className="w-full sm:w-[448px]">
					<div className="bg-white border border-gray-300 shadow-lg p-8">
						<div className="text-center mb-8">
							<div className="w-16 h-16 bg-[#186fc060] border-2 border-[#0D2841] rounded-full flex items-center justify-center mx-auto mb-4">
								<KeyRound className="w-8 h-8 text-[#0D2841]" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{userType} - Set New Password</h2>
							<p className="text-gray-600 text-sm">
								Create a new, strong password for your account.
							</p>
						</div>

						{success ? (
							<div className="text-center">
								<div className="w-16 h-16 bg-green-100 border-2 border-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
									<CheckCircle className="w-8 h-8 text-green-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">Password Reset!</h3>
								<p className="text-gray-600 text-sm">{success}</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label className="block text-sm font-semibold text-gray-800 mb-2">
										New Password *
									</label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
										<input
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 focus:border-[#0D2841] focus:outline-none transition-all"
											placeholder="Enter new password"
											required
										/>
										<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
											{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</button>
									</div>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-800 mb-2">
										Confirm New Password *
									</label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
										<input
											type="password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:border-[#0D2841] focus:outline-none transition-all"
											placeholder="Confirm new password"
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
									type="submit"
									disabled={isLoading}
									className="w-full bg-[#0D2841] text-white py-3 hover:bg-[#083056] transition-colors font-semibold border disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{isLoading ? (
										<>
											<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											<span>Resetting Password...</span>
										</>
									) : "Reset Password"}
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordPage;