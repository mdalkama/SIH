import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertTriangle, MessageSquare, User, Calendar, Tag, Star, Info } from 'lucide-react';

// --- Helper Component ---
const FeedbackCard = ({ feedback }) => {
    const getCategoryInfo = (category) => {
        switch(category) {
            case 'Suggestion': return { icon: <Info className="w-4 h-4 text-blue-500" />, color: 'bg-blue-100 text-blue-800' };
            case 'Appreciation': return { icon: <Star className="w-4 h-4 text-yellow-500" />, color: 'bg-yellow-100 text-yellow-800' };
            default: return { icon: <MessageSquare className="w-4 h-4 text-slate-500" />, color: 'bg-slate-100 text-slate-800' };
        }
    };
    
    const categoryInfo = getCategoryInfo(feedback.category);

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryInfo.color}`}>
                        {categoryInfo.icon}
                        {feedback.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 mt-3">{feedback.subject}</h3>
                    <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{feedback.message}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-2">
                <span className="flex items-center font-medium">
                    <User className="w-3 h-3 mr-1.5" />
                    {feedback.isAnonymous ? 
                        <span className="italic">Anonymous</span> : 
                        feedback.submittedBy?.name || 'Unknown User'
                    }
                </span>
                <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    Submitted on {new Date(feedback.createdAt).toLocaleDateString('en-GB')}
                </span>
            </div>
        </div>
    );
};

// --- Main Component ---
const CollegeAdminManageFeedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://sih-4ptm.onrender.com/api/v1/feedback/college', {
                    credentials: 'include'
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Failed to fetch feedback.');
                setFeedback(result.feedback || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    const filteredFeedback = useMemo(() => {
        if (filter === 'All') return feedback;
        return feedback.filter(item => item.category === filter);
    }, [feedback, filter]);

    const categories = ['All', 'Suggestion', 'Appreciation', 'General Feedback', 'Other'];

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Feedback Inbox</h1>
                <p className="mt-1 text-slate-600">Review all feedback submitted by students and staff.</p>
            </header>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                filter === category 
                                ? 'bg-indigo-100 text-indigo-700' 
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>
            ) : error ? (
                <div className="text-center p-10 bg-red-50 rounded-lg border border-red-200"><AlertTriangle className="mx-auto w-12 h-12 text-red-500" /><p className="mt-4 text-red-600">{error}</p></div>
            ) : filteredFeedback.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredFeedback.map(item => (
                        <FeedbackCard key={item._id} feedback={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-4 text-lg font-medium text-slate-800">No Feedback Found</h3>
                    <p className="mt-1 text-sm text-slate-500">There is no feedback in the "{filter}" category.</p>
                </div>
            )}
        </div>
    );
};

export default CollegeAdminManageFeedback;