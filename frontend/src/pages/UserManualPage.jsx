import { Book, FileText, Upload, Settings } from 'lucide-react';

export default function UserManualPage() {
  const sections = [
    { title: 'Getting Started', icon: <Book />, content: 'To begin using the portal, you must first register an account. Ensure you have your Aadhaar or PAN card ready for verification. Once registered, log in to access your personal dashboard.' },
    { title: 'Applying for Services', icon: <FileText />, content: 'Navigate to the "Services" or "Schemes" section. Select the desired service and click "Apply Now". Fill out the digital form carefully and upload all mandatory documents in PDF or JPEG format.' },
    { title: 'Document Management', icon: <Upload />, content: 'You can upload and store frequently used documents in your Digital Locker (Dashboard > My Documents). This saves time when applying for future services.' },
    { title: 'Account Settings', icon: <Settings />, content: 'Update your profile information, manage notification preferences, and change your password from the Settings page.' },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>User Manual</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Comprehensive guide on how to use the Gov E-Services Portal</p>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {sections.map((sec, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '20px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' }}>
              {sec.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>{sec.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>{sec.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '40px', padding: '24px', background: 'var(--bg-tertiary)', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Need a printable version?</p>
        <button className="btn-solid-blue">Download Full Manual (PDF)</button>
      </div>
    </div>
  );
}
