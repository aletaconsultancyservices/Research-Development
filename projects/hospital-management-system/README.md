# Hospital Management System - Full Stack

A professional full-stack hospital management website built with Django REST Framework and React.

## Project Structure

```
hospital-management-system/
├── backend/
│   ├── config/              # Django project configuration
│   ├── patients/            # Patient management app
│   ├── doctors/             # Doctor management app
│   ├── appointments/        # Appointment scheduling app
│   ├── staff/               # Staff management app
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/      # React components
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Backend Setup

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Apply migrations:
```bash
python manage.py migrate
```

5. Create superuser for admin:
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

Backend API runs on: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

## Frontend Setup

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

Frontend runs on: `http://localhost:3000`

## API Endpoints

### Patients
- `GET /api/patients/` - List all patients
- `POST /api/patients/` - Create new patient
- `GET /api/patients/{id}/` - Get patient details
- `PUT /api/patients/{id}/` - Update patient
- `DELETE /api/patients/{id}/` - Delete patient
- `GET /api/patients/search/?q=query` - Search patients

### Doctors
- `GET /api/doctors/` - List all doctors
- `POST /api/doctors/` - Create new doctor
- `GET /api/doctors/{id}/` - Get doctor details
- `PUT /api/doctors/{id}/` - Update doctor
- `DELETE /api/doctors/{id}/` - Delete doctor

### Appointments
- `GET /api/appointments/` - List all appointments
- `POST /api/appointments/` - Schedule appointment
- `GET /api/appointments/{id}/` - Get appointment details
- `PUT /api/appointments/{id}/` - Update appointment
- `DELETE /api/appointments/{id}/` - Cancel appointment
- `GET /api/appointments/upcoming/` - Get upcoming appointments

### Staff
- `GET /api/staff/` - List all staff
- `POST /api/staff/` - Add staff member
- `GET /api/staff/{id}/` - Get staff details
- `PUT /api/staff/{id}/` - Update staff
- `DELETE /api/staff/{id}/` - Delete staff

## Features

✅ Patient Management - Add, edit, delete patient records with medical history
✅ Doctor Management - Manage doctors with specialization and availability status
✅ Appointment Scheduling - Book and manage appointments
✅ Dashboard - Real-time statistics and overview
✅ Professional UI - Modern gradient design with responsive layout
✅ RESTful API - Django REST Framework backend
✅ SQLite Database - Lightweight but powerful database
✅ CORS Support - Frontend-backend communication enabled

## Technologies Used

### Backend
- Django 4.2.0
- Django REST Framework 3.14.0
- SQLite3
- Python-dotenv

### Frontend
- React 18.2.0
- Axios 1.4.0
- CSS3

## Development Workflow

### Adding New Features

1. Create Django app if needed:
```bash
python manage.py startapp appname
```

2. Define models in `models.py`
3. Create serializers in `serializers.py`
4. Create viewsets in `views.py`
5. Register in `config/urls.py`
6. Create React components in `frontend/src/components/`

### Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Deployment

### Backend (Production)
- Use Gunicorn or uWSGI
- Set DEBUG=False in settings.py
- Use environment variables for sensitive data
- Configure ALLOWED_HOSTS and CORS properly

### Frontend (Production)
```bash
npm run build
```
Deploy the `build/` directory to your hosting

## Admin Panel Access

Visit `http://localhost:8000/admin` and log in with your superuser credentials to manage data directly.

## License

This project is licensed under the MIT License.
