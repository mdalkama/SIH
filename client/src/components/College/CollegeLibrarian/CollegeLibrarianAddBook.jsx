import React, { useEffect, useMemo, useState } from 'react';
import {
  Book,
  Plus,
  AlertCircle,
  CheckCircle,
  X,
  Download,
  Search,
  Trash,
  Loader2,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const BASE = "https://sih-4ptm.onrender.com/api/v1";

function CollegeLibrarianAddBook() {
  // Basic data
  const [books, setBooks] = useState([]);
  const [collegeCode, setCollegeCode] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Add book form + loading
  const [addingBook, setAddingBook] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    totalCopies: 1,
  });

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editMode, setEditMode] = useState("add");
  const [editCopyCount, setEditCopyCount] = useState(1);
  const [editSelectedCopies, setEditSelectedCopies] = useState([]);
  const [savingEdit, setSavingEdit] = useState(false);

  // Search, Sort, and Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // <-- Naya state

  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  }

  // On mount: get profile -> load books
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE}/my-profile`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data?.user?.collegeCode) {
          setCollegeCode(data.user.collegeCode);
          await loadBooks(data.user.collegeCode);
        } else {
          showNotification(data?.message || "College code not found in profile", "error");
        }
      } catch (err) {
        showNotification(err.message || "Profile error", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Load all books for a college
  async function loadBooks(codeParam) {
    const code = (codeParam || collegeCode || "").trim();
    if (!code) {
      showNotification("College code missing", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${BASE}/library/all/${encodeURIComponent(code)}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setBooks(data.books || []);
      } else {
        showNotification(data?.message || "Failed to load books", "error");
      }
    } catch (err) {
      showNotification(err.message || "Load failed", "error");
    } finally {
      setLoading(false);
    }
  }

  // Add a book
  async function handleAddBook(e) {
    e.preventDefault();
    if (!newBook.title || !newBook.totalCopies) {
      showNotification("Title and total copies are required", "error");
      return;
    }
    try {
      setAddingBook(true);
      const res = await fetch(`${BASE}/library/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newBook, totalCopies: Number(newBook.totalCopies) }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewBook({ title: "", author: "", isbn: "", category: "", totalCopies: 1 });
        await loadBooks();
        showNotification("Book added successfully!");
      } else {
        showNotification(data?.message || "Failed to add book", "error");
      }
    } catch (err) {
      showNotification(err.message || "Add failed", "error");
    } finally {
      setAddingBook(false);
    }
  }

  // Delete flow
  function openDeleteModal(book) {
    setDeleteTarget(book);
    setShowDeleteModal(true);
  }
  function closeDeleteModal() {
    if (deleting) return;
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }
  async function confirmDeleteBook() {
    if (!deleteTarget || !collegeCode) {
      showNotification("College code missing or book not selected", "error");
      return;
    }
    try {
      setDeleting(true);
      const res = await fetch(`${BASE}/library/delete/${encodeURIComponent(collegeCode)}/${deleteTarget._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setBooks(prev => prev.filter(b => b._id !== deleteTarget._id));
        showNotification("Book deleted successfully!");
        closeDeleteModal();
      } else {
        showNotification(data?.message || "Failed to delete book", "error");
      }
    } catch (err) {
      showNotification(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  }

  // Edit copies flow
  function openEditModal(book) {
    setEditTarget(book);
    setEditMode("add");
    setEditCopyCount(1);
    setEditSelectedCopies([]);
    setShowEditModal(true);
  }
  function closeEditModal() {
    if (savingEdit) return;
    setShowEditModal(false);
    setEditTarget(null);
  }
  async function saveEdit() {
    if (!editTarget) return;
    try {
      setSavingEdit(true);
      if (editMode === "add") {
        const res = await fetch(`${BASE}/library/copies/add`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId: editTarget._id, newCopies: Number(editCopyCount) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message);
        await loadBooks();
        showNotification(`${editCopyCount} copies added`);
      } else {
        const res = await fetch(`${BASE}/library/copies/delete`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId: editTarget._id, copyIds: editSelectedCopies }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message);
        await loadBooks();
        showNotification(`${editSelectedCopies.length} copies deleted`);
      }
      closeEditModal();
    } catch (err) {
      showNotification(err.message || "Save failed", "error");
    } finally {
      setSavingEdit(false);
    }
  }

  // Filter, Sort, and Paginate
  const sortedBooks = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const filtered = q ? books.filter(b =>
      (b.title || "").toLowerCase().includes(q) ||
      (b.author || "").toLowerCase().includes(q) ||
      (b.category || "").toLowerCase().includes(q) ||
      (b.isbn || "").toLowerCase().includes(q)
    ) : books;

    const arr = [...filtered];
    switch (sortBy) {
      case 'newest':
        arr.sort((a, b) => (new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
        break;
      case 'oldest':
        arr.sort((a, b) => (new Date(a.createdAt || 0) - new Date(b.createdAt || 0)));
        break;
      case 'title-asc':
        arr.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'title-desc':
        arr.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      default:
        break;
    }
    return arr;
  }, [books, searchTerm, sortBy]);

  // Reset page when search, sort, or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage]);

  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);
  const paginatedBooks = sortedBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const startItem = sortedBooks.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, sortedBooks.length);
  const totals = useMemo(() => ({
    titles: books.length,
    copies: books.reduce((sum, b) => sum + (b.totalCopies || 0), 0),
    available: books.reduce((sum, b) => sum + (Array.isArray(b.copies) ? b.copies.filter(c => !c.occupiedBy).length : 0), 0),
    occupied: books.reduce((sum, b) => sum + (Array.isArray(b.copies) ? b.copies.filter(c => c.occupiedBy).length : 0), 0),
  }), [books]);

  function renderSkeletonRows() {
    return Array.from({ length: 8 }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-8" /></td>
        <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-48" /></td>
        <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-32" /></td>
        <td className="px-4 py-3"><div className="h-6 bg-slate-200 rounded-full w-24" /></td>
        <td className="px-4 py-3 text-center"><div className="h-4 bg-slate-200 rounded w-8 mx-auto" /></td>
        <td className="px-4 py-3 text-center"><div className="h-4 bg-slate-200 rounded w-10 mx-auto" /></td>
        <td className="px-4 py-3 text-center"><div className="h-4 bg-slate-200 rounded w-8 mx-auto" /></td>
        <td className="px-4 py-3 text-center"><div className="h-4 bg-slate-200 rounded w-12 mx-auto" /></td>
        <td className="px-4 py-3 text-center"><div className="flex justify-center gap-2"><div className="h-8 w-8 bg-slate-200 rounded-md" /><div className="h-8 w-8 bg-slate-200 rounded-md" /></div></td>
      </tr>
    ));
  }

  return (
    <div className="min-h-screen">
      {notification && (
        <div className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 ${notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {notification.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 -mr-1 p-1 rounded-full hover:bg-black/10"><X size={16} /></button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Book size={20} className="text-slate-500" />
            Add New Book
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleAddBook} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Book Title *</label>
                <input type="text" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} placeholder="Enter book title" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Author</label>
                <input type="text" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} placeholder="Enter book author" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">ISBN</label>
                <input type="text" value={newBook.isbn} onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })} placeholder="Enter book ISBN" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <input type="text" value={newBook.category} onChange={(e) => setNewBook({ ...newBook, category: e.target.value })} placeholder="Enter book category" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Copies *</label>
                <input type="number" min="1" value={newBook.totalCopies} onChange={(e) => setNewBook({ ...newBook, totalCopies: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
            </div>
            <button type="submit" disabled={addingBook} className={`bg-blue-600 text-white px-5 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors ${addingBook ? "bg-blue-400 cursor-not-allowed" : "hover:bg-blue-700"}`}>
              {addingBook ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {addingBook ? "Adding..." : "Add Book to Collection"}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Library Collection</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search books..." className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md" />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2 py-2 text-sm border border-slate-300 rounded-md bg-white">
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="title-asc">Sort by: A-Z</option>
              <option value="title-desc">Sort by: Z-A</option>
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2 text-left font-medium w-12">#</th>
                <th className="px-4 py-2 text-left font-medium">Title</th>
                <th className="px-4 py-2 text-left font-medium">Author</th>
                <th className="px-4 py-2 text-left font-medium">Category</th>
                <th className="px-4 py-2 text-center font-medium w-24">Total</th>
                <th className="px-4 py-2 text-center font-medium w-24">Available</th>
                <th className="px-4 py-2 text-center font-medium w-24">Occupied</th>
                <th className="px-4 py-2 text-center font-medium w-28">Occupancy</th>
                <th className="px-4 py-2 text-center font-medium w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? renderSkeletonRows() : (
                paginatedBooks.map((book, index) => {
                  const copiesArr = Array.isArray(book.copies) ? book.copies : [];
                  const available = copiesArr.filter(c => !c.occupiedBy).length;
                  const occupied = copiesArr.filter(c => c.occupiedBy).length;
                  const occupancy = book.totalCopies ? ((occupied / book.totalCopies) * 100).toFixed(0) : 0;
                  return (
                    <tr key={book._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{book.title}</td>
                      <td className="px-4 py-3 text-slate-600">{book.author || "—"}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{book.category || "—"}</span></td>
                      <td className="px-4 py-3 text-center font-mono text-slate-700">{book.totalCopies}</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-green-600">{available}</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-red-600">{occupied}</td>
                      <td className="px-4 py-3 text-center font-mono text-slate-700">{occupancy}%</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openEditModal(book)} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-blue-600" title="Edit copies"><Pencil size={16} /></button>
                          <button onClick={() => openDeleteModal(book)} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-red-600" title="Delete book"><Trash size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {!loading && sortedBooks.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Book size={32} className="mx-auto mb-2" />
              {searchTerm ? `No books found for "${searchTerm}"` : "No books in the library yet."}
            </div>
          )}
        </div>

        {/* Pagination Controls with "Show per page" dropdown */}
        {totalPages > 0 && (
          <div className="border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Show:</span>
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-2 py-1 text-sm border border-slate-300 rounded-md bg-white">
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={30}>30 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm flex items-center gap-1.5 disabled:opacity-50 hover:bg-slate-50">
                  <ChevronLeft size={14} /> Previous
                </button>
                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm flex items-center gap-1.5 disabled:opacity-50 hover:bg-slate-50">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 rounded-b-xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-sm text-slate-600">
            <span>
              Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of <strong>{sortedBooks.length}</strong> books
              {searchTerm ? <span className="text-slate-500"> (filtered)</span> : null}
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-medium">
              <span>Titles: {totals.titles}</span>
              <span>Total Copies: {totals.copies}</span>
              <span>Available: {totals.available}</span>
              <span>Occupied: {totals.occupied}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><AlertCircle className="text-red-500" />Delete Book?</h3>
            <p className="text-sm text-slate-600 mt-2">Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={closeDeleteModal} disabled={deleting} className="px-4 py-2 rounded-md border">Cancel</button>
              <button onClick={confirmDeleteBook} disabled={deleting} className="px-4 py-2 rounded-md bg-red-600 text-white flex items-center gap-2">
                {deleting && <Loader2 size={16} className="animate-spin" />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Edit Copies — {editTarget?.title}</h3>
              <button onClick={closeEditModal} className="p-1 rounded-full hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="px-6 py-4 overflow-y-auto grow">
              <div className="flex gap-2 mb-4">
                <button onClick={() => setEditMode("add")} className={`px-3 py-1.5 rounded-md text-sm font-medium ${editMode === "add" ? "bg-slate-100 text-slate-800" : "text-slate-600 hover:bg-slate-50"}`}>Add Copies</button>
                <button onClick={() => setEditMode("delete")} className={`px-3 py-1.5 rounded-md text-sm font-medium ${editMode === "delete" ? "bg-slate-100 text-slate-800" : "text-slate-600 hover:bg-slate-50"}`}>Delete Copies</button>
              </div>
              {editMode === "add" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Number of copies to add</label>
                  <input type="number" min="1" value={editCopyCount} onChange={(e) => setEditCopyCount(e.target.value)} className="px-3 py-2 border rounded-md w-32" />
                </div>
              )}
              {editMode === "delete" && editTarget && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Select available copies to delete</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {(Array.isArray(editTarget.copies) ? editTarget.copies : []).map(copy => {
                      const disabled = Boolean(copy.occupiedBy);
                      const selected = editSelectedCopies.includes(copy.copyId);
                      return (
                        <button key={copy.copyId} type="button" disabled={disabled} onClick={() => setEditSelectedCopies(prev => prev.includes(copy.copyId) ? prev.filter(id => id !== copy.copyId) : [...prev, copy.copyId])} className={`p-3 rounded-lg border-2 text-sm font-semibold ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : selected ? "bg-red-100 text-red-800 border-red-300" : "bg-white hover:border-slate-400"}`}>
                          {copy.copyId}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button onClick={closeEditModal} disabled={savingEdit} className="px-4 py-2 rounded-md border">Cancel</button>
              <button onClick={saveEdit} disabled={savingEdit} className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${savingEdit ? "bg-slate-400" : editMode === 'add' ? 'bg-green-600' : 'bg-red-600'}`}>
                {savingEdit && <Loader2 size={16} className="animate-spin" />}
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollegeLibrarianAddBook;