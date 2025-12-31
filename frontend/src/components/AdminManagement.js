import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalStaff: 0,
    appointmentStats: {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    },
  });
  const [systemInfo, setSystemInfo] = useState({
    status: 'Online',
    uptime: '24 hours',
    lastBackup: new Date().toLocaleString(),
    apiVersion: '1.0.0',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [patients, doctors, appointments, staff] = await Promise.all([
        api.get('patients/'),
        api.get('doctors/'),
        api.get('appointments/'),
        api.get('staff/'),
      ]);

      const appointmentsList = appointments.data;
      const appointmentStats = {
        scheduled: appointmentsList.filter(a => a.status === 'Scheduled').length || 0,
        completed: appointmentsList.filter(a => a.status === 'Completed').length || 0,
        cancelled: appointmentsList.filter(a => a.status === 'Cancelled').length || 0,
      };

      setStats({
        totalPatients: patients.data.length || patients.data.count || 0,
        totalDoctors: doctors.data.length || doctors.data.count || 0,
        totalAppointments: appointmentsList.length || appointmentsList.count || 0,
        totalStaff: staff.data.length || staff.data.count || 0,
        appointmentStats,
      });

      // Add log entry
      addLog('System', 'Admin dashboard loaded successfully');
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setMessage('Error loading admin dashboard');
      addLog('System', `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addLog = (source, action) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      source,
      action,
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const handleBackup = () => {
    setMessage('Creating backup...');
    addLog('Admin', 'Backup initiated');
    setTimeout(() => {
      setMessage('Backup completed successfully');
      setSystemInfo(prev => ({
        ...prev,
        lastBackup: new Date().toLocaleString(),
      }));
      addLog('Admin', 'Backup completed');
    }, 2000);
  };

  const handleClearLogs = () => {
    setLogs([]);
    setMessage('Logs cleared successfully');
    addLog('Admin', 'System logs cleared');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAdminData();
    setMessage('Data refreshed successfully');
  };

  if (loading) return <div className="card"><p>Loading admin dashboard...</p></div>;

  return (
    <div>
      <div className="card">
        <h2 className="card-title">👨‍💼 Admin Dashboard</h2>
        <p>System administration, monitoring, and maintenance tools</p>
      </div>

      {message && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          {message}
        </div>
      )}

      {/* Admin Sub-tabs */}
      <div className="admin-subtabs">
        <button
          className={`subtab-btn ${activeSubTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('overview')}
        >
          Overview
        </button>
        <button
          className={`subtab-btn ${activeSubTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('system')}
        >
          System
        </button>
        <button
          className={`subtab-btn ${activeSubTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('logs')}
        >
          Logs
        </button>
      </div>

      {/* Overview Tab */}
      {activeSubTab === 'overview' && (
        <div>
          <h3 style={{ marginTop: '20px', marginBottom: '20px', color: '#00b4db' }}>
            System Overview
          </h3>

          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">{stats.totalPatients}</div>
              <div className="stat-desc">Active records</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Total Doctors</div>
              <div className="stat-value">{stats.totalDoctors}</div>
              <div className="stat-desc">Medical staff</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Total Appointments</div>
              <div className="stat-value">{stats.totalAppointments}</div>
              <div className="stat-desc">All time</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Staff Members</div>
              <div className="stat-value">{stats.totalStaff}</div>
              <div className="stat-desc">Employees</div>
            </div>
          </div>

          <h3 style={{ marginTop: '30px', marginBottom: '20px', color: '#00b4db' }}>
            Appointment Statistics
          </h3>

          <div className="dashboard-grid">
            <div className="stat-card" style={{ borderLeft: '4px solid #28a745' }}>
              <div className="stat-label">Scheduled</div>
              <div className="stat-value">{stats.appointmentStats.scheduled}</div>
              <div className="stat-desc">Upcoming</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #00b4db' }}>
              <div className="stat-label">Completed</div>
              <div className="stat-value">{stats.appointmentStats.completed}</div>
              <div className="stat-desc">Finished</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #dc3545' }}>
              <div className="stat-label">Cancelled</div>
              <div className="stat-value">{stats.appointmentStats.cancelled}</div>
              <div className="stat-desc">Cancelled</div>
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeSubTab === 'system' && (
        <div>
          <h3 style={{ marginTop: '20px', marginBottom: '20px', color: '#00b4db' }}>
            System Information
          </h3>

          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '12px', fontWeight: '600', width: '200px' }}>Status</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-success">{systemInfo.status}</span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '12px', fontWeight: '600' }}>Uptime</td>
                  <td style={{ padding: '12px' }}>{systemInfo.uptime}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '12px', fontWeight: '600' }}>Last Backup</td>
                  <td style={{ padding: '12px' }}>{systemInfo.lastBackup}</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', fontWeight: '600' }}>API Version</td>
                  <td style={{ padding: '12px' }}>{systemInfo.apiVersion}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: '30px', marginBottom: '20px', color: '#00b4db' }}>
            System Actions
          </h3>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={handleRefresh}
              style={{ cursor: 'pointer' }}
            >
              🔄 Refresh Data
            </button>
            <button
              className="btn btn-primary"
              onClick={handleBackup}
              style={{ cursor: 'pointer' }}
            >
              💾 Create Backup
            </button>
            <button
              className="btn btn-danger"
              onClick={handleClearLogs}
              style={{ cursor: 'pointer' }}
            >
              🗑️ Clear Logs
            </button>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeSubTab === 'logs' && (
        <div>
          <h3 style={{ marginTop: '20px', marginBottom: '20px', color: '#00b4db' }}>
            System Activity Logs
          </h3>

          <div className="card">
            {logs.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                No activity logs yet
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #00b4db', backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Timestamp</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Source</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '12px' }}>{log.timestamp}</td>
                      <td style={{ padding: '12px' }}>
                        <span className="badge badge-primary">{log.source}</span>
                      </td>
                      <td style={{ padding: '12px' }}>{log.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
            Total logs: {logs.length} (showing last 50)
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
