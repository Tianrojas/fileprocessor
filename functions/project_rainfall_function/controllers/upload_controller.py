from services.file_store import save_file
from flask import jsonify

def handle_upload(request):

    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file"}), 400

    save_file(file)

    return jsonify({
        "status": "file stored",
        "filename": file.filename
    })