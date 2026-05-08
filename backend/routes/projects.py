from flask import Blueprint, request, jsonify
from extensions import db
from models.project import Project
from models.project_member import ProjectMember
from models.user import User
from middleware.auth_middleware import token_required, admin_required

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/', methods=['GET'])
@token_required
def get_projects():
    current_user = request.current_user
    if current_user.role == 'admin':
        projects = Project.query.all()
    else:
        memberships = ProjectMember.query.filter_by(user_id=current_user.id).all()
        project_ids = [m.project_id for m in memberships]
        projects = Project.query.filter(Project.id.in_(project_ids)).all()
    return jsonify([p.to_dict() for p in projects]), 200

@projects_bp.route('/', methods=['POST'])
@admin_required
def create_project():
    current_user = request.current_user
    data = request.get_json()
    if not data.get('name'):
        return jsonify({'error': 'Project name is required'}), 400
    project = Project(
        name=data['name'],
        description=data.get('description', ''),
        created_by=current_user.id
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({'message': 'Project created', 'project': project.to_dict()}), 201

@projects_bp.route('/<int:project_id>/members', methods=['POST'])
@admin_required
def add_member(project_id):
    data = request.get_json()
    if not data.get('user_id'):
        return jsonify({'error': 'user_id is required'}), 400
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    existing = ProjectMember.query.filter_by(project_id=project_id, user_id=data['user_id']).first()
    if existing:
        return jsonify({'error': 'User already a member'}), 409
    member = ProjectMember(project_id=project_id, user_id=data['user_id'])
    db.session.add(member)
    db.session.commit()
    return jsonify({'message': 'Member added', 'member': member.to_dict()}), 201

@projects_bp.route('/<int:project_id>/members', methods=['GET'])
@token_required
def get_members(project_id):
    members = ProjectMember.query.filter_by(project_id=project_id).all()
    user_ids = [m.user_id for m in members]
    users = User.query.filter(User.id.in_(user_ids)).all()
    return jsonify([u.to_dict() for u in users]), 200

@projects_bp.route('/<int:project_id>', methods=['DELETE'])
@admin_required
def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    ProjectMember.query.filter_by(project_id=project_id).delete()
    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'Project deleted'}), 200

@projects_bp.route('/<int:project_id>', methods=['GET'])
@token_required
def get_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    members = ProjectMember.query.filter_by(project_id=project_id).all()
    user_ids = [m.user_id for m in members]
    users = User.query.filter(User.id.in_(user_ids)).all()
    
    return jsonify({
        'project': project.to_dict(),
        'members': [u.to_dict() for u in users]
    }), 200