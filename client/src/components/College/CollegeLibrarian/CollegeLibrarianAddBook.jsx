import React, { useEffect, useState } from "react";
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
} from "lucide-react";

const BASE = "https://sih-4ptm.onrender.com/api/v1";

function CollegeLibrarianAddBook() {
  // Basic data
  const [books, setBooks] = useState([]);
  const [collegeCode, setCollegeCode] = useState("");

  // UI states
  const [loading, setLoading] = useState(false); // for table/profile/books load
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

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit copies modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // whole book object
  const [editMode, setEditMode] = useState("add"); // add | delete
  const [editCopyCount, setEditCopyCount] = useState(1);
  const [editSelectedCopies, setEditSelectedCopies] = useState([]);
  const [savingEdit, setSavingEdit] = useState(false);

  // Search + Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | title-asc | title-desc

  // Small helper toasts
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
        body: JSON.stringify({
          ...newBook,
          totalCopies: Number(newBook.totalCopies),
        }),
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
      const res = await fetch(
        `${BASE}/library/delete/${encodeURIComponent(collegeCode)}/${deleteTarget._id}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b._id !== deleteTarget._id));
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
    setEditSelectedCopies([]);
    setEditCopyCount(1);
  }
  function toggleEditCopySelection(copyId) {
    setEditSelectedCopies((prev) =>
      prev.includes(copyId) ? prev.filter((id) => id !== copyId) : [...prev, copyId]
    );
  }
  async function saveEdit() {
    if (!editTarget) return;
    try {
      setSavingEdit(true);
      if (editMode === "add") {
        if (!editCopyCount || Number(editCopyCount) < 1) {
          showNotification("Enter a valid number of copies", "error");
          setSavingEdit(false);
          return;
        }
        const res = await fetch(`${BASE}/library/copies/add`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId: editTarget._id,
            newCopies: Number(editCopyCount),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to add copies");
        await loadBooks();
        showNotification(`${editCopyCount} copies added`);
        closeEditModal();
      } else {
        if (editSelectedCopies.length === 0) {
          showNotification("Select copies to delete", "error");
          setSavingEdit(false);
          return;
        }
        const res = await fetch(`${BASE}/library/copies/delete`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId: editTarget._id,
            copyIds: editSelectedCopies,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to delete copies");
        await loadBooks();
        showNotification(`${editSelectedCopies.length} copies deleted`);
        closeEditModal();
      }
    } catch (err) {
      showNotification(err.message || "Save failed", "error");
    } finally {
      setSavingEdit(false);
    }
  }

  // Simple filter (search by title/author/category/isbn)
  const filteredBooks = books.filter((b) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    const title = (b.title || "").toLowerCase();
    const author = (b.author || "").toLowerCase();
    const category = (b.category || "").toLowerCase();
    const isbn = (b.isbn || "").toLowerCase();
    return (
      title.includes(q) || author.includes(q) || category.includes(q) || isbn.includes(q)
    );
  });

  // Get a timestamp for sorting (prefer createdAt, else infer from _id)
  function getCreatedAtMs(book) {
    if (book?.createdAt) {
      const t = new Date(book.createdAt).getTime();
      if (!isNaN(t)) return t;
    }
    // Fallback: extract timestamp from MongoDB ObjectId
    try {
      if (book?._id && typeof book._id === "string" && book._id.length >= 8) {
        const tsHex = book._id.substring(0, 8);
        const ts = parseInt(tsHex, 16);
        if (!isNaN(ts)) return ts * 1000;
      }
    } catch {}
    return 0;
  }

  // Apply sort on filtered list
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "newest") return getCreatedAtMs(b) - getCreatedAtMs(a);
    if (sortBy === "oldest") return getCreatedAtMs(a) - getCreatedAtMs(b);
    if (sortBy === "title-asc")
      return (a.title || "").localeCompare(b.title || "", undefined, {
        sensitivity: "base",
      });
    if (sortBy === "title-desc")
      return (b.title || "").localeCompare(a.title || "", undefined, {
        sensitivity: "base",
      });
    return 0;
  });

  // Simple table skeleton rows
  function renderSkeletonRows() {
    const rows = [];
    for (let i = 0; i < 8; i++) {
      rows.push(
        <tr key={i} className="border-b border-gray-200 animate-pulse">
          <td className="p-3">
            <div className="h-3 bg-slate-200 rounded w-6" />
          </td>
          <td className="p-3">
            <div className="h-3 bg-slate-200 rounded w-40" />
          </td>
          <td className="p-3">
            <div className="h-3 bg-slate-200 rounded w-32" />
          </td>
          <td className="p-3">
            <div className="h-5 bg-slate-200 rounded w-20" />
          </td>
          <td className="p-3 text-center">
            <div className="h-3 bg-slate-200 rounded w-8 mx-auto" />
          </td>
          <td className="p-3 text-center">
            <div className="h-3 bg-slate-200 rounded w-10 mx-auto" />
          </td>
          <td className="p-3 text-center">
            <div className="h-3 bg-slate-200 rounded w-8 mx-auto" />
          </td>
          <td className="p-3 text-center">
            <div className="h-3 bg-slate-200 rounded w-12 mx-auto" />
          </td>
          <td className="p-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="h-6 w-6 bg-slate-200 rounded" />
              <div className="h-6 w-6 bg-slate-200 rounded" />
            </div>
          </td>
        </tr>
      );
    }
    return rows;
  }

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Add Book */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Book size={20} />
            Add New Book
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleAddBook} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Book Title *
                </label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  placeholder="Enter ISBN (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  placeholder="Enter category"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Total Copies *
                </label>
                <input
                  type="number"
                  min="1"
                  value={newBook.totalCopies}
                  onChange={(e) => setNewBook({ ...newBook, totalCopies: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={addingBook}
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                addingBook ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {addingBook ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add Book
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Books List */}
      <div className="bg-white">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-300 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-800">Library Collection</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Book size={16} />
                <span>{sortedBooks.length} books</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 py-1.5 text-sm border border-gray-300 rounded bg-white"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="title-asc">A → Z</option>
                  <option value="title-desc">Z → A</option>
                </select>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                <Download size={14} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border-b border-gray-300 px-4 py-2">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author, category, ISBN..."
              className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Table (responsive scroll) */}
        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full min-w-[1100px] border-collapse table-fixed">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 text-left text-sm w-10">#</th>
                  <th className="p-3 text-left text-sm min-w-[200px]">Title</th>
                  <th className="p-3 text-left text-sm min-w-[150px]">Author</th>
                  <th className="p-3 text-left text-sm">Category</th>
                  <th className="p-3 text-center text-sm w-20 whitespace-nowrap">Total</th>
                  <th className="p-3 text-center text-sm w-24 whitespace-nowrap">Available</th>
                  <th className="p-3 text-center text-sm w-20 whitespace-nowrap">Occupied</th>
                  <th className="p-3 text-center text-sm w-24 whitespace-nowrap">Occupancy %</th>
                  <th className="p-2 text-center w-20">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              {loading ? (
                <tbody>{renderSkeletonRows()}</tbody>
              ) : (
                <tbody>
                  {sortedBooks.map((book, index) => {
                    const copiesArr = Array.isArray(book.copies) ? book.copies : [];
                    const available = copiesArr.filter((c) => !c.occupiedBy).length;
                    const occupied = copiesArr.filter((c) => c.occupiedBy).length;
                    const occupancy =
                      book.totalCopies > 0 ? ((occupied / book.totalCopies) * 100).toFixed(1) : "0.0";

                    return (
                      <tr
                        key={book._id}
                        className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                      >
                        <td className="p-3 text-sm text-gray-600 font-mono">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="p-3 text-sm font-medium text-gray-800">{book.title}</td>
                        <td className="p-3 text-sm text-gray-700">{book.author}</td>
                        <td className="p-3 text-sm">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {book.category || "-"}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-center font-mono whitespace-nowrap">
                          {book.totalCopies}
                        </td>
                        <td className="p-3 text-sm text-center font-mono text-green-600 font-semibold whitespace-nowrap">
                          {available}
                        </td>
                        <td className="p-3 text-sm text-center font-mono text-red-600 font-semibold whitespace-nowrap">
                          {occupied}
                        </td>
                        <td className="p-3 text-sm text-center font-mono whitespace-nowrap">
                          {occupancy}%
                        </td>
                        <td className="p-2 text-center w-20">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditModal(book)}
                              className="inline-flex p-1.5 rounded text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Edit copies"
                              aria-label={`Edit copies of ${book.title}`}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(book)}
                              className="inline-flex p-1.5 rounded text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete book"
                              aria-label={`Delete ${book.title}`}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>

            {!loading && searchTerm && sortedBooks.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-500">
                No books found for “{searchTerm}”
              </div>
            )}
          </div>
        </div>

        {/* Footer with summary (based on shown list) */}
        <div className="bg-gray-100 border-t border-gray-300 px-4 py-2">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {sortedBooks.length} of {books.length} books
            </span>
            <div className="flex gap-4">
              <span>
                Total Books:{" "}
                {sortedBooks.reduce((sum, b) => sum + (b.totalCopies || 0), 0)}
              </span>
              <span>
                Available:{" "}
                {sortedBooks.reduce(
                  (sum, b) =>
                    sum +
                    (Array.isArray(b.copies) ? b.copies.filter((c) => !c.occupiedBy).length : 0),
                  0
                )}
              </span>
              <span>
                Occupied:{" "}
                {sortedBooks.reduce(
                  (sum, b) =>
                    sum +
                    (Array.isArray(b.copies) ? b.copies.filter((c) => c.occupiedBy).length : 0),
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeDeleteModal} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-500" size={24} />
                <div className="grow">
                  <h3 className="font-semibold text-lg text-slate-800">Delete book?</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {deleteTarget ? (
                      <>
                        You are about to delete <strong>{deleteTarget.title}</strong>. This
                        action cannot be undone.
                      </>
                    ) : (
                      "Are you sure?"
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="px-4 py-2 rounded border border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteBook}
                  disabled={deleting}
                  className={`px-4 py-2 rounded bg-red-600 text-white flex items-center gap-2 ${
                    deleting ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700"
                  }`}
                >
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash size={16} />}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Copies Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeEditModal} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg text-slate-800">
                  Edit Copies{editTarget ? ` — ${editTarget.title}` : ""}
                </h3>
                <button onClick={closeEditModal} className="p-1 rounded hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-4 overflow-y-auto grow">
                {/* Mode buttons */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => {
                      setEditMode("add");
                      setEditSelectedCopies([]);
                    }}
                    className={`px-3 py-1.5 rounded border text-sm ${
                      editMode === "add"
                        ? "bg-green-100 border-green-300 text-green-800"
                        : "bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    Add Copies
                  </button>
                  <button
                    onClick={() => {
                      setEditMode("delete");
                      setEditCopyCount(1);
                    }}
                    className={`px-3 py-1.5 rounded border text-sm ${
                      editMode === "delete"
                        ? "bg-red-100 border-red-300 text-red-800"
                        : "bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    Delete Copies
                  </button>
                </div>

                {/* Add mode */}
                {editMode === "add" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Number of copies to add
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editCopyCount}
                      onChange={(e) => setEditCopyCount(e.target.value)}
                      className="px-3 py-2 border rounded w-32"
                    />
                  </div>
                )}

                {/* Delete mode */}
                {editMode === "delete" && editTarget && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Select copies to delete
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {(Array.isArray(editTarget.copies) ? editTarget.copies : []).map((copy) => {
                        const disabled = Boolean(copy.occupiedBy);
                        const selected = editSelectedCopies.includes(copy.copyId);
                        return (
                          <button
                            key={copy.copyId}
                            type="button"
                            disabled={disabled}
                            onClick={() => toggleEditCopySelection(copy.copyId)}
                            className={`p-3 rounded-lg border-2 text-sm font-semibold ${
                              disabled
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : selected
                                ? "bg-red-100 text-red-800 border-red-300"
                                : "bg-white text-slate-700 border-slate-200 hover:border-red-300 hover:bg-red-50"
                            }`}
                          >
                            {copy.copyId}
                            {copy.occupiedBy && <div className="text-xs mt-1">Occupied</div>}
                          </button>
                        );
                      })}
                    </div>
                    {editSelectedCopies.length > 0 && (
                      <p className="mt-2 text-sm text-slate-600">
                        {editSelectedCopies.length} copy(ies) selected for deletion
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
                <button
                  onClick={closeEditModal}
                  disabled={savingEdit}
                  className="px-4 py-2 rounded border border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={savingEdit}
                  className={`px-4 py-2 rounded text-white flex items-center gap-2 ${
                    savingEdit
                      ? "opacity-70 cursor-not-allowed bg-slate-400"
                      : editMode === "add"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {savingEdit && <Loader2 size={16} className="animate-spin" />}
                  {savingEdit ? "Saving..." : editMode === "add" ? "Save" : "Delete Selected"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollegeLibrarianAddBook;