import React, { useState } from 'react';
import { UserPlus, Loader2, CheckCircle, AlertTriangle, X } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/add-university-Staff';

// --- Helper Components ---
const Toast = ({ message, type, onClose }) => {
    React.useEffect(() => { const timer = setTimeout(onClose, 4000); return () => clearTimeout(timer); }, [onClose]);
    const isError = type === 'error';
    return (
        <div className={`fixed top-5 right-5 z-[100] flex items-center p-4 rounded-lg shadow-lg bg-white border-l-4 ${isError ? 'border-red-500' : 'border-green-500'}`}>
            <div className={`text-lg ${isError ? 'text-red-500' : 'text-green-500'}`}>{isError ? <AlertTriangle /> : <CheckCircle />}</div>
            <p className="ml-3 text-sm font-medium text-slate-800">{message}</p>
        </div>
    );
};

const InputField = ({ label, name, value, onChange, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={name} name={name} value={value} onChange={onChange} {...props} className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" required />
    </div>
);

const SelectField = ({ label, name, value, onChange, children }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-indigo-500" required>
            {children}
        </select>
    </div>
);

// --- Main Component for Adding Exam Cell Staff ---
const AddExamCellStaff = () => {
    const initialState = { name: '', email: '', password: '', staffId: '', gender: 'Male', salary: '', phone: '' };
    const [formData, setFormData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setToast(null);

        // The endpoint is now fixed to add only Exam Cell Staff
        const endpoint = '/add-exam-cell-staff';

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || `Failed to add Exam Cell Staff.`);
            }
            setToast({ type: 'success', message: `Exam Cell Staff added successfully!` });
            setFormData(initialState); // Reset form on success
        } catch (error) {
            setToast({ type: 'error', message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="font-sans">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Add University Exam Cell Staff</h1>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" />
                        <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
                        <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter a strong password" />
                        <InputField label="Staff ID" name="staffId" value={formData.staffId} onChange={handleChange} placeholder="Enter unique Staff ID" />
                        <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Enter 10-digit mobile number" />
                        <InputField label="Salary" name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="Enter salary amount" />
                        <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </SelectField>
                    </div>
                    <div className="mt-8 pt-6 border-t flex justify-end">
                        <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg disabled:bg-indigo-300 flex items-center justify-center font-semibold hover:bg-indigo-700 shadow-sm">
                            {isLoading ? (
                                <><Loader2 size={18} className="animate-spin mr-2" /> Adding Staff...</>
                            ) : (
                                <><UserPlus size={18} className="mr-2" /> Add Exam Cell Staff</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExamCellStaff;