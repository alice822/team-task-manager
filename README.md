# Team Task Manager

A full-stack project management web app built with React.js and Flask, inspired by Jira.

## Live Demo
Coming soon - Railway URL

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + TailwindCSS |
| Backend | Python + Flask |
| Database | PostgreSQL |
| Auth | JWT Authentication |
| Deployment | Railway |

## Features

- Authentication (Signup/Login with JWT)
- Role-based access control (Admin/Member)
- Project creation and management
- Task creation, assignment and status tracking
- Kanban board (Todo/In Progress/Done)
- Dashboard with charts and progress tracking
- Rate limiting and password validation
- Assign tasks to team members
- Task priority levels

## Local Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `backend/.env` file:

DATABASE_URL=postgresql://username@localhost:5432/taskmanager
JWT_SECRET_KEY=your_secret_key
FLASK_ENV=development

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/users` | Auth | Get all users |

### Projects
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/projects/` | Auth | Get all projects |
| POST | `/api/projects/` | Admin | Create project |
| GET | `/api/projects/:id` | Auth | Get project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| POST | `/api/projects/:id/members` | Admin | Add member |
| GET | `/api/projects/:id/members` | Auth | Get members |

### Tasks
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/tasks/` | Auth | Get tasks |
| POST | `/api/tasks/` | Auth | Create task |
| PUT | `/api/tasks/:id` | Auth | Update task |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/` | Auth | Get stats |

## Roles and Permissions

| Feature | Admin | Member |
|---|---|---|
| Create project | Yes | No |
| Delete project | Yes | No |
| Add members | Yes | No |
| Create task | Yes | Yes |
| Update task status | Yes | Yes |
| Delete task | Yes | No |
| View dashboard | Yes | Yes |




