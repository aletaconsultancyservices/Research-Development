import React, { useState } from 'react';
import './App.css';
import PatientManagement from './components/PatientManagement';
import DoctorManagement from './components/DoctorManagement';
import AppointmentManagement from './components/AppointmentManagement';
import Dashboard from './components/Dashboard';
import AdminManagement from './components/AdminManagement';
import StaffManagement from './components/StaffManagement';

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
              className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >Admin</button></li>
            <li><button 
              className={`nav-btn ${activeTab === 'staff' ? 'active' : ''}`}
              onClick={() => setActiveTab('staff')}
            >Staff</button></li>
          </ul>
        </div>
      </nav>

      <div className="container">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'patients' && <PatientManagement />}
        {activeTab === 'doctors' && <DoctorManagement />}
        {activeTab === 'appointments' && <AppointmentManagement />}
        {activeTab === 'staff' && <StaffManagement />}
        {activeTab === 'admin' && <AdminManagement />}
      </div>
    </div>
  );
}

export default App;
