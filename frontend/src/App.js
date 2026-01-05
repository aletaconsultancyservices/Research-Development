import React, { useState } from 'react';
import './App.css';
import PatientManagement from './components/PatientManagement';
import DoctorManagement from './components/DoctorManagement';
import AppointmentManagement from './components/AppointmentManagement';
import Dashboard from './components/Dashboard';
import AdminManagement from './components/AdminManagement';
import StaffManagement from './components/StaffManagement';
import ReportsAnalytics from './components/ReportsAnalytics';
import PatientMedicalRecords from './components/PatientMedicalRecords';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-brand">💙 Healthcare Management Platform</h1>
          <ul className="nav-menu">
            <li><button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >Dashboard</button></li>
            <li><button 
              className={`nav-btn ${activeTab === 'patients' ? 'active' : ''}`}
              onClick={() => setActiveTab('patients')}
            >Patients</button></li>
            <li><button 
              className={`nav-btn ${activeTab === 'doctors' ? 'active' : ''}`}
              onClick={() => setActiveTab('doctors')}
            >Doctors</button></li>
            <li><button 
              className={`nav-btn ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >Appointments</button></li>
            <li><button 
              className={`nav-btn ${activeTab === 'staff' ? 'active' : ''}`}
              onClick={() => setActiveTab('staff')}
            >Staff</button></li>
            <li><button 
              className={`nav-btn ${activeTab === 'records' ? 'active' : ''}`}
              onClick={() => setActiveTab('records')}
            >Medical Records</button></li>
            <li><button 
              className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >Reports</button></li>
            <li><button 
              className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >Admin</button></li>
          </ul>
        </div>
      </nav>

      <div className="container">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'patients' && <PatientManagement />}
        {activeTab === 'doctors' && <DoctorManagement />}
        {activeTab === 'appointments' && <AppointmentManagement />}
        {activeTab === 'staff' && <StaffManagement />}
        {activeTab === 'records' && <PatientMedicalRecords />}
        {activeTab === 'reports' && <ReportsAnalytics />}
        {activeTab === 'admin' && <AdminManagement />}
      </div>
    </div>
  );
}

export default App;
