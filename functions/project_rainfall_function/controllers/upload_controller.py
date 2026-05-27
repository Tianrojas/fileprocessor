from flask import jsonify
from services.file_processing_service import process_file_stream

def handle_upload(request):
    try:
        file = request.files.get("file")

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        result = process_file_stream(file)

        return jsonify({
            "status": "ok",
            "data": result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
