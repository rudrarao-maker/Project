import { PlayCircle } from 'lucide-react';

export default function VideoGuidePage() {
  const videos = [
    { title: 'How to Register and Login', duration: '3:45', desc: 'Step-by-step guide on creating a new account and verifying your identity.' },
    { title: 'Applying for a Service', duration: '5:20', desc: 'Learn how to browse services, fill out application forms, and upload required documents.' },
    { title: 'Tracking Your Application', duration: '2:15', desc: 'How to use the tracking system to monitor the status of your submitted applications.' },
    { title: 'Filing a Grievance', duration: '4:10', desc: 'A guide on how to raise complaints and track their resolution status.' },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Video Guides</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Watch our tutorials to learn how to use the portal effectively</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {videos.map((v, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '180px', background: 'var(--bg-tertiary)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {/* Fake Video Thumbnail */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, #000080 0%, #3b82f6 100%)', opacity: 0.1 }}></div>
              <PlayCircle size={48} style={{ color: 'var(--accent-color, #3b82f6)', zIndex: 1 }} />
              <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                {v.duration}
              </div>
            </div>
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>{v.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', flex: 1 }}>{v.desc}</p>
              <button className="btn-outline-glow" style={{ marginTop: '16px', width: '100%' }}>Watch Video</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
