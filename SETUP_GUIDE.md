# Hospital Management System - Setup & Installation Guide

## ✅ Project Successfully Created!

Your complete hospital management system has been set up with all necessary files and folders.

### Project Location
```
c:\Users\ACW\newproject\hospital-management-system
```

### Project Structure Overview

```
hospital-management-system/
├── backend/                          # Django REST API
│   ├── config/                       # Project configuration
│   │   ├── settings.py              # Django settings (INSTALLED_APPS, CORS, DB)
│   │   ├── urls.py                  # API routing with DefaultRouter
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── patients/                     # Patient management app
│   │   ├── models.py                # Patient ORM model
│   │   ├── serializers.py           # PatientSerializer
│   │   ├── views.py                 # PatientViewSet with search action
│   │   └── admin.py
│   ├── doctors/                      # Doctor management app
│   │   ├── models.py                # Doctor ORM model
│   │   ├── serializers.py           # DoctorSerializer
│   │   ├── views.py                 # DoctorViewSet
│   │   └── admin.py
│   ├── appointments/                 # Appointment scheduling app
│   │   ├── models.py                # Appointment with FK to Patient & Doctor
│   │   ├── serializers.py           # Nested serialization
│   │   ├── views.py                 # AppointmentViewSet with upcoming action
│   │   └── admin.py
│   ├── staff/                        # Staff management app
│   │   ├── models.py                # Staff ORM model
│   │   ├── serializers.py           # StaffSerializer
│   │   ├── views.py                 # StaffViewSet
│   │   └── admin.py
│   ├── manage.py                    # Django CLI
│   ├── requirements.txt             # Python dependencies
│   └── db.sqlite3                   # SQLite database (created after migrate)
│
├── frontend/                         # React SPA
│   ├── public/
│   │   └── index.html               # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js         # Stats cards component
│   │   │   ├── PatientManagement.js # Patient CRUD component
│   │   │   ├── DoctorManagement.js  # Doctor CRUD component
│   │   │   └── AppointmentManagement.js  # Appointment CRUD component
│   │   ├── App.js                   # Main app with tab routing
│   │   ├── App.css                  # Professional styling (purple theme)
│   │   ├── index.js                 # React entry point
│   │   └── index.css
│   ├── package.json                 # npm dependencies
│   └── node_modules/                # npm packages (created after npm install)
│
├── .github/
│   └── copilot-instructions.md      # AI coding agent guide
│
└── README.md                        # Project documentation
```

## 🚀 Getting Started

### Step 1: Backend Setup

Open **Terminal 1** and run:

```bash
cd c:\Users\ACW\newproject\hospital-management-system\backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser
# Follow prompts to set username, email, password

# Start Django development server
python manage.py runserver
```

**Expected Output:**
```
Starting development server at http://127.0.0.1:8000/
```

✅ Backend is now running on `http://localhost:8000`
- API endpoints: `http://localhost:8000/api/`
- Admin panel: `http://localhost:8000/admin` (use your superuser credentials)

### Step 2: Frontend Setup

Open **Terminal 2** and run:

```bash
cd c:\Users\ACW\newproject\hospital-management-system\frontend

# Install npm packages
npm install

# Start React development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view hospital-management-frontend in the browser.

  Local:            http://localhost:3000
```

✅ Frontend is now running on `http://localhost:3000`

### Step 3: Test the Application

1. Open browser to `http://localhost:3000`
2. Navigate through tabs (Dashboard, Patients, Doctors, Appointments)
3. Try adding a patient:
   - Fill in patient details
   - Click "Add Patient"
   - Confirm in the table below

## 📋 API Endpoints Reference

### Patients
```
GET    /api/patients/              # List all patients
POST   /api/patients/              # Create new patient
GET    /api/patients/{id}/         # Get patient details
PUT    /api/patients/{id}/         # Update patient
DELETE /api/patients/{id}/         # Delete patient
GET    /api/patients/search/?q=... # Search patients
```

### Doctors
```
GET    /api/doctors/               # List all doctors
POST   /api/doctors/               # Create new doctor
GET    /api/doctors/{id}/          # Get doctor details
PUT    /api/doctors/{id}/          # Update doctor
DELETE /api/doctors/{id}/          # Delete doctor
```

### Appointments
```
GET    /api/appointments/          # List all appointments
POST   /api/appointments/          # Schedule appointment
GET    /api/appointments/{id}/     # Get appointment details
PUT    /api/appointments/{id}/     # Update appointment
DELETE /api/appointments/{id}/     # Cancel appointment
GET    /api/appointments/upcoming/ # Get upcoming appointments
```

### Staff
```
GET    /api/staff/                 # List all staff
POST   /api/staff/                 # Add staff member
GET    /api/staff/{id}/            # Get staff details
PUT    /api/staff/{id}/            # Update staff
DELETE /api/staff/{id}/            # Delete staff
```

## 🔧 Common Commands

### Django Commands
```bash
# Create new app
python manage.py startapp appname

# Create migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Open Django shell
python manage.py shell

# Access admin panel
# Visit: http://localhost:8000/admin
```

### React Commands
```bash
# Build for production
npm run build

# Run tests
npm test

# Clear cache and reinstall
rm -rf node_modules
npm install
```

## 🎨 UI Features

- **Professional Design**: Purple gradient theme (#667eea → #764ba2)
- **Responsive Layout**: Mobile-friendly with CSS Grid/Flexbox
- **Status Badges**: Color-coded status indicators
- **Real-time Dashboard**: Live statistics from all entities
- **Form Validation**: Input validation on both frontend and backend
- **Error Handling**: User-friendly error messages

## 📊 Database Schema

```
Patients
  ├─ patient_id (PK)
  ├─ first_name, last_name
  ├─ email, phone
  ├─ date_of_birth, gender, blood_group
  ├─ address, city
  ├─ medical_history
  ├─ emergency_contact
  └─ created_at, updated_at

Doctors
  ├─ doctor_id (PK)
  ├─ first_name, last_name
  ├─ email, phone
  ├─ specialization
  ├─ license_number
  ├─ experience_years
  ├─ bio
  ├─ is_available
  └─ created_at

Appointments
  ├─ appointment_id (PK)
  ├─ patient_id (FK → Patients)
  ├─ doctor_id (FK → Doctors)
  ├─ appointment_date
  ├─ reason
  ├─ status
  ├─ notes
  └─ created_at

Staff
  ├─ staff_id (PK)
  ├─ first_name, last_name
  ├─ email, phone
  ├─ role
  ├─ department
  ├─ is_active
  └─ created_at
```

## 🔐 Security Notes

### Current Development Setup
- DEBUG = True (change to False in production)
- SECRET_KEY = Generic (change in production)
- CORS = localhost:3000 only
- No authentication required

### For Production
1. Change `DEBUG = False` in `config/settings.py`
2. Update `SECRET_KEY` with a secure random key
3. Update `ALLOWED_HOSTS` list
4. Add authentication (JWT, OAuth2, etc.)
5. Use environment variables for sensitive data
6. Enable HTTPS/SSL
7. Use Gunicorn/uWSGI with Nginx reverse proxy

## 📝 Copilot Instructions

AI coding agents have access to `.github/copilot-instructions.md` which includes:
- Architecture patterns
- File structure reference
- Django and React conventions
- Common workflow commands
- Database relationships
- Integration points
- Common debugging tips

## 🎯 Next Steps

1. **Add sample data**: Use the admin panel or create through API
2. **Customize styling**: Modify `frontend/src/App.css`
3. **Add new features**: Follow the pattern of existing apps
4. **Deploy**: Follow production setup steps
5. **Add tests**: Create `tests.py` in each Django app

## 📞 Troubleshooting

**Issue**: Backend not connecting to frontend
- ✓ Check both servers running (8000 & 3000)
- ✓ Check CORS_ALLOWED_ORIGINS in settings.py
- ✓ Clear browser cache and hard refresh (Ctrl+Shift+R)

**Issue**: Database errors after changes
- ✓ Run: `python manage.py makemigrations`
- ✓ Run: `python manage.py migrate`
- ✓ Delete `db.sqlite3` and re-migrate to reset (dev only)

**Issue**: npm packages not installing
- ✓ Delete `node_modules` folder
- ✓ Delete `package-lock.json`
- ✓ Run: `npm install` again

**Issue**: Python virtual environment issues
- ✓ Delete `venv` folder
- ✓ Create new: `python -m venv venv`
- ✓ Activate and reinstall

---

**Your hospital management system is ready for development and interview demonstrations!** 🎉

For questions about architecture or patterns, refer to `.github/copilot-instructions.md`
