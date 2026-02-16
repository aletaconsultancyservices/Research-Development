import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [errors, setErrors] = useState({});
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

  const fetchStaff = useCallback(async () => {
    try {
      const response = await api.get('staff/');
      setStaff(response.data || []);
      setLoading(false);
      console.log('✅ Staff data loaded successfully');
    } catch (error) {
      console.error('❌ Error fetching staff:', error);
      setMessage('Error loading staff data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 3) newErrors.name = 'Full name must be at least 3 characters';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone || formData.phone.trim().length < 7) newErrors.phone = 'Valid phone is required';
    if (!formData.hire_date) newErrors.hire_date = 'Hire date is required';
    if (!formData.salary || Number(formData.salary) <= 0) newErrors.salary = 'Salary must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage('❌ Please fix the errors in the form');
      return;
    }
    try {
      if (editingId) {
        await api.put(`staff/${editingId}/`, formData);
        setMessage('✅ Staff member updated successfully');
      } else {
        await api.post('staff/', formData);
        setMessage('✅ Staff member added successfully');
      }
      resetForm();
      fetchStaff();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.response?.data?.detail || '❌ Error saving staff data');
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

  const filteredStaff = staff.filter(item => {
    const matchesText = (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesText && matchesStatus;
  });

  // Summary counts
  const totalStaff = staff.length;
  const activeCount = staff.filter(s => s.status === 'Active').length;
  const onLeaveCount = staff.filter(s => s.status === 'On Leave').length;
  const inactiveCount = staff.filter(s => s.status === 'Inactive' || s.status === 'Terminated').length;

  // Export filtered staff as CSV
  const generateStaffCSV = () => {
    const headers = ['Name','Position','Department','Email','Phone','Hire Date','Salary','Status'];
    const rows = filteredStaff.map(item => [
      item.name,
      item.position,
      item.department,
      item.email,
      item.phone,
      new Date(item.hire_date).toLocaleDateString(),
      item.salary,
      item.status,
    ]);
    const csvCore = [headers, ...rows]
      .map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const header = `Staff Directory (filtered)\nGenerated: ${new Date().toLocaleString()}\n\n`;
    return header + csvCore;
  };

  const downloadFile = (content, filename, type) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportCSV = () => {
    const csv = generateStaffCSV();
    const ts = new Date().toISOString().split('T')[0];
    downloadFile(csv, `staff_directory_${ts}.csv`, 'text/csv');
  };

  if (loading) return <div className="card"><p>Loading staff data...</p></div>;

  return (
    <div>
      <div className="card">
        <h2 className="card-title">👥 Staff Management</h2>
        <p>Manage hospital staff members, positions, and schedules</p>
      </div>

      {/* Summary Banner */}
      <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>👥 Total Staff</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{totalStaff}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>✅ Active</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{activeCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>📅 On Leave</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{onLeaveCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>⛔ Inactive/Terminated</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{inactiveCount}</div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="management-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', width: '100%' }}>
          <input
            type="text"
            placeholder="Search by name, position, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="search-input"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Add Staff Member'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleExportCSV}
            title="Export filtered staff to CSV"
          >
            ⬇️ Export CSV
          </button>
        </div>
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
                {errors.name && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.name}</span>}
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
                {errors.position && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.position}</span>}
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
                {errors.department && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.department}</span>}
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
                {errors.email && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.email}</span>}
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
                {errors.phone && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.phone}</span>}
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
                {errors.hire_date && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.hire_date}</span>}
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
                {errors.salary && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.salary}</span>}
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
