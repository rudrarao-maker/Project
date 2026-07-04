import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Image as ImageIcon, File, Download, Search, 
  Folder, FileArchive, Filter, Calendar
} from "lucide-react";

export default function AdminFileManager() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // For the sake of this file manager, we fetch from /api/documents which might be admin-only or we can fetch all locker items.
      // Let's assume /api/admin/documents exists, or we map over locker items.
      // Since we don't have a specific global file endpoint yet, we'll simulate a fetch
      // or fetch all user documents if such endpoint exists.
      const res = await fetch("http://localhost:5000/api/documents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Fallback dummy data for visualization if endpoint fails
      setDocuments([
        { id: 1, documentName: "Aadhaar Card - John", category: "identity", documentUrl: "#", status: "approved", createdAt: new Date().toISOString() },
        { id: 2, documentName: "PAN Card - Alice", category: "identity", documentUrl: "#", status: "pending", createdAt: new Date().toISOString() },
        { id: 3, documentName: "Income Proof", category: "income", documentUrl: "#", status: "approved", createdAt: new Date().toISOString() },
        { id: 4, documentName: "Scheme Guidelines PDF", category: "other", documentUrl: "#", status: "approved", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (category) => {
    switch (category) {
      case "identity": return <UserIcon className="text-blue-500" size={32}/>;
      case "income": return <FileText className="text-green-500" size={32}/>;
      case "other": return <FileArchive className="text-purple-500" size={32}/>;
      default: return <File className="text-gray-500" size={32}/>;
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.documentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 h-full bg-gray-50">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">File Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Browse and manage system-wide files and user uploads.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="bg-white px-4 py-3 rounded-lg border shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition flex-1">
          <Folder className="text-blue-500" size={24} />
          <div>
            <div className="font-semibold text-gray-700">Identity Docs</div>
            <div className="text-xs text-gray-500">124 files</div>
          </div>
        </div>
        <div className="bg-white px-4 py-3 rounded-lg border shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition flex-1">
          <Folder className="text-green-500" size={24} />
          <div>
            <div className="font-semibold text-gray-700">Income Proofs</div>
            <div className="text-xs text-gray-500">45 files</div>
          </div>
        </div>
        <div className="bg-white px-4 py-3 rounded-lg border shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition flex-1">
          <Folder className="text-orange-500" size={24} />
          <div>
            <div className="font-semibold text-gray-700">Scheme PDFs</div>
            <div className="text-xs text-gray-500">89 files</div>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Files</h2>

      {loading ? (
        <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-500 text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Date Uploaded</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, idx) => (
                <tr key={doc.id || idx} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileText className="text-primary" size={20} />
                    </div>
                    <span className="font-medium text-gray-800">{doc.documentName}</span>
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-sm text-gray-600">{doc.category || "Uncategorized"}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                      doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {doc.status || "Unknown"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <a 
                      href={doc.documentUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-medium text-sm transition"
                    >
                      <Download size={16} /> Download
                    </a>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No files found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
