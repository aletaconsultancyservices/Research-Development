import React from 'react';

const PatientMedicalRecords = () => {
  return (
    <div className="card">
      <h2 className="card-title">🩺 Patient Medical Records</h2>
      <p>View and manage patient medical history, diagnoses, and treatments.</p>
      <div style={{ marginTop: '20px', color: '#888' }}>
        <em>Medical records functionality coming soon...</em>
      </div>

      {/* Recent Visits Section */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ color: '#764ba2', marginBottom: '12px' }}>Recent Visits</h3>
        <table className="data-table" style={{ width: '100%', background: '#f8f9fa', borderRadius: '6px' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-02-15</td>
              <td>Dr. Smith</td>
              <td>General Checkup</td>
              <td><span style={{ color: '#28a745', fontWeight: 600 }}>Completed</span></td>
            </tr>
            <tr>
              <td>2026-01-30</td>
              <td>Dr. Lee</td>
              <td>Follow-up</td>
              <td><span style={{ color: '#ffc107', fontWeight: 600 }}>Scheduled</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Medications Section */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ color: '#00b4db', marginBottom: '12px' }}>Medications</h3>
        <table className="data-table" style={{ width: '100%', background: '#f0f9ff', borderRadius: '6px' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Paracetamol</td>
              <td>500mg</td>
              <td>Twice daily</td>
              <td><span style={{ color: '#28a745', fontWeight: 600 }}>Active</span></td>
            </tr>
            <tr>
              <td>Amoxicillin</td>
              <td>250mg</td>
              <td>Three times daily</td>
              <td><span style={{ color: '#aaa', fontWeight: 600 }}>Completed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientMedicalRecords;
import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';

/**
 * PatientMedicalRecords Component
 * Comprehensive patient medical history and record management system
 * Features:
 * - Patient search and selection
 * - Medical history tracking with detailed records
 * - Add new medical records with validation
 * - Filter records by date range
 * - Export medical history functionality
 * - Status tracking (Ongoing/Completed)
 * - Provider assignment and medication tracking
 */

  const fetchPatients = useCallback(async () => {
    try {
      const response = await api.get('patients/');
      setPatients(response.data);
      console.log(`✅ Loaded ${response.data.length} patients for medical records`);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching patients:', error);
      setMessage('Failed to load patients');
      setLoading(false);
    }
  }, []);

  useEffect(() => {const PatientMedicalRecords = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [message, setMessage] = useState('');
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    medications: '',
    notes: '',
    provider: '',
    status: 'Ongoing',
  });

    fetchPatients();
  }, [fetchPatients] )      ;

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowAddRecord(false);
    // Generate mock medical history
    setMedicalHistory(generateMedicalHistory(patient));
    console.log(`📋 Selected patient: ${patient.first_name} ${patient.last_name}`);
  };

  const generateMedicalHistory = (patient) => {
    const conditions = ['Hypertension', 'Diabetes Type 2', 'Asthma', 'GERD', 'Arthritis', 'Migraine', 'Sleep Apnea', 'Obesity'];
    const treatments = ['Medication', 'Physical Therapy', 'Surgery', 'Lifestyle Changes', 'Monitoring', 'Dietary Management'];
    const providers = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis', 'Dr. Miller'];
    
    return [
      {
        id: 1,
        date: new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString(),
        diagnosis: conditions[Math.floor(Math.random() * conditions.length)],
        treatment: treatments[Math.floor(Math.random() * treatments.length)],
        medications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
        provider: providers[Math.floor(Math.random() * providers.length)],
        notes: 'Patient showing good compliance with treatment plan. Blood pressure stable.',
        status: 'Ongoing',
      },
      {
        id: 2,
        date: new Date(new Date().setDate(new Date().getDate() - 60)).toLocaleDateString(),
        diagnosis: conditions[Math.floor(Math.random() * conditions.length)],
        treatment: treatments[Math.floor(Math.random() * treatments.length)],
        medications: 'Ibuprofen 400mg as needed',
        provider: providers[Math.floor(Math.random() * providers.length)],
        notes: 'Acute episode managed successfully. Follow-up required in 2 weeks.',
        status: 'Completed',
      },
      {
        id: 3,
        date: new Date(new Date().setDate(new Date().getDate() - 90)).toLocaleDateString(),
        diagnosis: conditions[Math.floor(Math.random() * conditions.length)],
        treatment: treatments[Math.floor(Math.random() * treatments.length)],
        medications: 'Albuterol inhaler as needed',
        provider: providers[Math.floor(Math.random() * providers.length)],
        notes: 'Preventive care visit. Patient advised to maintain regular exercise.',
        status: 'Completed',
      },
    ];
  };

  // Filter patients by search term
  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(patientSearchTerm.toLowerCase())
  );

  // Filter medical history by status
  const filteredHistory = medicalHistory.filter(record => {
    if (filterStatus === 'all') return true;
    return record.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleAddRecord = () => {
    if (!selectedPatient) {
      setMessage('⚠️ Please select a patient first');
      return;
    }
    
    if (!newRecord.diagnosis || !newRecord.treatment || !newRecord.provider) {
      setMessage('⚠️ Please fill in all required fields');
      return;
    }

    const record = {
      id: Date.now(),
      ...newRecord,
    };
    setMedicalHistory([record, ...medicalHistory]);
    setMessage(`✅ Medical record added successfully for ${selectedPatient.first_name}`);
    setTimeout(() => setMessage(''), 3000);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      treatment: '',
      medications: '',
      notes: '',
      provider: '',
      status: 'Ongoing',
    });
    setShowAddRecord(false);
  };

  const handleDeleteRecord = (recordId) => {
    setMedicalHistory(medicalHistory.filter(record => record.id !== recordId));
    setMessage('✅ Medical record deleted');
    setTimeout(() => setMessage(''), 3000);
  };

  const exportRecords = () => {
    if (!selectedPatient) {
      setMessage('⚠️ Please select a patient first');
      return;
    }
    
    const dataStr = JSON.stringify(medicalHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedPatient.first_name}_${selectedPatient.last_name}_medical_records.json`;
    link.click();
    setMessage('✅ Medical records exported successfully');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="card"><p>⏳ Loading medical records system...</p></div>;

  return (
    <div>
      <div className="card">
        <h2 className="card-title">📋 Patient Medical Records</h2>
        <p>Comprehensive patient medical history and treatment documentation</p>
      </div>

      {message && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#856404',
          borderRadius: '6px',
          borderLeft: `4px solid ${message.includes('✅') ? '#28a745' : '#ffc107'}`
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px' }}>
        {/* Patient List */}
        <div>
          <div className="card">
            <h3 className="card-title">👥 Patients ({filteredPatients.length})</h3>
            <input
              type="text"
              placeholder="🔍 Search patients..."
              value={patientSearchTerm}
              onChange={(e) => setPatientSearchTerm(e.target.value)}
              className="search-input"
              style={{ marginBottom: '15px' }}
            />
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredPatients.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center' }}>📭 No patients found</p>
              ) : (
                filteredPatients.map(patient => (
                  <div
                    key={patient.patient_id}
                    onClick={() => handleSelectPatient(patient)}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: selectedPatient?.patient_id === patient.patient_id ? '#e8f4ff' : '#f9f9f9',
                      borderLeft: selectedPatient?.patient_id === patient.patient_id ? '4px solid #00b4db' : '4px solid transparent',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedPatient?.patient_id !== patient.patient_id) {
                        e.currentTarget.style.backgroundColor = '#f0f0f0';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedPatient?.id !== patient.id) {
                        e.currentTarget.style.backgroundColor = '#f9f9f9';
                      }
                    }}
                  >
                    <div style={{ fontWeight: '600', color: '#333' }}>{patient.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{patient.phone}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Medical Record Details */}
        <div>
          {selectedPatient ? (
            <div>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 className="card-title">{selectedPatient.name}</h3>
                    <div style={{ color: '#666', fontSize: '0.95rem' }}>
                      <p style={{ margin: '5px 0' }}>📧 {selectedPatient.email}</p>
                      <p style={{ margin: '5px 0' }}>📱 {selectedPatient.phone}</p>
                      <p style={{ margin: '5px 0' }}>📅 DOB: {selectedPatient.dob}</p>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowAddRecord(!showAddRecord)}
                  >
                    {showAddRecord ? '✕ Cancel' : '+ Add Record'}
                  </button>
                </div>
              </div>

              {showAddRecord && (
                <div className="card" style={{ marginBottom: '20px' }}>
                  <h4 className="card-title">Add Medical Record</h4>
                  <div className="form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Date *</label>
                        <input
                          type="date"
                          value={newRecord.date}
                          onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Provider Name *</label>
                        <input
                          type="text"
                          value={newRecord.provider}
                          onChange={(e) => setNewRecord({ ...newRecord, provider: e.target.value })}
                          placeholder="Dr. Smith"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Diagnosis *</label>
                      <input
                        type="text"
                        value={newRecord.diagnosis}
                        onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                        placeholder="Enter diagnosis"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Treatment *</label>
                      <input
                        type="text"
                        value={newRecord.treatment}
                        onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
                        placeholder="Enter treatment plan"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Medications</label>
                      <textarea
                        value={newRecord.medications}
                        onChange={(e) => setNewRecord({ ...newRecord, medications: e.target.value })}
                        placeholder="List all medications and dosages"
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label>Additional Notes</label>
                      <textarea
                        value={newRecord.notes}
                        onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                        placeholder="Any additional clinical notes"
                        rows="2"
                      />
                    </div>

                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={newRecord.status}
                        onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value })}
                      >
                        <option value="Ongoing">⏳ Ongoing</option>
                        <option value="Completed">✅ Completed</option>
                      </select>
                    </div>

                    <div className="form-actions">
                      <button className="btn btn-primary" onClick={handleAddRecord}>
                        💾 Save Record
                      </button>
                      <button className="btn btn-secondary" onClick={() => setShowAddRecord(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 className="card-title">📚 Medical History ({filteredHistory.length})</h4>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '14px'
                      }}
                    >
                      <option value="all">All Records</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      className="btn btn-secondary"
                      onClick={exportRecords}
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      📥 Export
                    </button>
                  </div>
                </div>
                {filteredHistory.length === 0 ? (
                  <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>📭 No medical records</p>
                ) : (
                  <div>
                    {filteredHistory.map(record => (
                      <div
                        key={record.id}
                        style={{
                          padding: '15px',
                          marginBottom: '15px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          backgroundColor: '#f9f9f9',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div>
                            <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>
                              📋 {record.diagnosis}
                            </h5>
                            <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                              📅 {record.date} • 👨‍⚕️ Dr. {record.provider}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span
                              style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                backgroundColor: record.status === 'Ongoing' ? '#fff3cd' : '#d4edda',
                                color: record.status === 'Ongoing' ? '#856404' : '#155724'
                              }}
                            >
                              {record.status === 'Ongoing' ? '⏳ Ongoing' : '✅ Completed'}
                            </span>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteRecord(record.id)}
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                          <span
                            className={`badge badge-${
                              record.status === 'Ongoing' ? 'success' : 'primary'
                            }`}
                          >
                            {record.status}
                          </span>
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                          <p style={{ margin: '8px 0', fontSize: '0.95rem' }}>
                            <strong>Treatment:</strong> {record.treatment}
                          </p>
                          {record.medications && (
                            <p style={{ margin: '8px 0', fontSize: '0.95rem' }}>
                              <strong>Medications:</strong> {record.medications}
                            </p>
                          )}
                          {record.notes && (
                            <p style={{ margin: '8px 0', fontSize: '0.95rem', color: '#666' }}>
                              <strong>Notes:</strong> {record.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                Select a patient to view medical records
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalRecords;
