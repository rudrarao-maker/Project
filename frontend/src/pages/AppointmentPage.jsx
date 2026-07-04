import { useState, useEffect } from 'react';
import { appointmentService, serviceService } from '../services/dataService';
import { Calendar, Clock, MapPin, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const statusColors = { scheduled: '#3b82f6', confirmed: '#22c55e', completed: '#10b981', cancelled: '#ef4444', no_show: '#6b7280' };
const timeSlots = ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '12:00 PM - 01:00 PM', '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM', '04:00 PM - 05:00 PM'];
const offices = ['District Office - New Delhi', 'Sub-Division Office - Mumbai', 'Tehsil Office - Bangalore', 'Block Office - Chennai', 'Regional Center - Kolkata'];

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ serviceId: '', appointmentDate: '', timeSlot: '', officeLocation: '', purpose: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [aRes, sRes] = await Promise.all([appointmentService.getAll(), serviceService.getAll()]);
      setAppointments(aRes.data.data.appointments || []);
      setServices(sRes.data.data.services || []);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await appointmentService.book(form);
      toast.success('Appointment booked!');
      setShowForm(false);
      setForm({ serviceId: '', appointmentDate: '', timeSlot: '', officeLocation: '', purpose: '', notes: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to book'); }
    finally { setSubmitting(false); }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await appointmentService.cancel(id);
      toast.success('Appointment cancelled');
      fetchData();
    } catch { toast.error('Failed to cancel'); }
  };

  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  if (loading) return <div className="premium-dashboard flex-center"><div className="spinner"></div></div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Appointments</h1>
          <p style={{ color: 'var(--text-muted)' }}>Schedule office visits</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-solid-blue" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Book Appointment
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Book New Appointment</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Service (Optional)</label>
                <select value={form.serviceId} onChange={e => setForm({...form, serviceId: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                  <option value="">General Visit</option>
                  {services.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Date *</label>
                <input type="date" required min={minDate} value={form.appointmentDate} onChange={e => setForm({...form, appointmentDate: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Time Slot *</label>
                <select required value={form.timeSlot} onChange={e => setForm({...form, timeSlot: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                  <option value="">Select Time</option>
                  {timeSlots.map(t => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Office Location</label>
                <select value={form.officeLocation} onChange={e => setForm({...form, officeLocation: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                  <option value="">Select Office</option>
                  {offices.map(o => (<option key={o} value={o}>{o}</option>))}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px' }}>Purpose</label>
                <input type="text" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} placeholder="Reason for visit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" disabled={submitting} className="btn-solid-blue">{submitting ? 'Booking...' : 'Confirm Booking'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline-glow">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3>No appointments</h3>
          <p>Book an appointment to visit a government office</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {appointments.map(a => (
            <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{a.confirmationNumber}</div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {new Date(a.appointmentDate).toLocaleDateString()}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {a.timeSlot}</span>
                  {a.officeLocation && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {a.officeLocation}</span>}
                </div>
                {a.purpose && <div style={{ fontSize: '13px', marginTop: '4px' }}>Purpose: {a.purpose}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: 'white', background: statusColors[a.status] }}>{a.status.toUpperCase()}</span>
                {['scheduled', 'confirmed'].includes(a.status) && (
                  <button onClick={() => handleCancel(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={18} /></button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
