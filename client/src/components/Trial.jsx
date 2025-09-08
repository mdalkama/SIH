import React, { useState } from 'react';
import { Mail, Phone, Lock, User, Briefcase, GraduationCap, Home, Book, FileText, Upload, ArrowLeft, CheckCircle, IndianRupee, Loader2, Camera } from 'lucide-react';

// --- Main Admission System Component ---
const AdmissionSystem = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Details
        applicantName: '',
        applicantNameHindi: '',
        fatherName: '',
        fatherNameHindi: '',
        motherName: '',
        motherNameHindi: '',
        dob: '',
        gender: '',
        email: '',
        mobile: '9876543210', // pre-filled for demo
        maritalStatus: '',
        nationality: 'Indian',
        religion: '',
        reservationCategory: '',
        identityProof: '',
        identityProofNumber: '',
        // Address Details
        permAddress1: '',
        permAddress2: '',
        permState: '',
        permDistrict: '',
        permCity: '',
        permPincode: '',
        corrAddressSame: true,
        corrAddress1: '',
        corrAddress2: '',
        corrState: '',
        corrDistrict: '',
        corrCity: '',
        corrPincode: '',
        // Other Details
        parentIncome: '200000',
        applyTFWS: 'Yes',
        // Qualification
        board: 'CBSE',
        passingYear: '2022',
        rollNumber: '',
        marksType: 'Percentage',
        maxMarks: '',
        marksObtained: '',
        percentage: '',
        // Documents
        photo: null,
        signature: null,
        aadhar: null,
        marksheet: null,
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Simple progress calculation
    const progress = (step - 1) / 6 * 100;

    return (
        <div className="min-h-screen font-sans">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="https://placehold.co/40x40/3B82F6/FFFFFF?text=DTE" alt="DTE Rajasthan Logo" className="h-10 w-10 rounded-full" />
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">Directorate of Technical Education</h1>
                            <p className="text-sm text-gray-500">Government of Rajasthan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 hidden md:block">Helpline: 0151-2970273</span>
                        <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Student Login</button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto py-8 px-4">
                <h2 className="text-center text-2xl font-bold text-gray-700 mb-2">Online Admission Application (2025-2026)</h2>
                <p className="text-center text-gray-500 mb-8">Diploma 1st Year Engineering</p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                    {step === 1 && <Step1 nextStep={nextStep} />}
                    {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} handleChange={handleChange} />}
                    {step === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} formData={formData} handleChange={handleChange} />}
                    {step === 4 && <Step4 nextStep={nextStep} prevStep={prevStep} formData={formData} handleChange={handleChange} />}
                    {step === 5 && <Step5 nextStep={nextStep} prevStep={prevStep} formData={formData} handleChange={handleChange} />}
                    {step === 6 && <Step6 nextStep={nextStep} prevStep={prevStep} formData={formData} />}
                    {step === 7 && <Step7 prevStep={prevStep} formData={formData} />}
                </div>
                <footer className="text-center mt-8 text-sm text-gray-500">
                    Copyright © 2025-2026. All rights reserved.
                </footer>
            </main>
        </div>
    );
};

// --- Step Components ---

const StepHeader = ({ icon, title, subtitle }) => (
    <div className="p-6 border-b border-gray-200 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
    </div>
);

const StepFooter = ({ onBack, onNext, backText = "Back", nextText = "Save & Next", loading = false }) => (
    <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        {onBack ? (
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
                <ArrowLeft size={16} /> {backText}
            </button>
        ) : <div></div>}

        <button onClick={onNext} disabled={loading} className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {nextText}
        </button>
    </div>
);


const Step1 = ({ nextStep }) => {
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);

    const handleSendOtp = () => setOtpSent(true);
    const handleVerifyOtp = async () => {
        setVerifying(true);
        await new Promise(res => setTimeout(res, 1000));
        if (otp === '1234') {
            nextStep();
        } else {
            alert("Invalid OTP. Please use 1234 for this demo.");
        }
        setVerifying(false);
    }

    return (
        <div>
            <StepHeader icon={<Phone size={24} />} title="Mobile Verification" subtitle="Please verify your mobile number to proceed." />
            <div className="p-8 text-center">
                <p className="text-gray-600 mb-4">An OTP will be sent to your mobile number for verification.</p>
                <div className="max-w-sm mx-auto">
                    <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500">
                        <span className="pl-2 pr-3 text-gray-500 border-r border-gray-300">+91</span>
                        <input type="tel" defaultValue="9876543210" disabled className="w-full px-3 py-1 bg-transparent focus:outline-none" />
                    </div>
                    {!otpSent ? (
                        <button onClick={handleSendOtp} className="w-full mt-4 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Send OTP</button>
                    ) : (
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                            <input type="text" value={otp} onChange={e => setOtp(e.target.value)} maxLength="4" className="w-48 mx-auto px-4 py-2 text-center text-lg tracking-[0.5em] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="----" />
                            <button onClick={handleVerifyOtp} disabled={verifying} className="w-full mt-4 px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50">
                                {verifying ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Verify OTP"}
                            </button>
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-8">Alternatively, you can also apply via SSO Login.</p>
            </div>
        </div>
    );
};

const FormRow = ({ children }) => <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
const FormField = ({ label, name, value, onChange, placeholder, required = false, children, type = "text" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        {children ? children : (
            <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        )}
    </div>
);


const Step2 = ({ nextStep, prevStep, formData, handleChange }) => (
    <div>
        <StepHeader icon={<User size={24} />} title="Personal Details" subtitle="Please fill in your personal information accurately." />
        <div className="p-6 space-y-6">
            <FormRow>
                <FormField label="Applicant's Name (English)" name="applicantName" value={formData.applicantName} onChange={handleChange} required />
                <FormField label="Applicant's Name (Hindi)" name="applicantNameHindi" value={formData.applicantNameHindi} onChange={handleChange} />
            </FormRow>
            <FormRow>
                <FormField label="Father's Name (English)" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
                <FormField label="Father's Name (Hindi)" name="fatherNameHindi" value={formData.fatherNameHindi} onChange={handleChange} />
            </FormRow>
            <FormRow>
                <FormField label="Mother's Name (English)" name="motherName" value={formData.motherName} onChange={handleChange} required />
                <FormField label="Mother's Name (Hindi)" name="motherNameHindi" value={formData.motherNameHindi} onChange={handleChange} />
            </FormRow>
            <FormRow>
                <FormField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                <FormField label="Gender" name="gender" value={formData.gender} onChange={handleChange} required>
                    <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </FormField>
            </FormRow>
            <FormRow>
                <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <FormField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} disabled>
                    <input type="tel" name="mobile" value={formData.mobile} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                </FormField>
            </FormRow>
            <FormRow>
                <FormField label="Reservation Category" name="reservationCategory" value={formData.reservationCategory} onChange={handleChange} required>
                    <select name="reservationCategory" value={formData.reservationCategory} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Category</option>
                        <option value="GEN">General</option>
                        <option value="EWS">EWS</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                    </select>
                </FormField>
                <FormField label="Religion" name="religion" value={formData.religion} onChange={handleChange} required>
                    <select name="religion" value={formData.religion} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Religion</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Christian">Christian</option>
                        <option value="Jain">Jain</option>
                        <option value="Other">Other</option>
                    </select>
                </FormField>
            </FormRow>
        </div>
        <StepFooter onBack={prevStep} onNext={nextStep} />
    </div>
);

const Step3 = ({ nextStep, prevStep, formData, handleChange }) => (
    <div>
        <StepHeader icon={<Home size={24} />} title="Address Details" subtitle="Provide your permanent and correspondence address." />
        <div className="p-6 space-y-6">
            <h4 className="font-semibold text-gray-700 border-b pb-2">Permanent Address</h4>
            <FormRow>
                <FormField label="Address Line 1" name="permAddress1" value={formData.permAddress1} onChange={handleChange} required />
                <FormField label="Address Line 2" name="permAddress2" value={formData.permAddress2} onChange={handleChange} />
            </FormRow>
            <FormRow>
                <FormField label="State" name="permState" value={formData.permState} onChange={handleChange} required />
                <FormField label="District" name="permDistrict" value={formData.permDistrict} onChange={handleChange} required />
            </FormRow>
            <FormRow>
                <FormField label="City/Village" name="permCity" value={formData.permCity} onChange={handleChange} required />
                <FormField label="Pincode" name="permPincode" value={formData.permPincode} onChange={handleChange} required />
            </FormRow>

            <h4 className="font-semibold text-gray-700 border-b pb-2 pt-4">Correspondence Address</h4>
            <div className="flex items-center">
                <input type="checkbox" id="corrAddressSame" name="corrAddressSame" checked={formData.corrAddressSame} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="corrAddressSame" className="ml-2 block text-sm text-gray-900">Same as Permanent Address</label>
            </div>

            {!formData.corrAddressSame && (
                <div className="space-y-6 mt-4">
                    <FormRow>
                        <FormField label="Address Line 1" name="corrAddress1" value={formData.corrAddress1} onChange={handleChange} required />
                        <FormField label="Address Line 2" name="corrAddress2" value={formData.corrAddress2} onChange={handleChange} />
                    </FormRow>
                    <FormRow>
                        <FormField label="State" name="corrState" value={formData.corrState} onChange={handleChange} required />
                        <FormField label="District" name="corrDistrict" value={formData.corrDistrict} onChange={handleChange} required />
                    </FormRow>
                    <FormRow>
                        <FormField label="City/Village" name="corrCity" value={formData.corrCity} onChange={handleChange} required />
                        <FormField label="Pincode" name="corrPincode" value={formData.corrPincode} onChange={handleChange} required />
                    </FormRow>
                </div>
            )}
        </div>
        <StepFooter onBack={prevStep} onNext={nextStep} />
    </div>
);

const Step4 = ({ nextStep, prevStep, formData, handleChange }) => (
    <div>
        <StepHeader icon={<GraduationCap size={24} />} title="Qualification Details" subtitle="Enter your 10th standard qualification details." />
        <div className="p-6 space-y-6">
            <FormRow>
                <FormField label="Board" name="board" value={formData.board} onChange={handleChange} required >
                    <select name="board" value={formData.board} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="STATE">State Board</option>
                        <option value="Other">Other</option>
                    </select>
                </FormField>
                <FormField label="Year of Passing" name="passingYear" value={formData.passingYear} onChange={handleChange} required />
            </FormRow>
            <FormRow>
                <FormField label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
                <FormField label="Marks Type" name="marksType" value={formData.marksType} onChange={handleChange} required >
                    <select name="marksType" value={formData.marksType} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Percentage">Percentage</option>
                        <option value="CGPA">CGPA</option>
                    </select>
                </FormField>
            </FormRow>
            <FormRow>
                <FormField label="Maximum Marks" name="maxMarks" type="number" value={formData.maxMarks} onChange={handleChange} required />
                <FormField label="Marks Obtained" name="marksObtained" type="number" value={formData.marksObtained} onChange={handleChange} required />
            </FormRow>
        </div>
        <StepFooter onBack={prevStep} onNext={nextStep} />
    </div>
);


const FileUploadField = ({ label, name, file, onChange, required = false }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mx-auto">
            {file ? <CheckCircle className="text-green-500" /> : <Upload size={24} />}
        </div>
        <label htmlFor={name} className="mt-4 block text-sm font-medium text-gray-700 cursor-pointer">
            {file ? file.name : `${label} ${required ? '*' : ''}`}
        </label>
        <p className="text-xs text-gray-500 mt-1">{file ? `Size: ${(file.size / 1024).toFixed(2)} KB` : 'PNG, JPG up to 500KB'}</p>
        <input type="file" id={name} name={name} onChange={onChange} className="sr-only" accept="image/png, image/jpeg" />
    </div>
);

const Step5 = ({ nextStep, prevStep, formData, handleChange }) => (
    <div>
        <StepHeader icon={<Upload size={24} />} title="Upload Documents" subtitle="Please upload the required documents." />
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadField label="Upload Photo" name="photo" file={formData.photo} onChange={handleChange} required />
            <FileUploadField label="Upload Signature" name="signature" file={formData.signature} onChange={handleChange} required />
            <FileUploadField label="Upload Aadhar Card" name="aadhar" file={formData.aadhar} onChange={handleChange} required />
            <FileUploadField label="Upload 10th Marksheet" name="marksheet" file={formData.marksheet} onChange={handleChange} required />
        </div>
        <StepFooter onBack={prevStep} onNext={nextStep} nextText="Preview Application" />
    </div>
);

const PreviewSection = ({ title, children }) => (
    <div className="mb-6">
        <h4 className="text-md font-bold text-gray-700 border-b-2 border-blue-200 pb-2 mb-4">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">{children}</div>
    </div>
);
const PreviewItem = ({ label, value }) => (
    <div className="flex">
        <span className="w-1/3 text-gray-500">{label}</span>
        <span className="w-2/3 font-semibold text-gray-800">{value || '-'}</span>
    </div>
);


const Step6 = ({ nextStep, prevStep, formData }) => (
    <div>
        <StepHeader icon={<FileText size={24} />} title="Application Preview" subtitle="Please review all your details carefully before submission." />
        <div className="p-6">
            <PreviewSection title="Personal Details">
                <PreviewItem label="Applicant Name" value={formData.applicantName} />
                <PreviewItem label="Father's Name" value={formData.fatherName} />
                <PreviewItem label="Mother's Name" value={formData.motherName} />
                <PreviewItem label="Date of Birth" value={formData.dob} />
                <PreviewItem label="Gender" value={formData.gender} />
                <PreviewItem label="Email" value={formData.email} />
                <PreviewItem label="Mobile" value={formData.mobile} />
                <PreviewItem label="Category" value={formData.reservationCategory} />
            </PreviewSection>
            <PreviewSection title="Address Details">
                <PreviewItem label="Permanent Address" value={`${formData.permAddress1}, ${formData.permCity}, ${formData.permState} - ${formData.permPincode}`} />
            </PreviewSection>
            <PreviewSection title="Qualification Details">
                <PreviewItem label="Board" value={formData.board} />
                <PreviewItem label="Passing Year" value={formData.passingYear} />
                <PreviewItem label="Roll Number" value={formData.rollNumber} />
                <PreviewItem label="Marks" value={`${formData.marksObtained} / ${formData.maxMarks}`} />
            </PreviewSection>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                <strong>Declaration:</strong> I hereby declare that all the information provided by me in this application form is true and correct to the best of my knowledge. I understand that if any information is found to be false, my admission may be cancelled.
            </div>
        </div>
        <StepFooter onBack={prevStep} onNext={nextStep} nextText="Final Submit & Make Payment" />
    </div>
);

const Step7 = ({ prevStep, formData }) => {
    const [paying, setPaying] = useState(false);
    const [paid, setPaid] = useState(false);
    const handlePayment = async () => {
        setPaying(true);
        await new Promise(res => setTimeout(res, 2000));
        setPaid(true);
        setPaying(false);
    }

    return (
        <div>
            <StepHeader icon={<IndianRupee size={24} />} title="Application Fee Payment" subtitle="Complete your application by paying the fee." />
            <div className="p-8 text-center">
                {paid ? (
                    <div className="max-w-md mx-auto">
                        <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">Payment Successful!</h3>
                        <p className="text-gray-600 mt-2">Your application has been submitted successfully. Your application ID is <span className="font-semibold text-gray-900">DTE202500123</span>.</p>
                        <p className="text-gray-600 mt-2">You can now download your application form.</p>
                        <button className="w-full mt-6 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Download Application</button>
                    </div>
                ) : (
                    <div className="max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-center text-sm mb-4">
                            <span className="text-gray-600">Applicant Name:</span>
                            <span className="font-semibold text-gray-800">{formData.applicantName}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-6">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-semibold text-gray-800">{formData.reservationCategory}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg border-t pt-4">
                            <span className="text-gray-600 font-bold">Application Fee:</span>
                            <span className="font-bold text-gray-900">₹ 300</span>
                        </div>

                        <button onClick={handlePayment} disabled={paying} className="w-full mt-6 px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50">
                            {paying ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Pay Now"}
                        </button>

                        <p className="text-xs text-gray-500 mt-4">Or, you can download the challan and pay at your nearest e-Mitra counter.</p>
                    </div>
                )}
                <button onClick={prevStep} className="mt-8 text-sm text-gray-600 hover:text-gray-800">Go Back to Preview</button>
            </div>
        </div>
    )
};


export default AdmissionSystem;

