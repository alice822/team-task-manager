from flask import jsonify, request
from flask_jwt_extended import decode_token
from functools import wraps
from models.user import User

def token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing token'}), 401
        try:
            token = auth_header.split(' ')[1]
            decoded = decode_token(token)
            user_id = int(decoded['sub'])
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 401
            request.current_user = user
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': str(e)}), 401
    return wrapper

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing token'}), 401
        try:
            token = auth_header.split(' ')[1]
            decoded = decode_token(token)
            user_id = int(decoded['sub'])
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 401
            if user.role != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            request.current_user = user
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': str(e)}), 401
    return wrapper