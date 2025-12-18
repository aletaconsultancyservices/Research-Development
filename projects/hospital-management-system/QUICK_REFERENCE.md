# Hospital Management System - Quick Reference

## 🚀 Start Application (Development)

**Windows:**
```bash
# Run setup.bat first (one-time)
setup.bat

# Then in two separate terminals:
# Terminal 1 - Backend
cd backend
venv\Scripts\activate
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm start
```

**Linux/Mac:**
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🎯 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | User interface |
| API | http://localhost:8000/api | REST endpoints |
| Admin | http://localhost:8000/admin | Django admin panel |
| Health | http://localhost:8000/api/patients/ | API test endpoint |

## 📦 File Structure Explained

```
backend/
  config/         → Settings (INSTALLED_APPS, CORS, database)
  patients/       → Patient CRUD operations
  doctors/        → Doctor CRUD operations
  appointments/   → Appointment scheduling
  staff/          → Staff management
  db.sqlite3      → Database (auto-created)
  requirements.txt → Python dependencies

frontend/
  src/
    components/   → PatientManagement, DoctorManagement, etc.
    api.js        → API client with base URL configuration
    App.js        → Tab router (Dashboard, Patients, Doctors, Appointments)
    App.css       → Professional styling (gradient theme)
  .env           → REACT_APP_API_URL (set to API location)
  package.json   → npm dependencies
```

## 🔧 Common Commands

### Backend
```bash
cd backend

# Create new app
python manage.py startapp newapp

# Create migration
python manage.py makemigrations

# Apply migration
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Run tests
python manage.py test

# Interactive shell
python manage.py shell
```

### Frontend
```bash
cd frontend

# Install packages
npm install

# Start dev server
npm start

# Build production
npm run build

# Run tests
npm test
```

## 🌐 API Endpoints Reference

### Patients
```
GET    /api/patients/
POST   /api/patients/
GET    /api/patients/{id}/
PUT    /api/patients/{id}/
DELETE /api/patients/{id}/
GET    /api/patients/search/?q=keyword
```

### Doctors
```
GET    /api/doctors/
POST   /api/doctors/
GET    /api/doctors/{id}/
PUT    /api/doctors/{id}/
DELETE /api/doctors/{id}/
```

### Appointments
```
GET    /api/appointments/
POST   /api/appointments/
GET    /api/appointments/{id}/
PUT    /api/appointments/{id}/
DELETE /api/appointments/{id}/
GET    /api/appointments/upcoming/
```

### Staff
```
GET    /api/staff/
POST   /api/staff/
GET    /api/staff/{id}/
PUT    /api/staff/{id}/
DELETE /api/staff/{id}/
```

## 🐛 Quick Debugging

### Backend Won't Start
```bash
# Check Python version
python --version  # Should be 3.8+

# Check if port 8000 is in use
# Windows: netstat -ano | findstr :8000
# Linux: lsof -i :8000

# Reinstall dependencies
pip install -r requirements.txt

# Reset database
rm db.sqlite3
python manage.py migrate
```

### Frontend Won't Start
```bash
# Check Node.js version
node --version  # Should be 14+

# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check if port 3000 is in use
# Windows: netstat -ano | findstr :3000
# Linux: lsof -i :3000
```

### CORS Error
Frontend console shows CORS error → Update `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

### API Returns 404
Check that backend is running at `http://localhost:8000/api/patients/`

## 📊 Database

### View Data
```bash
python manage.py shell
```
```python
from patients.models import Patient
Patient.objects.all()
Patient.objects.get(patient_id=1)
```

### Reset Database (⚠️ Deletes all data)
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

## 🎨 Customization

### Change Theme Color
Edit `frontend/src/App.css`:
```css
/* Line ~15 */
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
/* Change #667eea and #764ba2 to your colors */
```

### Add New Patient Field
1. Edit `backend/patients/models.py`
2. Add field to Patient model
3. Run `python manage.py makemigrations`
4. Run `python manage.py migrate`
5. Update `frontend/src/components/PatientManagement.js` form

### Disable Feature
Comment out in `frontend/src/App.js`:
```javascript
{activeTab === 'appointments' && <AppointmentManagement />}
```

## 🚀 Production Deployment

### Quick Docker Start
```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Production Checklist
1. Set `DEBUG=False` in `backend/.env`
2. Change `SECRET_KEY` to random 50+ character value
3. Update `ALLOWED_HOSTS` with your domain
4. Update `CORS_ALLOWED_ORIGINS`
5. Setup SSL certificate (Let's Encrypt)
6. Configure DNS to point to server
7. Run `docker-compose up -d`
8. Create superuser: `docker-compose exec backend python manage.py createsuperuser`

See `DEPLOYMENT_GUIDE.md` and `HOSTING_CHECKLIST.md` for full instructions.

## 📁 File Locations

| File | Purpose | Edit For |
|------|---------|----------|
| `backend/config/settings.py` | Django config | CORS, database, apps |
| `backend/config/urls.py` | API routes | Add/remove endpoints |
| `backend/{app}/models.py` | Database schema | Add fields |
| `backend/{app}/views.py` | API logic | Add custom endpoints |
| `frontend/.env` | React config | Change API URL |
| `frontend/src/App.js` | Tab router | Add/remove tabs |
| `frontend/src/App.css` | Styling | Change colors, fonts |
| `frontend/src/components/*.js` | Forms & tables | Change fields |

## 🔐 Security Reminders

- ✅ Never commit `.env` files to GitHub
- ✅ Change `SECRET_KEY` before deployment
- ✅ Set `DEBUG=False` in production
- ✅ Use HTTPS on production
- ✅ Validate all user input
- ✅ Use strong database passwords
- ✅ Keep dependencies updated

## 📞 Need Help?

- Django Docs: https://docs.djangoproject.com
- React Docs: https://react.dev
- Docker Docs: https://docs.docker.com
- Stack Overflow: Search your error message

## 🎯 Next Steps

1. ✅ Setup development environment (this guide)
2. ⏭️ Add sample data through admin or forms
3. ⏭️ Test all CRUD operations
4. ⏭️ Customize for your needs
5. ⏭️ Deploy to production (see DEPLOYMENT_GUIDE.md)

---

**Last Updated**: December 2025  
**Version**: 1.0 (Production Ready)
