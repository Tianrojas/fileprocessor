from services.file_store_service import upload_to_filestore
from flask import jsonify

def handle_upload(request):

    file_id = upload_to_filestore(request)

    return jsonify({
        "status": "stored",
        "file_id": file_id
    })