from flask import Blueprint, request, jsonify
from extensions import db
from models.task import Task
from models.project import Project
from models.user import User
from middleware.auth_middleware import token_required, admin_required
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/', methods=['GET'])
@token_required
def get_tasks():
    project_id = request.args.get('project_id')
    if not project_id:
        return jsonify({'error': 'project_id is required'}), 400

    tasks = Task.query.filter_by(project_id=project_id).all()
    
    result = []
    for task in tasks:
        task_dict = task.to_dict()
        if task.assigned_to:
            user = User.query.get(task.assigned_to)
            task_dict['assigned_user'] = user.to_dict() if user else None
        else:
            task_dict['assigned_user'] = None
        result.append(task_dict)
    
    return jsonify(result), 200

@tasks_bp.route('/', methods=['POST'])
@token_required
def create_task():
    current_user = request.current_user
    data = request.get_json()
    if not data.get('title') or not data.get('project_id'):
        return jsonify({'error': 'Title and project_id are required'}), 400
    project = Project.query.get(data['project_id'])
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    due_date = None
    if data.get('due_date'):
        due_date = datetime.strptime(data['due_date'], '%Y-%m-%d')
    task = Task(
        title=data['title'],
        description=data.get('description', ''),
        status=data.get('status', 'todo'),
        due_date=due_date,
        project_id=data['project_id'],
        assigned_to=data.get('assigned_to'),
        created_by=current_user.id
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({'message': 'Task created', 'task': task.to_dict()}), 201

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@token_required
def update_task(task_id):
    data = request.get_json()
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    if data.get('title'):
        task.title = data['title']
    if data.get('description'):
        task.description = data['description']
    if data.get('status'):
        task.status = data['status']
    if data.get('assigned_to'):
        task.assigned_to = data['assigned_to']
    if data.get('due_date'):
        task.due_date = datetime.strptime(data['due_date'], '%Y-%m-%d')
    db.session.commit()
    return jsonify({'message': 'Task updated', 'task': task.to_dict()}), 200

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@admin_required
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'}), 200