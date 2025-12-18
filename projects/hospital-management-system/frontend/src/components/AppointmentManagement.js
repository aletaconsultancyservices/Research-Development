import React, { useState, useEffect } from 'react';
import api from '../api';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    reason: '',
    status: 'Scheduled',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get('appointments/'),
        api.get('patients/'),
        api.get('doctors/'),
      ]);
      setAppointments(appointmentsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
    } catch (error) {
      setMessage('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
      };

      if (editingId) {
        await api.put(`appointments/${editingId}/`, submitData);
        setMessage('Appointment updated successfully!');
      } else {
        await api.post('appointments/', submitData);
        setMessage('Appointment scheduled successfully!');
      }
      fetchData();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving appointment');
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
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`appointments/${id}/`);
        setMessage('Appointment cancelled successfully!');
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting appointment');
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
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      {message && <div className={`alert alert-${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Appointment Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Schedule Appointment'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="form-container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Patient *</label>
                <select name="patient_id" value={formData.patient_id} onChange={handleChange} required>
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.patient_id} value={patient.patient_id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Doctor *</label>
                <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} required>
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.doctor_id} value={doctor.doctor_id}>
                      Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Appointment Date & Time *</label>
                <input type="datetime-local" name="appointment_date" value={formData.appointment_date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                  <option>No-Show</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Reason for Appointment *</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-success">{editingId ? 'Update' : 'Schedule'} Appointment</button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <div className="table-container">
          {loading ? <p>Loading...</p> : (
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
                {appointments.map(appointment => (
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
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(appointment)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(appointment.appointment_id)}>Cancel</button>
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
