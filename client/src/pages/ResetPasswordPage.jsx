import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';

const ResetPasswordPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const token = searchParams.get('token');
	const userType = searchParams.get('role'); 

	// All state management remains the same
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	if (!token || !userType || (userType !== 'student' && userType !== 'staff')) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
				<div>
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h1 className="text-2xl font-bold text-gray-800">Invalid Link</h1>
					<p className="text-gray-600 mt-2">The password reset link is incorrect or missing information. Please request a new one.</p>
					<Link to="/login" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
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
				// Step 6: Redirect to the login page with the correct role pre-selected
				navigate(`/login?role=${userType}`);
			}, 3000);

		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	// The JSX remains largely the same, just with a dynamic title
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden">
				<div className="p-8">
					<div className="text-center mb-6">
						<KeyRound className="w-12 h-12 text-blue-600 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-800 capitalize">{userType} Account</h2>
						<p className="text-gray-600">Set a New Password</p>
					</div>

					{success ? (
						<div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
							<CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
							<h3 className="text-lg font-semibold text-green-800">Password Reset Successfully!</h3>
							<p className="text-green-700 mt-2">{success}</p>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
									<input
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
										placeholder="Enter new password (min. 6 characters)"
										required
									/>
									<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password *</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
									<input
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
										placeholder="Confirm the new password"
										required
									/>
								</div>
							</div>

							{error && (
								<div className="flex items-start gap-3 p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
									<AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
									<p className="text-sm font-medium">{error}</p>
								</div>
							)}

							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
							>
								{isLoading ? (
									<>
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Resetting Password...</span>
									</>
								) : "Set New Password"}
							</button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordPage;