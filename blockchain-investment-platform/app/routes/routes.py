from flask import render_template
from app.routes import main_bp

@main_bp.route('/')
def index():
    return render_template('index.html', title='Home')

@main_bp.route('/register')
def register():
    return render_template('register.html', title='Register')

@main_bp.route('/login')
def login():
    return render_template('login.html', title='Login')

@main_bp.route('/create-proposal')
def create_proposal():
    return render_template('create_proposal.html', title='Create Proposal')

@main_bp.route('/projects')
def projects():
    return render_template('projects.html', title='Browse Projects')

@main_bp.route('/dashboard')
def dashboard():
    return render_template('dashboard.html', title='Dashboard')
