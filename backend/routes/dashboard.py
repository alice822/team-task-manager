from flask import Blueprint, jsonify, request
from models.task import Task
from models.project import Project
from models.project_member import ProjectMember
from middleware.auth_middleware import token_required
from datetime import datetime

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/', methods=['GET'])
@token_required
def get_dashboard():
    current_user = request.current_user

    if current_user.role == 'admin':
        projects = Project.query.all()
    else:
        memberships = ProjectMember.query.filter_by(user_id=current_user.id).all()
        project_ids = [m.project_id for m in memberships]
        projects = Project.query.filter(Project.id.in_(project_ids)).all()

    project_ids = [p.id for p in projects]

    total_tasks = Task.query.filter(Task.project_id.in_(project_ids)).count()
    todo = Task.query.filter(Task.project_id.in_(project_ids), Task.status=='todo').count()
    in_progress = Task.query.filter(Task.project_id.in_(project_ids), Task.status=='in_progress').count()
    done = Task.query.filter(Task.project_id.in_(project_ids), Task.status=='done').count()
    overdue = Task.query.filter(
        Task.project_id.in_(project_ids),
        Task.due_date < datetime.utcnow(),
        Task.status != 'done'
    ).count()

    project_stats = []
    for project in projects:
        total = Task.query.filter_by(project_id=project.id).count()
        completed = Task.query.filter_by(project_id=project.id, status='done').count()
        project_stats.append({
            'id': project.id,
            'name': project.name,
            'total_tasks': total,
            'completed_tasks': completed,
            'progress': round((completed / total * 100) if total > 0 else 0)
        })

    return jsonify({
        'total_projects': len(projects),
        'total_tasks': total_tasks,
        'todo': todo,
        'in_progress': in_progress,
        'done': done,
        'overdue': overdue,
        'project_stats': project_stats
    }), 200