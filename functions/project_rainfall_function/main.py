import logging
from flask import Request, make_response, jsonify

try:
    import zcatalyst_sdk
except ImportError:
    zcatalyst_sdk = None

from services.auth_service import get_authenticated_user
from controllers.user_controller import get_me
from controllers.upload_controller import handle_upload
from controllers.file_info_controller import get_file_info, get_columns


def handler(request: Request):
    app = zcatalyst_sdk.initialize()
    logger = logging.getLogger()

    user = get_authenticated_user(app)
    if not user:
        return make_response("Unauthorized", 401)
    
    path = request.path
    method = request.method

    if request.path == "/me":
        return get_me(user)
    
    elif path == "/upload":
        if method == "POST":
            return handle_upload(request) # not implemented yet
        else:
            return make_response("Method Not Allowed", 405)

    elif path == "/fun1" and method == "GET":
        return get_file_info()

    elif path == "/fun2" and method == "GET":
        return get_columns()

    elif request.path == "/":
        return jsonify({
            "message": f"Hello {user.get('first_name')}"
        }), 200

    else:
        return make_response("Not Found", 404)