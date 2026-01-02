import React, { useState, useEffect } from 'react';
import api from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    totalStaff: 0,
    activeStaff: 0,
    appointmentsByStatus: {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    },
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [patients, doctors, appointments, staff] = await Promise.all([
        api.get('patients/'),
        api.get('doctors/'),
        api.get('appointments/'),
        api.get('staff/'),
      ]);

      const appointmentsList = appointments.data;
      const staffList = staff.data;

      const appointmentsByStatus = {
        scheduled: appointmentsList.filter(a => a.status === 'Scheduled').length || 0,
        completed: appointmentsList.filter(a => a.status === 'Completed').length || 0,
        cancelled: appointmentsList.filter(a => a.status === 'Cancelled').length || 0,
      };

      setStats({
        totalPatients: patients.data.length || patients.data.count || 0,
        totalDoctors: doctors.data.length || doctors.data.count || 0,
        totalAppointments: appointmentsList.length || appointmentsList.count || 0,
        upcomingAppointments: appointmentsByStatus.scheduled,
        completedAppointments: appointmentsByStatus.completed,
        totalStaff: staffList.length || staffList.count || 0,
        activeStaff: staffList.filter(s => s.status === 'Active').length || 0,
        appointmentsByStatus,
      });

      // Get recent appointments (last 5)
      const recent = appointmentsList.slice(0, 5);
      setRecentAppointments(recent);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="card"><p>Loading dashboard...</p></div>;

  return (
    <div>
      <div className="card">
        <h2 className="card-title">📊 Healthcare Management Dashboard</h2>
        <p>Real-time overview of hospital operations and key metrics</p>
      </div>

      <h3 style={{ marginTop: '30px', marginBottom: '20px', color: '#00b4db' }}>
        Core Metrics
      </h3>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">👥 Total Patients</div>
          <div className="stat-value">{stats.totalPatients}</div>
          <div className="stat-desc">Active patient records</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">👨‍⚕️ Total Doctors</div>
          <div className="stat-value">{stats.totalDoctors}</div>
          <div className="stat-desc">Medical professionals</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">📅 Total Appointments</div>
          <div className="stat-value">{stats.totalAppointments}</div>
          <div className="stat-desc">All time bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">👥 Staff Members</div>
          <div className="stat-value">{stats.totalStaff}</div>
          <div className="stat-desc">{stats.activeStaff} active</div>
        </div>
      </div>

      <h3 style={{ marginTop: '30px', marginBottom: '20px', color: '#00b4db' }}>
        Appointment Statistics
      </h3>

      <div className="dashboard-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #28a745' }}>
          <div className="stat-label">✅ Scheduled</div>
          <div className="stat-value">{stats.appointmentsByStatus.scheduled}</div>
          <div className="stat-desc">Upcoming appointments</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #00b4db' }}>
          <div className="stat-label">✔️ Completed</div>
          <div className="stat-value">{stats.appointmentsByStatus.completed}</div>
          <div className="stat-desc">Finished consultations</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #dc3545' }}>
          <div className="stat-label">❌ Cancelled</div>
          <div className="stat-value">{stats.appointmentsByStatus.cancelled}</div>
          <div className="stat-desc">Cancelled bookings</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #ffc107' }}>
          <div className="stat-label">📊 Success Rate</div>
          <div className="stat-value">
            {stats.totalAppointments > 0
              ? Math.round((stats.appointmentsByStatus.completed / stats.totalAppointments) * 100)
              : 0}%
          </div>
          <div className="stat-desc">Completion rate</div>
        </div>
      </div>

      {recentAppointments.length > 0 && (
        <>
          <h3 style={{ marginTop: '30px', marginBottom: '20px', color: '#00b4db' }}>
            Recent Appointments
          </h3>

          <div className="card">
            <table className="data-table" style={{ marginTop: 0 }}>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((apt, index) => (
                  <tr key={index}>
                    <td>{apt.patient_name || apt.patient}</td>
                    <td>{apt.doctor_name || apt.doctor}</td>
                    <td>{new Date(apt.date).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          apt.status === 'Scheduled'
                            ? 'success'
                            : apt.status === 'Completed'
                            ? 'primary'
                            : 'danger'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4 style={{ color: '#333', marginBottom: '10px' }}>💡 Quick Stats Summary</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #ddd' }}>
            <strong>Patient to Doctor Ratio:</strong> {stats.totalDoctors > 0 ? (stats.totalPatients / stats.totalDoctors).toFixed(1) : 0}:1
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #ddd' }}>
            <strong>Average Appointments per Doctor:</strong> {stats.totalDoctors > 0 ? (stats.totalAppointments / stats.totalDoctors).toFixed(1) : 0}
          </li>
          <li style={{ padding: '8px 0' }}>
            <strong>Staff Efficiency:</strong> {stats.totalStaff > 0 ? ((stats.activeStaff / stats.totalStaff) * 100).toFixed(1) : 0}% active workforce
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
