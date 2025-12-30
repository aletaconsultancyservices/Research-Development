# Copilot Instructions for Hospital Management System

## Project Overview

This is a **full-stack hospital management web application** with:
- **Backend**: Django REST API (Python) managing 4 core entities (Patients, Doctors, Appointments, Staff)
- **Frontend**: React SPA with tab-based navigation for different management modules
- **Database**: SQLite3 with ForeignKey relationships between entities
- **Architecture**: Multi-app Django with REST Framework + React consuming Axios

## Architecture & Design Patterns

### Backend Structure (Django)
```
backend/
  config/           # Project settings & URLs
  patients/         # Django app: Patient CRUD + search
  doctors/          # Django app: Doctor CRUD + availability
  appointments/     # Django app: Appointment scheduling with FK to patients & doctors
  staff/            # Django app: Staff CRUD
```

**Key Pattern**: Each app follows Django conventions:
- `models.py` → ORM entities with AutoField primary keys (patient_id, doctor_id, etc.)
- `serializers.py` → REST serialization using `ModelSerializer`
- `views.py` → ViewSets with automatic CRUD + custom `@action` endpoints
- `admin.py` → Django admin registration with list_display, search_fields, filters
- Auto-registered in `config/urls.py` via `DefaultRouter`

**Critical Integration Points**:
- `appointments/models.py` has ForeignKeys to both patients & doctors
- `appointments/serializers.py` uses nested serialization (reads Patient/Doctor objects, writes IDs)
- CORS enabled via `django-cors-headers` middleware (localhost:3000 trusted)

### Frontend Structure (React)
```
frontend/src/
  components/
    Dashboard.js            # Stats cards (fetches all 3 endpoints)
    PatientManagement.js    # Full CRUD form + table
    DoctorManagement.js     # Full CRUD form + table
    AppointmentManagement.js  # Nested dropdown selection (patients→doctors)
  App.js            # Tab router & navbar
  App.css           # Gradient purple theme (#667eea-#764ba2)
```

**Pattern**: Each component:
1. State: `[items, showForm, editingId, loading, message, formData]`
2. Effects: Fetch data on mount from `http://localhost:8000/api/{endpoint}/`
3. Handlers: `handleChange`, `handleSubmit`, `handleEdit`, `handleDelete`, `resetForm`
4. UI: Toggle form, render table with action buttons, show alerts

**API Communication**:
- Axios for all HTTP (GET, POST, PUT, DELETE)
- Base URL: hardcoded to `http://localhost:8000/api/`
- Error handling: Catch-all `.catch()` sets generic message
- IDs passed as route params: `/patients/{id}/`, `/appointments/{id}/`

## Developer Workflows

### Local Development Startup

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver  # Runs on 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start  # Runs on 3000, auto-opens browser
```

### Database Workflow

1. **Modify models** → `backend/{app}/models.py`
2. **Generate migration** → `python manage.py makemigrations`
3. **Apply migration** → `python manage.py migrate`
4. **Test in admin** → Visit `http://localhost:8000/admin`

### Adding a New Feature (e.g., billing)

**Backend Steps**:
1. `python manage.py startapp billing`
2. Define `models.py` with ForeignKeys to patients/doctors
3. Create `serializers.py` with nested relationships if needed
4. Create `views.py` with `ViewSet` and custom `@action` methods
5. Add to `config/INSTALLED_APPS` (already done for existing apps)
6. Register in `config/urls.py` router: `router.register(r'billing', BillingViewSet)`
7. Run `makemigrations` + `migrate`

**Frontend Steps**:
1. Create `src/components/BillingManagement.js` following PatientManagement pattern
2. Add tab button to `App.js` navbar
3. Add conditional render in App.js container

### Common Debugging

**Backend Error: "No module named 'patients'"**
→ Verify app added to `INSTALLED_APPS` in `config/settings.py`

**Frontend: "Cannot GET /api/..."**
→ Check backend running on 8000; verify CORS in `settings.py`; check URL in axios call

**CORS Error in Console**
→ Confirm `http://localhost:3000` in `CORS_ALLOWED_ORIGINS`

**Form not updating**
→ Check `handleChange` correctly maps input.name to formData keys; verify form.name attributes

## Project-Specific Conventions

### Naming
- **Primary Keys**: Named custom IDs (`patient_id`, `doctor_id`, etc.) not auto-generated
- **API Endpoints**: Plural routes `/api/patients/`, `/api/doctors/`
- **React Functions**: Prefix handlers `handle*` (handleChange, handleSubmit)
- **Django Apps**: Lowercase, single words (patients, doctors, appointments, staff)

### Data Flow
- **Reads**: Frontend fetches entire lists; pagination via `PAGE_SIZE: 10` but not enforced UI-side
- **Writes**: Form data sent as JSON in request body; server returns updated object
- **Deletions**: Soft-delete not implemented; use admin to restore

### Styling
- **Theme**: Purple gradient (`#667eea` → `#764ba2`), white cards, no external UI library
- **Responsive**: CSS Grid/Flexbox with `@media (max-width: 768px)` breakpoint
- **Badges**: Status-colored badges (success/danger/primary/warning)

### Error Handling
- **Backend**: DRF default serializer validation; returns 400 with field errors
- **Frontend**: Generic `setMessage('Error...')` on all catch blocks; display for 3 seconds
- **No retry logic**: User must retry manually

## Integration Points & External Dependencies

### Critical Dependencies
- **Backend**: `django`, `djangorestframework`, `django-cors-headers`, `pillow` (for image handling - currently unused)
- **Frontend**: `react`, `react-dom`, `axios`

### API Contract
- All responses: JSON (list of objects or paginated)
- Appointment writes: Must include `patient_id` and `doctor_id` as integers
- Appointment reads: Nested Patient/Doctor objects returned
- No authentication/auth headers currently (admin panel uses Django session)

### Database Relationships
```
Appointment (FK→ Patient, FK→ Doctor)
Patient (no incoming FK)
Doctor (no incoming FK)
Staff (no incoming FK)
```
Deleting a patient cascades to delete appointments; same for doctors.

## Quick Reference: File Purpose

| File | Purpose |
|------|---------|
| `config/settings.py` | INSTALLED_APPS, MIDDLEWARE, CORS, DB config |
| `config/urls.py` | Router registration; all endpoints auto-generated |
| `{app}/models.py` | ORM definition; cascade on delete |
| `{app}/serializers.py` | JSON serialization; nested writes/reads |
| `{app}/views.py` | ViewSet CRUD + custom @action methods |
| `{app}/admin.py` | Admin UI filtering & search |
| `App.js` | Tab router & navbar; holds `activeTab` state |
| `App.css` | Global theme, responsive breakpoints |
| `*Management.js` | CRUD component for one entity |
| `Dashboard.js` | Stat cards; parallel API fetches |
| `.github/copilot-instructions.md` | **You are here** |

## Ask Clarifying Questions Before Major Changes

- **Schema Changes**: Will this break existing appointments/relationships?
- **UI Changes**: Should all management components follow the same pattern?
- **Auth Addition**: Need user login + permissions before new features?
- **Search/Filter**: Should complex filtering happen backend (ORM) or frontend (JS)?

---

**Last Updated**: December 16, 2025  
**Tech Stack**: Django 4.2 + React 18 + SQLite3  
**Target Audience**: AI coding agents (Copilot/Claude) building features autonomously
