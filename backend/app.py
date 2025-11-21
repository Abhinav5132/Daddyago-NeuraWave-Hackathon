from flask import Flask, Response, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from typing import Optional
from flask_cors import CORS
from modelConnector import RegressorModelConnector, ClassifierModelConnector
from healthApiConnector import csvHealthConnector

app = Flask(__name__)

CORS(app,
     origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://10.0.1.90:3000"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False

app.config['WTF_CSRF_ENABLED'] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = "supersecret"

db = SQLAlchemy(app)
migrate = Migrate(app, db)


# ----------------------
# Models
# ----------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    gender = db.Column(db.String(120), nullable = False)
    migraine_days_per_month = db.Column(db.Integer,nullable = False )
    trigger_stress = db.Cloumn(db.Integer, nullable = False)
    trigger_hormones = db.Cloumn(db.Integer, nullable = False)
    trigger_sleep = db.Cloumn(db.Integer, nullable = False)
    trigger_weather = db.Cloumn(db.Integer, nullable = False) 
    trigger_meals = db.Cloumn(db.Integer, nullable = False)
    trigger_medicine = db.Cloumn(db.Integer, nullable = False)
    normal_sleep = db.Cloumn(db.Integer, nullable = False)
# class HealthUserMigraineData(db.Model):
#     pass

# class TriggerUserMigraineData(db.Model):
#     pass

# ----------------------
# Routes
# ----------------------
@app.route("/register", methods=["POST"])
def register()-> tuple[Response, int]:
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    gender = data.get("gender")
    migraine_days_per_month = data.get("migraine_days_per_month")
    trigger_stress = data.get("trigger_stress")
    trigger_hormones = data.get("trigger_hormones")
    trigger_sleep = data.get("trigger_sleep")
    trigger_weather = data.get("trigger_weather")
    trigger_meals = data.get("trigger_meals")
    trigger_medicine = data.get("trigger_medicine")
    normal_sleep = data.get("normal_sleep")


    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(username=username, password=password, gender=gender, 
    migraine_days_per_month=migraine_days_per_month, trigger_stress=trigger_stress, 
    trigger_hormones=trigger_hormones, trigger_sleep=trigger_sleep, 
    trigger_weather=trigger_weather, trigger_meals = trigger_meals, 
    trigger_medicine = trigger_medicine,
    normal_sleep = normal_sleep)
    
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login()-> tuple[Response, int]:
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username, password=password).first()
    if user:
        session["user_id"] = user.id
        return jsonify({"message": f"Logged in as {username}"}), 200
    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/logout")
def logout()-> tuple[Response, int]:
    session.pop("user_id", None)
    return jsonify({"message": "Logged out"}), 200

@app.route("/me")
def me()-> tuple[Response, int]:
    if "user_id" in session:
        user = User.query.get(session["user_id"])
        return jsonify({"user_id": user.id, "username": user.username}), 200 # type: ignore
    return jsonify({"error": "Not logged in"}), 401

@app.route("/predict_probability", methods=["POST"])
def predict_proability()-> tuple[Response, int]:

    person_data_json = request.get_json()
    if person_data_json is None:
        return jsonify({"error": "No JSON data received"}), 400

    health_data_json = csvHealthConnector()
    regressorConnecter = RegressorModelConnector()
    prediction = regressorConnecter.get_prediction(health_data_json, person_data_json)

    return jsonify({"probability": prediction}), 200

@app.route("/predict_type", methods = ["POST"])
def predict_type()-> tuple[Response, int]: 
    person_data_json = request.get_json()
    if person_data_json is None:
        return jsonify({"error": "No JSON data received"}), 400

    classifierConnector = ClassifierModelConnector()
    prediction = classifierConnector.get_prediction(person_data_json)

    return jsonify({"probability": prediction}), 200

if __name__ == "__main__":
    app.run(debug=True)
