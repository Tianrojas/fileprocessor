from flask import jsonify
from services.user_service import format_user

def get_me(user):
    return jsonify(format_user(user)), 200