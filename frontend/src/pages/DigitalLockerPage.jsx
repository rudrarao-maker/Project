import React, { useState, useEffect } from 'react';
import { lockerService } from '../services/dataService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ShieldCheck, Upload, Trash2, FileText, CheckCircle, Clock } from 'lucide-react';
import FilePreviewModal from '../components/common/FilePreviewModal';
import './Dashboard.css';

export default function DigitalLockerPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  
  // Form State
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('identity');
  const [docName, setDocName] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await lockerService.getAll();
      setDocuments(res.data.data);
    } catch (error) {
      toast.error('Failed to load Digital Locker');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file to upload');

    const formData = new FormData();
    formData.append('document', file);
    formData.append('category', category);
    formData.append('name', docName || file.name);

    try {
      setUploading(true);
      await lockerService.upload(formData);
      toast.success('Document saved to locker securely');
      setFile(null);
      setDocName('');
      fetchDocuments();
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document from your locker?')) return;
    try {
      await lockerService.delete(id);
      toast.success('Document deleted');
      fetchDocuments();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;
  }

  return (
    <div className="premium-dashboard">
      <motion.div className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="dashboard-title flex items-center gap-2"><ShieldCheck className="text-gov-green" /> Digital Locker</h1>
          <p className="dashboard-subtitle">Securely store your verified documents for instant use in applications</p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Upload Panel */}
        <motion.div className="md:col-span-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="dashboard-panel p-6">
            <h2 className="panel-title mb-4"><Upload size={20} className="text-gov-blue" /> Add Document</h2>
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div>
                <label className="gov-label">Document Name</label>
                <input type="text" className="premium-input w-full" placeholder="e.g. Aadhaar Card" value={docName} onChange={e => setDocName(e.target.value)} required />
              </div>
              <div>
                <label className="gov-label">Category</label>
                <select className="premium-input w-full" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="identity">Identity Proof</option>
                  <option value="address">Address Proof</option>
                  <option value="income">Income Proof</option>
                  <option value="educational">Educational Certificate</option>
                  <option value="medical">Medical Record</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="gov-label">File (PDF, JPG, PNG)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,image/*" onChange={e => setFile(e.target.files[0])} required />
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">{file ? file.name : 'Click or drag file here to upload'}</p>
                </div>
              </div>
              <button type="submit" disabled={uploading} className="btn-solid-blue flex justify-center mt-2">
                {uploading ? <div className="spinner border-white"></div> : 'Secure Upload'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Locker Grid */}
        <motion.div className="md:col-span-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="dashboard-panel h-full">
            <div className="panel-header">
              <h2 className="panel-title">My Vault</h2>
            </div>
            <div className="p-6">
              {documents.length === 0 ? (
                <div className="flex-center flex-col py-16 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                  <ShieldCheck size={48} className="mb-4 opacity-50 text-gray-400" />
                  <p className="font-medium text-lg text-gray-600">Your locker is empty</p>
                  <p className="text-sm">Upload documents to use them instantly in service applications.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {documents.map(doc => (
                    <div key={doc.id} className="border border-gray-200 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow bg-gray-50/50">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-lg flex items-center justify-center self-start">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate" title={doc.name}>{doc.name}</h3>
                        <p className="text-xs text-gray-500 capitalize mb-2">{doc.category}</p>
                        <div className="flex items-center gap-1 text-xs font-medium">
                          {doc.isVerified ? (
                            <span className="text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Verified</span>
                          ) : (
                            <span className="text-orange-500 flex items-center gap-1"><Clock size={12} /> Pending Verification</span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => setPreviewDoc({ ...doc, documentName: doc.name })} className="text-xs btn-outline-glow py-1 px-3 w-full justify-center">View</button>
                          <button onClick={() => handleDelete(doc.id)} className="text-xs bg-white text-red-500 border border-red-200 hover:bg-red-50 py-1 px-3 rounded-md w-full justify-center transition-colors">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <FilePreviewModal 
        isOpen={!!previewDoc} 
        onClose={() => setPreviewDoc(null)} 
        fileUrl={previewDoc ? `http://localhost:5000${previewDoc.filePath}` : ''}
        fileName={previewDoc?.documentName}
        fileType={previewDoc?.fileType}
      />
    </div>
  );
}
