import React, { useState, useEffect } from 'react';
import api from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [patients, doctors, appointments] = await Promise.all([
        api.get('patients/'),
        api.get('doctors/'),
        api.get('appointments/'),
      ]);

      setStats({
        totalPatients: patients.data.length || patients.data.count || 0,
        totalDoctors: doctors.data.length || doctors.data.count || 0,
        totalAppointments: appointments.data.length || appointments.data.count || 0,
        upcomingAppointments: appointments.data.filter(a => a.status === 'Scheduled').length || 0,
      });
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
        <h2 className="card-title">Welcome to Hospital Management System</h2>
        <p>Manage patients, doctors, and appointments efficiently.</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Total Patients</div>
          <div className="stat-value">{stats.totalPatients}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Doctors</div>
          <div className="stat-value">{stats.totalDoctors}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Appointments</div>
          <div className="stat-value">{stats.totalAppointments}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Upcoming Appointments</div>
          <div className="stat-value">{stats.upcomingAppointments}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
