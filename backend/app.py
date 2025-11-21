from flask import Flask, Response, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


AppResponse = tuple[Response, int]

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = "hunter2"

db = SQLAlchemy(app)
migrate = Migrate(app, db)


# ----------------------
# Models
# ----------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)


# class HealthUserMigraineData(db.Model):
#     pass


# class TriggerUserMigraineData(db.Model):
#     pass

# ----------------------
# Routes
# ----------------------
@app.route("/register", methods=["POST"])
def register() -> AppResponse:
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login() -> AppResponse:
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username, password=password).first()
    if user:
        session["user_id"] = user.id
        return jsonify({"message": f"Logged in as {username}"}), 200
    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/logout")
def logout() -> AppResponse:
    session.pop("user_id", None)
    return jsonify({"message": "Logged out"}), 200


@app.route("/me")
def me() -> AppResponse:
    if "user_id" in session:
        user = User.query.get(session["user_id"])
        return jsonify({"user_id": user.id, "username": user.username}), 200
    return jsonify({"error": "Not logged in"}), 401


if __name__ == "__main__":
    app.run(debug=True)
