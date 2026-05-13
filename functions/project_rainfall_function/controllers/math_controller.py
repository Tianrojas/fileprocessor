from flask import jsonify, make_response
from services.math_service import sum_matrices

def handle_sum(request):
    try:
        body = request.get_json()

        a = body.get("a")
        b = body.get("b")

        if a is None or b is None:
            return jsonify({"error": "Missing values"}), 400

        result = sum_matrices(a, b)

        return jsonify({"result": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400