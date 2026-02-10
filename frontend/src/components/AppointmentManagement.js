import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';

/**
 * AppointmentManagement Component
 * Handles scheduling, editing, and managing patient appointments
 * Features:
 * - Schedule new appointments
 * - Edit existing appointments
 * - Cancel appointments
 * - Search and filter appointments
 * - Real-time validation
 * - Status tracking
 */
const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    reason: '',
    status: 'Scheduled',
    notes: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrors({});
    try {
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get('appointments/'),
        api.get('patients/'),
        api.get('doctors/'),
      ]);
      setAppointments(appointmentsRes.data || []);
      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);
      console.log('✅ Appointment data loaded successfully');
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setMessage('❌ Failed to load appointment data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patient_id) newErrors.patient_id = '📍 Patient is required';
    if (!formData.doctor_id) newErrors.doctor_id = '📍 Doctor is required';
    if (!formData.appointment_date) newErrors.appointment_date = '📍 Date & Time is required';
    if (!formData.reason || formData.reason.trim().length < 5) newErrors.reason = '📍 Reason must be at least 5 characters';
    
    const appointmentDateTime = new Date(formData.appointment_date);
    if (appointmentDateTime < new Date()) {
      newErrors.appointment_date = '📍 Appointment date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage('❌ Please fix the errors in the form');
      return;
    }
    
    try {
      const submitData = {
        ...formData,
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
      };

      if (editingId) {
        await api.put(`appointments/${editingId}/`, submitData);
        setMessage('✅ Appointment updated successfully!');
        console.log('✅ Appointment updated:', editingId);
      } else {
        await api.post('appointments/', submitData);
        setMessage('✅ Appointment scheduled successfully!');
        console.log('✅ Appointment scheduled');
      }
      fetchData();
      resetForm();
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      console.error('❌ Error saving appointment:', error);
      setMessage('❌ Failed to save appointment. Please try again.');
    }
  };

  const handleEdit = (appointment) => {
    setFormData({
      patient_id: appointment.patient.patient_id,
      doctor_id: appointment.doctor.doctor_id,
      appointment_date: appointment.appointment_date,
      reason: appointment.reason,
      status: appointment.status,
      notes: appointment.notes,
    });
    setEditingId(appointment.appointment_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('🔔 Are you sure you want to cancel this appointment?')) {
      try {
        await api.delete(`appointments/${id}/`);
        setMessage('✅ Appointment cancelled successfully!');
        console.log('✅ Appointment cancelled:', id);
        fetchData();
        setTimeout(() => setMessage(''), 4000);
      } catch (error) {
        console.error('❌ Error cancelling appointment:', error);
        setMessage('❌ Failed to cancel appointment');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      doctor_id: '',
      appointment_date: '',
      reason: '',
      status: 'Scheduled',
      notes: '',
    });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter(appt => {
    const patientName = `${appt.patient.first_name} ${appt.patient.last_name}`.toLowerCase();
    const doctorName = `${appt.doctor.first_name} ${appt.doctor.last_name}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = patientName.includes(searchLower) || 
                          doctorName.includes(searchLower) || 
                          appt.reason.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {message && (
        <div className={`alert alert-${message.includes('❌') ? 'error' : 'success'}`} style={{ marginBottom: '20px' }}>
          {message}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 className="card-title">📅 Appointment Management</h2>
            <p style={{ color: '#666', marginTop: '5px', fontSize: '14px' }}>
              {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '📝 + Schedule Appointment'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="form-container" style={{ borderTop: '2px solid #e0e0e0', paddingTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>👥 Patient *</label>
                <select 
                  name="patient_id" 
                  value={formData.patient_id} 
                  onChange={handleChange}
                  style={{ borderColor: errors.patient_id ? '#dc3545' : '#ddd' }}
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.patient_id} value={patient.patient_id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
                {errors.patient_id && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.patient_id}</span>}
              </div>
              <div className="form-group">
                <label>👨‍⚕️ Doctor *</label>
                <select 
                  name="doctor_id" 
                  value={formData.doctor_id} 
                  onChange={handleChange}
                  style={{ borderColor: errors.doctor_id ? '#dc3545' : '#ddd' }}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.doctor_id} value={doctor.doctor_id}>
                      Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
                {errors.doctor_id && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.doctor_id}</span>}
              </div>
              <div className="form-group">
                <label>📆 Appointment Date & Time *</label>
                <input 
                  type="datetime-local" 
                  name="appointment_date" 
                  value={formData.appointment_date} 
                  onChange={handleChange}
                  style={{ borderColor: errors.appointment_date ? '#dc3545' : '#ddd' }}
                />
                {errors.appointment_date && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.appointment_date}</span>}
              </div>
              <div className="form-group">
                <label>🏷️ Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Scheduled">📋 Scheduled</option>
                  <option value="Completed">✅ Completed</option>
                  <option value="Cancelled">❌ Cancelled</option>
                  <option value="No-Show">⏭️ No-Show</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>🔍 Reason for Appointment *</label>
              <textarea 
                name="reason" 
                value={formData.reason} 
                onChange={handleChange}
                placeholder="Describe the reason for appointment (min. 5 characters)"
                style={{ borderColor: errors.reason ? '#dc3545' : '#ddd' }}
              />
              {errors.reason && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.reason}</span>}
              <span style={{ fontSize: '12px', color: '#666', marginTop: '4px', display: 'block' }}>
                {formData.reason.length} characters
              </span>
            </div>
            <div className="form-group">
              <label>📝 Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional notes (optional)" />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-success">
                {editingId ? '♻️ Update' : '📅 Schedule'} Appointment
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>✕ Cancel</button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        {/* Search and Filter Section */}
        <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>🔍 Search Appointments</label>
            <input
              type="text"
              placeholder="Search by patient name, doctor name, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>🏷️ Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="All">All</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-Show">No-Show</option>
            </select>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p>⏳ Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              <p>📭 No appointments found</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(appointment => (
                  <tr key={appointment.appointment_id}>
                    <td>#{appointment.appointment_id}</td>
                    <td>{appointment.patient.first_name} {appointment.patient.last_name}</td>
                    <td>Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}</td>
                    <td>{new Date(appointment.appointment_date).toLocaleString()}</td>
                    <td>{appointment.reason}</td>
                    <td>
                      <span className={`badge badge-${
                        appointment.status === 'Completed' ? 'success' :
                        appointment.status === 'Cancelled' ? 'danger' :
                        appointment.status === 'Scheduled' ? 'primary' : 'warning'
                      }`}>
                        {appointment.status === 'Completed' && '✅ '}
                        {appointment.status === 'Cancelled' && '❌ '}
                        {appointment.status === 'Scheduled' && '📋 '}
                        {appointment.status === 'No-Show' && '⏭️ '}
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(appointment)}>✏️ Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(appointment.appointment_id)}>🗑️ Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
