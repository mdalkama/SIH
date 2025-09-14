import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Send, MessageSquare, AlertTriangle, Loader2, Clock, CheckCircle, Info, Star, User, Calendar, History } from 'lucide-react';

// --- Helper Components ---
const TabButton = ({ label, icon: Icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            active 
            ? 'bg-indigo-100 text-indigo-700' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
        }`}
    >
        <Icon size={16} />
        {label}
    </button>
);

const HistoryCard = ({ item }) => {
    const isComplaint = item.status; // Only complaints have a status

    const getIconInfo = () => {
        if (isComplaint) {
            switch (item.status) {
                case 'Submitted': return { icon: <AlertTriangle />, color: 'bg-blue-100 text-blue-700' };
                case 'Under Review': return { icon: <Clock />, color: 'bg-yellow-100 text-yellow-700' };
                case 'Resolved': return { icon: <CheckCircle />, color: 'bg-green-100 text-green-700' };
                default: return { icon: <MessageSquare />, color: 'bg-slate-100 text-slate-700' };
            }
        } else {
             switch (item.category) {
                case 'Suggestion': return { icon: <Info />, color: 'bg-sky-100 text-sky-700' };
                case 'Appreciation': return { icon: <Star />, color: 'bg-amber-100 text-amber-700' };
                default: return { icon: <MessageSquare />, color: 'bg-slate-100 text-slate-700' };
            }
        }
    };
    const iconInfo = getIconInfo();

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-slate-800">{item.title || item.subject}</p>
                    <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
                <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${iconInfo.color}`}>
                    {iconInfo.icon}
                    {isComplaint ? item.status : item.category}
                </span>
            </div>
            <p className="text-sm text-slate-600 mt-2 pt-2 border-t border-slate-100">{item.description || item.message}</p>
        </div>
    );
};


// --- Main Component ---
const StudentComplaintsAndFeedback = () => {
    const [activeTab, setActiveTab] = useState('complaint');
    
    // State for forms
    const [complaintData, setComplaintData] = useState({ title: '', category: '', description: '' });
    const [feedbackData, setFeedbackData] = useState({ subject: '', category: 'General Feedback', message: '', isAnonymous: false });
    
    // State for history
    const [myHistory, setMyHistory] = useState([]);

    // UI State
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [responseMsg, setResponseMsg] = useState('');

    const fetchHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const [complaintsRes, feedbackRes] = await Promise.all([
                fetch('https://sih-4ptm.onrender.com/api/v1/complaints/my-complaints', { credentials: 'include' }),
                fetch('https://sih-4ptm.onrender.com/api/v1/feedback/my-feedback', { credentials: 'include' })
            ]);
            
            const complaints = await complaintsRes.json();
            const feedback = await feedbackRes.json();

            const combinedHistory = [
                ...(complaints.complaints || []),
                ...(feedback.feedback || [])
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setMyHistory(combinedHistory);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab, fetchHistory]);

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setResponseMsg('');
        try {
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/complaints/raise', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(complaintData) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to submit complaint.');
            setResponseMsg({ type: 'success', text: 'Complaint submitted successfully!' });
            setComplaintData({ title: '', category: '', description: '' });
        } catch (err) {
            setResponseMsg({ type: 'error', text: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setResponseMsg('');
        try {
            const response = await fetch('https://sih-4ptm.onrender.com/api/v1/feedback/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(feedbackData) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to submit feedback.');
            setResponseMsg({ type: 'success', text: result.message });
            setFeedbackData({ subject: '', category: 'General Feedback', message: '', isAnonymous: false });
        } catch (err) {
            setResponseMsg({ type: 'error', text: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'complaint':
                return <ComplaintForm data={complaintData} setData={setComplaintData} onSubmit={handleComplaintSubmit} isLoading={isSubmitting} responseMsg={responseMsg} />;
            case 'feedback':
                return <FeedbackForm data={feedbackData} setData={setFeedbackData} onSubmit={handleFeedbackSubmit} isLoading={isSubmitting} responseMsg={responseMsg} />;
            case 'history':
                if (loadingHistory) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
                if (myHistory.length === 0) return <p className="text-center text-slate-500 p-12">You have no past submissions.</p>;
                return <div className="space-y-4">{myHistory.map(item => <HistoryCard key={item._id} item={item} />)}</div>;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Complaints & Feedback</h1>
                <p className="mt-1 text-slate-600">Raise issues or share your valuable feedback to help us improve.</p>
            </header>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="flex flex-wrap gap-2">
                    <TabButton label="Raise Complaint" icon={AlertTriangle} active={activeTab === 'complaint'} onClick={() => { setActiveTab('complaint'); setResponseMsg(''); }} />
                    <TabButton label="Submit Feedback" icon={MessageSquare} active={activeTab === 'feedback'} onClick={() => { setActiveTab('feedback'); setResponseMsg(''); }} />
                    <TabButton label="My History" icon={History} active={activeTab === 'history'} onClick={() => { setActiveTab('history'); setResponseMsg(''); }} />
                </div>
            </div>
            {renderContent()}
        </div>
    );
};


// --- Sub-Components for Forms ---

const ComplaintForm = ({ data, setData, onSubmit, isLoading, responseMsg }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Raise a New Complaint</h2>
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="category" value={data.category} onChange={(e) => setData(p => ({...p, category: e.target.value}))} required className="w-full p-2 border border-slate-300 rounded-md">
                    <option value="">-- Select --</option>
                    <option value="Academic">Academic</option><option value="Hostel">Hostel</option><option value="Library">Library</option><option value="Infrastructure">Infrastructure</option><option value="Other">Other</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" name="title" value={data.title} onChange={(e) => setData(p => ({...p, title: e.target.value}))} required placeholder="A brief summary of your issue" className="w-full p-2 border border-slate-300 rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" value={data.description} onChange={(e) => setData(p => ({...p, description: e.target.value}))} required rows="5" placeholder="Please describe your issue in detail..." className="w-full p-2 border border-slate-300 rounded-md"></textarea>
            </div>
            {responseMsg && <p className={`text-sm ${responseMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{responseMsg.text}</p>}
            <div className="text-right">
                <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-indigo-300">
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={16} />}
                    {isLoading ? 'Submitting...' : 'Submit Complaint'}
                </button>
            </div>
        </form>
    </div>
);

const FeedbackForm = ({ data, setData, onSubmit, isLoading, responseMsg }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Submit Feedback</h2>
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="category" value={data.category} onChange={(e) => setData(p => ({...p, category: e.target.value}))} required className="w-full p-2 border border-slate-300 rounded-md">
                    <option value="General Feedback">General Feedback</option><option value="Suggestion">Suggestion</option><option value="Appreciation">Appreciation</option><option value="Other">Other</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input type="text" name="subject" value={data.subject} onChange={(e) => setData(p => ({...p, subject: e.target.value}))} required placeholder="What is your feedback about?" className="w-full p-2 border border-slate-300 rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea name="message" value={data.message} onChange={(e) => setData(p => ({...p, message: e.target.value}))} required rows="5" placeholder="Share your thoughts, suggestions, or appreciation..." className="w-full p-2 border border-slate-300 rounded-md"></textarea>
            </div>
            <div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" name="isAnonymous" checked={data.isAnonymous} onChange={(e) => setData(p => ({...p, isAnonymous: e.target.checked}))} className="h-4 w-4 rounded" />
                    Submit Anonymously
                </label>
            </div>
            {responseMsg && <p className={`text-sm ${responseMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{responseMsg.text}</p>}
            <div className="text-right">
                <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-indigo-300">
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={16} />}
                    {isLoading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </div>
        </form>
    </div>
);


export default StudentComplaintsAndFeedback;