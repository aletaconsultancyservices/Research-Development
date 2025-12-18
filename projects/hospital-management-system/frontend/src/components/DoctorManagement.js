import React, { useState, useEffect } from 'react';
import api from '../api';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialization: 'General',
    license_number: '',
    experience_years: '',
    bio: '',
    is_available: true,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await api.get('doctors/');
      setDoctors(response.data);
    } catch (error) {
      setMessage('Error fetching doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`doctors/${editingId}/`, formData);
        setMessage('Doctor updated successfully!');
      } else {
        await api.post('doctors/', formData);
        setMessage('Doctor added successfully!');
      }
      fetchDoctors();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving doctor');
    }
  };

  const handleEdit = (doctor) => {
    setFormData(doctor);
    setEditingId(doctor.doctor_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`doctors/${id}/`);
        setMessage('Doctor deleted successfully!');
        fetchDoctors();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting doctor');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      specialization: 'General',
      license_number: '',
      experience_years: '',
      bio: '',
      is_available: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      {message && <div className={`alert alert-${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Doctor Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Doctor'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="form-container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Specialization *</label>
                <select name="specialization" value={formData.specialization} onChange={handleChange} required>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Orthopedics</option>
                  <option>Pediatrics</option>
                  <option>General</option>
                  <option>Surgery</option>
                  <option>Dermatology</option>
                  <option>Psychiatry</option>
                </select>
              </div>
              <div className="form-group">
                <label>License Number *</label>
                <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>
                  <input 
                    type="checkbox" 
                    name="is_available" 
                    checked={formData.is_available} 
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Available for Appointments
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-success">{editingId ? 'Update' : 'Add'} Doctor</button>
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
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doctor => (
                  <tr key={doctor.doctor_id}>
                    <td>#{doctor.doctor_id}</td>
                    <td>Dr. {doctor.first_name} {doctor.last_name}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.phone}</td>
                    <td>{doctor.experience_years} years</td>
                    <td>
                      <span className={`badge ${doctor.is_available ? 'badge-success' : 'badge-danger'}`}>
                        {doctor.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(doctor)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(doctor.doctor_id)}>Delete</button>
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

export default DoctorManagement;
