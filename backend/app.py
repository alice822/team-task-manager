from flask import Flask
from extensions import db, jwt, cors, limiter
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    limiter.init_app(app)

    from routes.auth import auth_bp
    from routes.projects import projects_bp
    from routes.tasks import tasks_bp
    from routes.dashboard import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

    return app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Tables created!")
    app.run(debug=True)


    app = create_app()

@app.route('/')
def index():
    return {"message": "Team Task Manager API is running!"}, 200