import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';

const ResetPasswordPage = ({userType}) => {
	const { token } = useParams();
	const navigate = useNavigate();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

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
				navigate('/login');
			}, 3000);

		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="flex items-center justify-center py-12 px-4">
				<div className="w-full max-w-md">
					<div className="bg-white border border-gray-300 shadow-lg p-8">
						<div className="text-center mb-8">
							<div className="w-16 h-16 bg-[#186fc060] border-2 border-[#0D2841] rounded-full flex items-center justify-center mx-auto mb-4">
								<KeyRound className="w-8 h-8 text-[#0D2841]" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
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
											Resetting Password...
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