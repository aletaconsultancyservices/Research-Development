import React, { useState, useEffect } from 'react';
import api from '../api';

const PatientMedicalRecords = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    medications: '',
    notes: '',
    provider: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('patients/');
      setPatients(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowAddRecord(false);
    // Generate mock medical history
    setMedicalHistory(generateMedicalHistory(patient));
  };

  const generateMedicalHistory = (patient) => {
    const conditions = ['Hypertension', 'Diabetes Type 2', 'Asthma', 'GERD', 'Arthritis', 'Migraine'];
    const treatments = ['Medication', 'Physical Therapy', 'Surgery', 'Lifestyle Changes', 'Monitoring'];
    
    return [
      {
        id: 1,
        date: new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString(),
        diagnosis: conditions[Math.floor(Math.random() * conditions.length)],
        treatment: treatments[Math.floor(Math.random() * treatments.length)],
        medications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
        provider: 'Dr. Smith',
        status: 'Ongoing',
      },
      {
        id: 2,
        date: new Date(new Date().setDate(new Date().getDate() - 60)).toLocaleDateString(),
        diagnosis: conditions[Math.floor(Math.random() * conditions.length)],
        treatment: treatments[Math.floor(Math.random() * treatments.length)],
        medications: 'Ibuprofen 400mg as needed',
        provider: 'Dr. Johnson',
        status: 'Completed',
      },
      {
        id: 3,
        date: new Date(new Date().setDate(new Date().getDate() - 90)).toLocaleDateString(),
        diagnosis: conditions[Math.floor(Math.random() * conditions.length)],
        treatment: treatments[Math.floor(Math.random() * treatments.length)],
        medications: 'Albuterol inhaler as needed',
        provider: 'Dr. Williams',
        status: 'Completed',
      },
    ];
  };

  const handleAddRecord = () => {
    if (!selectedPatient) return;
    const record = {
      id: Date.now(),
      ...newRecord,
      status: 'Ongoing',
    };
    setMedicalHistory([record, ...medicalHistory]);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      treatment: '',
      medications: '',
      notes: '',
      provider: '',
    });
    setShowAddRecord(false);
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="card"><p>Loading patient records...</p></div>;

  return (
    <div>
      <div className="card">
        <h2 className="card-title">📋 Patient Medical Records</h2>
        <p>Comprehensive patient medical history and treatment documentation</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px' }}>
        {/* Patient List */}
        <div>
          <div className="card">
            <h3 className="card-title">Patients</h3>
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ marginBottom: '15px' }}
            />
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredPatients.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center' }}>No patients found</p>
              ) : (
                filteredPatients.map(patient => (
                  <div
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: selectedPatient?.id === patient.id ? '#e8f4ff' : '#f9f9f9',
                      borderLeft: selectedPatient?.id === patient.id ? '4px solid #00b4db' : '4px solid transparent',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedPatient?.id !== patient.id) {
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
                <h4 className="card-title">Medical History</h4>
                {medicalHistory.length === 0 ? (
                  <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No medical records</p>
                ) : (
                  <div>
                    {medicalHistory.map(record => (
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div>
                            <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>
                              📋 {record.diagnosis}
                            </h5>
                            <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                              {record.date} • Dr. {record.provider}
                            </p>
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
