import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, PlusCircle, Eye, Edit, Users, Search, X, Save, Building2, Briefcase, IndianRupee, Calendar } from 'lucide-react';

const API_BASE_URL = 'https://sih-4ptm.onrender.com/api/v1/placements';

// --- Helper Components ---
const FormInput = ({ label, name, ...props }) => (<div><label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label><input id={name} name={name} {...props} className="w-full px-3 py-2 border border-slate-300 rounded-lg" required /></div>);
const FormTextarea = ({ label, name, ...props }) => (<div><label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label><textarea id={name} name={name} {...props} rows="4" className="w-full px-3 py-2 border border-slate-300 rounded-lg" required></textarea></div>);
const FormSelect = ({ label, name, ...props }) => (<div><label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label><select id={name} name={name} {...props} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" required></select></div>);

const DriveFormModal = ({ isOpen, onClose, onSave, drive, isSaving }) => {
    const [formData, setFormData] = useState({});
    
    useEffect(() => {
        if (drive) {
            setFormData({ ...drive, eligibleCourses: drive.eligibleCourses.join(', '), applicationDeadline: drive.applicationDeadline ? new Date(drive.applicationDeadline).toISOString().split('T')[0] : '' });
        } else {
            setFormData({ companyName: '', jobTitle: '', jobDescription: '', packageLPA: '', eligibleCourses: '', minCGPA: '', applicationDeadline: '', status: 'UPCOMING' });
        }
    }, [drive]);

    const handleChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); const payload = { ...formData, packageLPA: Number(formData.packageLPA), minCGPA: Number(formData.minCGPA), eligibleCourses: formData.eligibleCourses.split(',').map(s => s.trim().toUpperCase()) }; onSave(payload, drive?._id); };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><form onSubmit={handleSubmit}>
                <div className="p-4 border-b flex justify-between items-center"><h2 className="text-lg font-bold text-slate-800">{drive ? 'Edit' : 'Create'} Placement Drive</h2><button type="button" onClick={onClose}><X className="text-slate-500"/></button></div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                    <FormInput label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
                    <FormInput label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
                    <div className="md:col-span-2"><FormTextarea label="Job Description" name="jobDescription" value={formData.jobDescription} onChange={handleChange} /></div>
                    <FormInput label="Package (LPA)" name="packageLPA" type="number" step="0.1" value={formData.packageLPA} onChange={handleChange} />
                    <FormInput label="Min CGPA" name="minCGPA" type="number" step="0.1" value={formData.minCGPA} onChange={handleChange} />
                    <FormInput label="Eligible Courses (comma-separated)" name="eligibleCourses" value={formData.eligibleCourses} onChange={handleChange} placeholder="e.g., CSE, ECE" />
                    <FormInput label="Application Deadline" name="applicationDeadline" type="date" value={formData.applicationDeadline} onChange={handleChange} />
                    <FormSelect label="Status" name="status" value={formData.status} onChange={handleChange}>
                        <option value="UPCOMING">Upcoming</option><option value="OPEN">Open</option><option value="CLOSED">Closed</option><option value="COMPLETED">Completed</option>
                    </FormSelect>
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-white border rounded-lg hover:bg-slate-100 font-semibold">Cancel</button>
                    <button type="submit" disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 font-semibold">{isSaving ? <><Loader2 className="animate-spin" size={16}/> Saving...</> : <><Save size={16}/> Save Drive</>}</button>
                </div>
            </form></div>
        </div>
    );
};

const ApplicationsModal = ({ isOpen, onClose, drive }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl"><div className="p-4 border-b flex justify-between items-center"><h2 className="text-lg font-bold">Applications for {drive?.companyName}</h2><button type="button" onClick={onClose}><X className="text-slate-500"/></button></div><div className="p-6 max-h-[70vh] overflow-y-auto">{drive?.applications?.length > 0 ? (<table className="w-full text-sm"><thead><tr className="text-left bg-slate-50 text-slate-600"><th className="p-2 font-semibold">Name</th><th className="p-2 font-semibold">Registration No.</th><th className="p-2 font-semibold">Applied On</th><th className="p-2 font-semibold">Status</th></tr></thead><tbody className="divide-y">{drive.applications.map(app=><tr key={app.studentId}><td>{app.name}</td><td>{app.registrationNumber}</td><td>{new Date(app.appliedOn).toLocaleDateString('en-GB')}</td><td>{app.status}</td></tr>)}</tbody></table>) : <p className="text-center p-8 text-slate-500">No applications have been received for this drive yet.</p>}</div><div className="p-4 bg-slate-50 border-t flex justify-end"><button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-lg font-semibold hover:bg-slate-300">Close</button></div></div>
        </div>
    );
};

// --- MAIN MANAGE DRIVES COMPONENT ---
const ManagePlacementDrives = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAppsOpen, setIsAppsOpen] = useState(false);
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchDrives = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/drives`, { credentials: 'include' });
            if (!response.ok) throw new Error("Failed to fetch drives.");
            const data = await response.json();
            setDrives(data.drives || []);
        } catch (err) { setError(err.message); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchDrives(); }, [fetchDrives]);

    const handleSaveDrive = async (driveData, driveId) => {
        setIsSaving(true);
        const url = driveId ? `${API_BASE_URL}/drives/${driveId}` : `${API_BASE_URL}/drives`;
        const method = driveId ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(driveData), credentials: 'include' });
            if (!response.ok) { const err = await response.json(); throw new Error(err.message || "Failed to save drive."); }
            setIsFormOpen(false);
            fetchDrives();
        } catch(err) { alert(err.message); }
        finally { setIsSaving(false); }
    };

    const openForm = (drive = null) => { setSelectedDrive(drive); setIsFormOpen(true); };
    
    const openApps = async (drive) => {
        // Fetch the latest application data before opening the modal
        try {
            const response = await fetch(`${API_BASE_URL}/drives/${drive._id}`, { credentials: 'include' });
            if (!response.ok) throw new Error("Failed to fetch application details.");
            const data = await response.json();
            setSelectedDrive(data.drive);
            setIsAppsOpen(true);
        } catch(err) {
            alert(err.message);
        }
    };
    
    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-600" size={48}/></div>;
    if (error) return <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">{error}</div>;

    return (
        <div className="font-sans">
            <header className="flex justify-between items-center mb-8">
                <div><h1 className="text-3xl font-bold text-slate-900">Manage Placement Drives</h1><p className="mt-1 text-slate-600">Create, view, and manage all placement opportunities.</p></div>
                <button onClick={() => openForm()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"><PlusCircle size={18}/> Create Drive</button>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="p-3 font-semibold text-left">Company</th>
                            <th className="p-3 font-semibold text-left">Job Title</th>
                            <th className="p-3 font-semibold text-left">Package</th>
                            <th className="p-3 font-semibold text-center">Applications</th>
                            <th className="p-3 font-semibold text-center">Status</th>
                            <th className="p-3 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {drives.map(drive => (
                            <tr key={drive._id} className="hover:bg-slate-50">
                                <td className="p-3 font-semibold text-slate-700">{drive.companyName}</td>
                                <td className="p-3 text-slate-600">{drive.jobTitle}</td>
                                <td className="p-3 font-mono font-semibold text-green-600">{drive.packageLPA} LPA</td>
                                <td className="p-3 text-center font-semibold text-blue-600">{drive.applications?.length || 0}</td>
                                <td className="p-3 text-center"><span className={`px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700`}>{drive.status}</span></td>
                                <td className="p-3">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => openApps(drive)} className="p-1.5 hover:bg-slate-200 rounded-md" title="View Applications"><Users size={16}/></button>
                                        <button onClick={() => openForm(drive)} className="p-1.5 hover:bg-slate-200 rounded-md" title="Edit Drive"><Edit size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <DriveFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSaveDrive} drive={selectedDrive} isSaving={isSaving} />
            <ApplicationsModal isOpen={isAppsOpen} onClose={() => setIsAppsOpen(false)} drive={selectedDrive} />
        </div>
    );
};

export default ManagePlacementDrives;