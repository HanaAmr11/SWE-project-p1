from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from authlib.integrations.flask_client import OAuth
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash
from itsdangerous import SignatureExpired, BadTimeSignature
from itsdangerous import URLSafeTimedSerializer as Serializer
from dotenv import load_dotenv
import os
import random
import pandas as pd

# Load environment variables
load_dotenv()
app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY")

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Security and Authentication
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = "signin"

# Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')
mail = Mail(app)

# Serializer for token generation
serializer = Serializer(app.secret_key)

# OAuth for Google Login
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.environ.get('GOOGLE_CLIENT_ID'),
    client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# Database Model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=True)
    role = db.Column(db.String(50), default="user")

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes

@app.route("/")
def index():
    return redirect(url_for("signup"))

@app.route("/home")
@login_required
def home():
    return render_template("home-2.html", current_user=current_user)

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        if User.query.filter_by(email=email).first():
            flash("User already exists", "danger")
            return redirect(url_for("signup"))

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        new_user = User(email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for("home"))

    return render_template("signup.html")

@app.route("/signin", methods=["GET", "POST"])
def signin():
    error = None
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for("home"))
        error = "Invalid email or password. Please try again."

    return render_template("signin.html", error=error)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("signin"))

@app.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        email = request.form.get("email")
        user = User.query.filter_by(email=email).first()
        if user:
            token = serializer.dumps(email, salt=os.environ.get("PASSWORD_RESET_SALT", "default-salt"))
            reset_url = url_for('reset_password', token=token, _external=True)

            msg = Message("Password Reset Request",
                          sender=app.config['MAIL_DEFAULT_SENDER'],
                          recipients=[email])
            msg.body = f"To reset your password, click the following link: {reset_url}"

            try:
                mail.send(msg)
                flash("If an account with that email exists, a password reset link has been sent.", "info")
            except Exception as e:
                flash(f"Error sending email: {e}", "danger")
        else:
            flash("Email not found in our records.", "danger")

        return redirect(url_for("signin"))

    return render_template("forgot_password.html")

@app.route("/reset-password/<token>", methods=["GET", "POST"])
def reset_password(token):
    try:
        email = serializer.loads(token, salt=os.environ.get("PASSWORD_RESET_SALT", "default-salt"), max_age=3600)
    except (SignatureExpired, BadTimeSignature):
        flash("The token is invalid or expired.", "danger")
        return redirect(url_for("forgot_password"))

    if request.method == "POST":
        new_password = request.form.get("password")
        hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")

        user = User.query.filter_by(email=email).first()
        if user:
            user.password = hashed_password
            db.session.commit()
            flash("Your password has been updated!", "success")
            return redirect(url_for("signin"))

    return render_template("reset_password.html", token=token)

@app.route('/login/google')
def google_login():
    redirect_uri = url_for('google_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/login/google/callback')
def google_callback():
    token = google.authorize_access_token()
    user_info = token.get('userinfo')
    if user_info:
        email = user_info.get('email')
        user = User.query.filter_by(email=email).first()

        if user:
            login_user(user)
        else:
            new_user = User(email=email)
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user)
        return redirect(url_for('home'))
    else:
        flash("Authentication failed. Please try again.", "danger")
        return redirect(url_for('signin'))

@app.route("/calcalc")
def calcalc():
    return render_template("calcalc.html")

@app.route("/bmi")
def bmi():
    return render_template("bmi.html")

@app.route("/goal_check")
def goal_check():
    return render_template("goal_check.html")

@app.route("/ht")
def ht():
    return render_template("ht.html")

@app.route("/blogs")
def blogs():
    return render_template("blogs.html")

@app.route("/rateus")
def rate_us():
    return render_template("rateus.html")

# Random Benefit
benefits_df = pd.read_csv('C:/Users/farah mostafa/Documents/GitHub/SWE-project-p1/fruit_vegetable_benefits.csv')

@app.route('/get-random-benefit')
def get_random_benefit():
    if not benefits_df.empty:
        random_idx = random.randint(0, len(benefits_df)-1)
        benefit = benefits_df.iloc[random_idx].to_dict()
        return jsonify(benefit)
    return jsonify({"error": "No data available"}), 404

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
