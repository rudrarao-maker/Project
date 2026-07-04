import { X, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilePreviewModal({ isOpen, onClose, fileUrl, fileName, fileType }) {
  if (!isOpen) return null;

  const isImage = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(fileType) || /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  const isPdf = fileType === 'application/pdf' || /\.pdf$/i.test(fileName);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          style={{
            background: 'var(--bg-primary)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <FileText size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {fileName}
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={fileUrl} download={fileName} target="_blank" rel="noreferrer" style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download size={18} />
              </a>
              <button onClick={onClose} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '24px', background: 'var(--bg-tertiary, #f3f4f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', minHeight: '400px' }}>
            {isImage ? (
              <img src={fileUrl} alt={fileName} style={{ maxWidth: '100%', maxHeight: 'calc(90vh - 120px)', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            ) : isPdf ? (
              <iframe src={fileUrl} title={fileName} style={{ width: '100%', height: 'calc(90vh - 120px)', border: 'none', borderRadius: '8px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <FileText size={64} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <p>Preview not available for this file type.</p>
                <a href={fileUrl} download={fileName} className="btn-solid-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', textDecoration: 'none' }}>
                  <Download size={16} /> Download File
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
