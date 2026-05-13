import logging
from flask import Request, make_response, jsonify

try:
    import zcatalyst_sdk
except ImportError:
    zcatalyst_sdk = None

from services.auth_service import get_authenticated_user
from controllers.user_controller import get_me
from controllers.math_controller import handle_sum

def handler(request: Request):
    app = zcatalyst_sdk.initialize()
    logger = logging.getLogger()

    user = get_authenticated_user(app)
    if not user:
        return make_response("Unauthorized", 401)

    if request.path == "/me":
        return get_me(user)

    elif request.path == "/sum":
        return handle_sum(request)

    elif request.path == "/":
        return jsonify({
            "message": f"Hello {user.get('first_name')}"
        }), 200

    else:
        return make_response("Not Found", 404)