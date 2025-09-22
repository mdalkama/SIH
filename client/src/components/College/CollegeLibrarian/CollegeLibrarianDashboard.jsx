import React, { useEffect, useState, useMemo } from 'react';
import {
  Book,
  BookCopy,
  Users,
  Clock,
  ArrowUpRight,
  BookPlus,
  BookUp,
  ServerCrash,
  Library,
  BookDown,
} from 'lucide-react';

// --- Configuration ---
const BASE = "https://sih-4ptm.onrender.com/api/v1";

// --- Reusable UI Components for this Dashboard ---
const ui = {
  card: "bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm",
};

// --- FIX IS HERE: icon prop renamed to Icon (with a capital I) ---
const KpiCard = ({ icon: Icon, title, value, description, colorClass = "text-blue-600" }) => (
    <div className={`${ui.card} p-5 flex items-start gap-4`}>
        <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 ${colorClass}`}>
            {/* --- FIX IS HERE: Render it as a component <Icon /> --- */}
            <Icon size={20} />
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
    </div>
);

// --- FIX IS HERE: icon prop renamed to Icon (with a capital I) ---
const QuickAction = ({ icon: Icon, title, description, href }) => (
    <a href={href} className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors group">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 text-slate-600">
            {/* --- FIX IS HERE: Render it as a component <Icon /> --- */}
            <Icon size={20} />
        </div>
        <div className="flex-1">
            <p className="font-semibold text-slate-800">{title}</p>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <ArrowUpRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
);

const DashboardSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        <div className="h-9 w-64 bg-slate-200 rounded-md"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className={`${ui.card} p-5 flex items-start gap-4`}>
                    <div className="w-10 h-10 rounded-lg bg-slate-200"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 bg-slate-200 rounded"></div>
                        <div className="h-7 w-16 bg-slate-200 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${ui.card} lg:col-span-2 p-5`}>
                <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
                <div className="h-20 bg-slate-200 rounded"></div>
            </div>
            <div className={`${ui.card} lg:col-span-1 p-5`}>
                <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-2">{[...Array(3)].map((_, i) => (<div key={i} className="flex items-center gap-4 p-4 rounded-lg"><div className="w-10 h-10 rounded-lg bg-slate-200"></div><div className="flex-1 space-y-2"><div className="h-4 w-24 bg-slate-200 rounded"></div><div className="h-3 w-full bg-slate-200 rounded"></div></div></div>))}</div>
            </div>
        </div>
    </div>
);

// Helper function to check if a book is overdue
function computeOverdueInfo(issuedAt) {
  if (!issuedAt) return { isOverdue: false };
  const due = new Date(issuedAt);
  due.setDate(due.getDate() + 14);
  return { isOverdue: new Date() > due };
}

const CollegeLibrarianDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const profileRes = await fetch(`${BASE}/my-profile`, { credentials: "include" });
        const profileData = await profileRes.json();
        if (!profileRes.ok || !profileData.user?.collegeCode) {
            throw new Error("Could not load librarian profile or college code is missing.");
        }
        setProfile(profileData.user);
        const collegeCode = profileData.user.collegeCode;

        const booksRes = await fetch(`${BASE}/library/all/${encodeURIComponent(collegeCode)}`, { credentials: "include" });
        const booksData = await booksRes.json();
        if (!booksRes.ok) {
            console.error(booksData.message || "Failed to load library books for stats, but continuing.");
        } else {
            setBooks(Array.isArray(booksData.books) ? booksData.books : []);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (!books || books.length === 0) {
      return { totalUniqueBooks: 0, totalCopies: 0, issuedCopies: 0, overdueCopies: 0 };
    }
    const allCopies = books.flatMap(book => Array.isArray(book.copies) ? book.copies : []);
    const issuedCopiesList = allCopies.filter(copy => copy.occupiedBy);
    return {
      totalUniqueBooks: books.length,
      totalCopies: books.reduce((sum, book) => sum + (book.totalCopies || 0), 0),
      issuedCopies: issuedCopiesList.length,
      overdueCopies: issuedCopiesList.filter(copy => computeOverdueInfo(copy.issuedAt).isOverdue).length,
    };
  }, [books]);
  
  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <ServerCrash size={48} className="text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-slate-700">Failed to Load Dashboard</h3>
        <p className="text-slate-500 mt-2">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {profile?.name || 'Librarian'}! Here's your library's overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* --- FIX IS HERE: Pass the component itself, not a JSX element --- */}
        <KpiCard icon={Book} title="Total Books" value={stats.totalUniqueBooks} description="Unique titles in collection" colorClass="text-blue-600" />
        <KpiCard icon={BookCopy} title="Total Copies" value={stats.totalCopies} description="All physical copies" colorClass="text-indigo-600" />
        <KpiCard icon={Users} title="Books Issued" value={stats.issuedCopies} description="Currently with students" colorClass="text-green-600" />
        <KpiCard icon={Clock} title="Overdue Books" value={stats.overdueCopies} description="Past the due date" colorClass="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${ui.card} lg:col-span-2`}>
            <div className="p-5 border-b border-slate-100 flex items-center gap-3"><Library size={20} className="text-slate-500" /><h3 className="font-semibold text-slate-800">Library & Profile Info</h3></div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><p className="text-slate-500">Name</p><p className="font-medium text-slate-800">{profile?.name || 'N/A'}</p></div>
                <div><p className="text-slate-500">Email</p><p className="font-medium text-slate-800">{profile?.email || 'N/A'}</p></div>
                <div><p className="text-slate-500">Role</p><p className="font-medium text-slate-800 capitalize">{profile?.role || 'Librarian'}</p></div>
                <div><p className="text-slate-500">College Code</p><p className="font-medium text-slate-800">{profile?.collegeCode || 'N/A'}</p></div>
            </div>
        </div>

        <div className={`${ui.card} lg:col-span-1`}>
           <div className="p-5 border-b border-slate-100"><h3 className="font-semibold text-slate-800">Quick Actions</h3></div>
          <div className="p-3 space-y-1">
            {/* --- FIX IS HERE: Pass the component itself, not a JSX element --- */}
            <QuickAction href="/college-librarian/issue-book" icon={BookUp} title="Issue a Book" description="Find a student and issue a book copy." />
            <QuickAction href="/college-librarian/track-return" icon={BookDown} title="Track & Return" description="View a student's record or return a book." />
            <QuickAction href="/college-librarian/add-book" icon={BookPlus} title="Add New Book" description="Add a new title to your library collection." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeLibrarianDashboard;