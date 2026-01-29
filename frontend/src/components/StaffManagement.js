import React, { useState, useEffect } from 'react';
import api from '../api';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    hire_date: '',
    salary: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('staff/');
      setStaff(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setMessage('Error loading staff data');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`staff/${editingId}/`, formData);
        setMessage('Staff member updated successfully');
      } else {
        await api.post('staff/', formData);
        setMessage('Staff member added successfully');
      }
      resetForm();
      fetchStaff();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.response?.data?.detail || 'Error saving staff data');
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`staff/${id}/`);
        setMessage('Staff member deleted successfully');
        fetchStaff();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting:', error);
        setMessage('Error deleting staff member');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      hire_date: '',
      salary: '',
      status: 'Active',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredStaff = staff.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="card"><p>Loading staff data...</p></div>;

  return (
    <div>
      <div className="card">
        <h2 className="card-title">👥 Staff Management</h2>
        <p>Manage hospital staff members, positions, and schedules</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="management-header">
        <input
          type="text"
          placeholder="Search by name, position, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add Staff Member'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="card-title">{editingId ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Position *</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select position</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Technician">Medical Technician</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Janitor">Janitor</option>
                  <option value="Manager">Department Manager</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select department</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="ICU">ICU</option>
                  <option value="Reception">Reception</option>
                  <option value="Administration">Administration</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label>Hire Date *</label>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Monthly Salary *</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter salary amount"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? '💾 Update Staff Member' : '➕ Add Staff Member'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 className="card-title">Staff Directory ({filteredStaff.length})</h3>
        <div className="table-container">
          {filteredStaff.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              No staff members found
            </p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Hire Date</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.position}</td>
                    <td>{item.department}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{new Date(item.hire_date).toLocaleDateString()}</td>
                    <td>${parseFloat(item.salary).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                    <td>
                      <span className={`badge badge-${item.status === 'Active' ? 'success' : item.status === 'On Leave' ? 'warning' : 'danger'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => handleEdit(item)}
                        title="Edit staff member"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDelete(item.id)}
                        title="Delete staff member"
                      >
                        🗑️
                      </button>
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

export default StaffManagement;
