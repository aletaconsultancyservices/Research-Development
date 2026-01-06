import React, { useState, useEffect } from 'react';
import './App.css';
import PatientManagement from './components/PatientManagement';
import DoctorManagement from './components/DoctorManagement';
import AppointmentManagement from './components/AppointmentManagement';
import Dashboard from './components/Dashboard';
import AdminManagement from './components/AdminManagement';
import StaffManagement from './components/StaffManagement';
import ReportsAnalytics from './components/ReportsAnalytics';
import PatientMedicalRecords from './components/PatientMedicalRecords';

// Healthcare Management Platform - Main Application Component
// Version: 2.0.0
// Last Updated: January 6, 2026
// Manages 8 core modules: Dashboard, Patients, Doctors, Appointments, Staff, Medical Records, Reports & Analytics, Admin

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appVersion] = useState('2.0.0');

  // Track application initialization and monitor tab changes
  useEffect(() => {
    console.log(`Healthcare Management Platform v${appVersion} initialized`);
    console.log(`Current active module: ${activeTab}`);
  }, [activeTab, appVersion]);

  return (
    <div className="App">
      {/* Main Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-brand">💙 Healthcare Management Platform</h1>
          {/* Primary Navigation Menu - 8 Core Modules */}
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
        {/* Dashboard Module - Overview & Analytics Summary */}
        {activeTab === 'dashboard' && <Dashboard />}
        
        {/* Patient Management Module - CRUD Operations */}
        {activeTab === 'patients' && <PatientManagement />}
        
        {/* Doctor Management Module - Staff Directory */}
        {activeTab === 'doctors' && <DoctorManagement />}
        
        {/* Appointment Scheduling Module - Booking & Tracking */}
        {activeTab === 'appointments' && <AppointmentManagement />}
        
        {/* Staff Management Module - HR Operations */}
        {activeTab === 'staff' && <StaffManagement />}
        
        {/* Patient Medical Records Module - Health History & Documentation */}
        {activeTab === 'records' && <PatientMedicalRecords />}
        
        {/* Reports & Analytics Module - Business Intelligence & Metrics */}
        {activeTab === 'reports' && <ReportsAnalytics />}
        
        {/* Admin Panel Module - System Configuration */}
        {activeTab === 'admin' && <AdminManagement />}
      </div>

      {/* Footer Section */}
      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-text">
            Healthcare Management Platform v{appVersion} | © 2026 Healthcare Solutions
          </p>
          <p className="footer-subtext">
            Empowering healthcare delivery through intelligent management systems
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
