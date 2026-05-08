Team Task Manager
A full-stack web application where users can create projects, assign tasks to team members, and track progress with role-based access control for Admins and Members.
Live URL: https://your-app.railway.app
Demo Video: https://your-video-link.com
GitHub Repo: https://github.com/alice822/team-task-manager


Features
Authentication with Signup and Login using JWT tokens
Project and team management
Task creation, assignment, and status tracking
Dashboard with task overview and overdue items
Role-based access control for Admin and Member roles


Tech Stack
Backend
Python + Flask — REST API
Flask-JWT-Extended — Authentication
SQLAlchemy — Database ORM
PostgreSQL — Database
Flask-Migrate — Migrations

Frontend
React + Vite
Axios — HTTP requests
React Context API — Auth state
React Router — Client-side routing

Deployment
Railway — Backend, frontend, and database


Local Setup
Prerequisites

Python 3.10+
Node.js 18+
PostgreSQL

1. Clone the repo
bashgit clone https://github.com/alice822/team-task-manager.git
cd team-task-manager
2. Backend Setup
bashcd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
Create a .env file based on .env.example:
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
DATABASE_URL=postgresql://user:password@localhost/teamtaskdb
Run migrations and start the server:
bashflask db upgrade
python app.py
3. Frontend Setup
bashcd frontend
npm install
npm run dev

API Endpoints
Auth
MethodEndpointDescriptionPOST/auth/signupRegister a new userPOST/auth/loginLogin and receive JWT token
Projects
MethodEndpointDescriptionAccessGET/projectsList all projectsMemberPOST/projectsCreate a projectAdminDELETE/projects/<id>Delete a projectAdmin
Tasks
MethodEndpointDescriptionAccessGET/tasksList tasksMemberPOST/tasksCreate a taskAdminPATCH/tasks/<id>Update task statusMember
Dashboard
MethodEndpointDescriptionGET/dashboardTask summary and overdue items

Role-Based Access
FeatureAdminMemberCreate ProjectYesNoDelete ProjectYesNoCreate TaskYesNoAssign TaskYesNoUpdate Task StatusYesYesView DashboardYesYes

Deployment
The app is deployed on Railway.

Backend API: https://your-backend.railway.app
Frontend: https://your-frontend.railway.app


Environment Variables
SECRET_KEY=
JWT_SECRET_KEY=
DATABASE_URL=
See .env.example for reference.
