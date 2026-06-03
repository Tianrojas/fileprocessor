from services.file_store_service import download_from_filestore
from services.file_store import get_file
from flask import request, jsonify

import polars as pl
import io


def get_file_info():

    file_id = request.args.get("file_id")

    if not file_id:
        return jsonify({"error": "missing file_id"}), 400

    path = download_from_filestore(file_id)

    size = os.path.getsize(path)

    return jsonify({
        "file_id": file_id,
        "size_bytes": size
    })


def get_columns():

    file_id = request.args.get("file_id")

    if not file_id:
        return jsonify({"error": "missing file_id"}), 400

    path = download_from_filestore(file_id)

    df = pl.read_csv(path, infer_schema_length=0)

    return jsonify({
        "columns": df.columns[:2]
    })

