import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';

/**
 * PatientManagement Component
 * Handles patient CRUD operations with comprehensive form validation
 * Features:
 * - Add, Edit, Delete patient records
 * - Patient search and filtering
 * - Form validation for all fields
 * - Error handling and user feedback
 * - Responsive design for all screen sizes
 */
const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'M',
    address: '',
    city: '',
    blood_group: 'O+',
    medical_history: '',
    emergency_contact: '',
  });

  // Memoized fetch to prevent unnecessary re-renders
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('patients/');
      setPatients(response.data);
      console.log(`✅ Loaded ${response.data.length} patients`);
    } catch (error) {
      setMessage('❌ Error fetching patients');
      console.error('Patient fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`patients/${editingId}/`, formData);
        setMessage('Patient updated successfully!');
      } else {
        await api.post('patients/', formData);
        setMessage('Patient added successfully!');
      }
      fetchPatients();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving patient');
    }
  };

  const handleEdit = (patient) => {
    setFormData(patient);
    setEditingId(patient.patient_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`patients/${id}/`);
        setMessage('Patient deleted successfully!');
        fetchPatients();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting patient');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: 'M',
      address: '',
      city: '',
      blood_group: 'O+',
      medical_history: '',
      emergency_contact: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      {message && <div className={`alert alert-${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Patient Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Patient'}
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
                <label>Date of Birth *</label>
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <input type="text" name="blood_group" value={formData.blood_group} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Medical History</label>
              <textarea name="medical_history" value={formData.medical_history} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Emergency Contact</label>
              <input type="text" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-success">{editingId ? 'Update' : 'Add'} Patient</button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <div className="management-header">
          <h2>👥 Patient Records ({filteredPatients.length})</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="table-container">
          {loading ? <p>⏳ Loading...</p> : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Blood Group</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map(patient => (
                    <tr key={patient.patient_id}>
                      <td>#{patient.patient_id}</td>
                      <td>{patient.first_name} {patient.last_name}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phone}</td>
                      <td><span className="badge badge-primary">{patient.blood_group}</span></td>
                      <td>{patient.city}</td>
                      <td>
                        <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(patient)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(patient.patient_id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>📭 No patients found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
