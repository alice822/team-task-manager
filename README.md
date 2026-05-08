# Team Task Manager
A full-stack web application where users can create projects, assign tasks to team members, and track progress with role-based access control for Admins and Members.

Live URL: https://your-app.railway.app  
Demo Video: https://your-video-link.com  
GitHub Repo: https://github.com/alice822/team-task-manager

---

## Features
- Authentication with Signup and Login using JWT tokens
- Project and team management
- Task creation, assignment, and status tracking
- Dashboard with task overview and overdue items
- Role-based access control for Admin and Member roles

---

## Tech Stack

### Backend
- Python + Flask — REST API
- Flask-JWT-Extended — Authentication
- SQLAlchemy — Database ORM
- PostgreSQL — Database
- Flask-Migrate — Migrations

### Frontend
- React + Vite
- Axios — HTTP requests
- React Context API — Auth state
- React Router — Client-side routing

### Deployment
- Railway — Backend, frontend, and database

---

## Project Structure
```
team-task-manager/
├── backend/
│   ├── middleware/
│   │   └── auth_middleware.py
│   ├── models/
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── task.py
│   │   └── project_member.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── projects.py
│   │   ├── tasks.py
│   │   └── dashboard.py
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   └── .env.example
├── frontend/
│   └── src/
│       ├── api/axios.js
│       ├── components/
│       ├── context/AuthContext.jsx
│       └── pages/
└── README.md
```

---

## Local Setup
### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

### 1. Clone the repo
```bash
git clone https://github.com/alice822/team-task-manager.git
cd team-task-manager
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file based on `.env.example`:
```
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
DATABASE_URL=postgresql://user:password@localhost/teamtaskdb
```

Run migrations and start the server:
```bash
flask db upgrade
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/signup | Register a new user |
| POST | /auth/login | Login and receive JWT token |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /projects | List all projects | Member |
| POST | /projects | Create a project | Admin |
| DELETE | /projects/<id> | Delete a project | Admin |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /tasks | List tasks | Member |
| POST | /tasks | Create a task | Admin |
| PATCH | /tasks/<id> | Update task status | Member |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard | Task summary and overdue items |

---

## Role-Based Access

| Feature | Admin | Member |
|---------|-------|--------|
| Create Project | Yes | No |
| Delete Project | Yes | No |
| Create Task | Yes | No |
| Assign Task | Yes | No |
| Update Task Status | Yes | Yes |
| View Dashboard | Yes | Yes |

---

## Deployment

The app is deployed on Railway.

- Backend API: https://your-backend.railway.app
- Frontend: https://your-frontend.railway.app

---

## Environment Variables

```
SECRET_KEY=
JWT_SECRET_KEY=
DATABASE_URL=
```

See `.env.example` for reference.

---

## Author

Your Name  
GitHub: https://github.com/alice822