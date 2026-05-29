from services.file_store import get_file
from flask import jsonify

import polars as pl
import io

from services.file_store import get_file
from flask import jsonify


def get_file_info():

    content, name = get_file()

    if not content:
        return jsonify({"error": "No file stored"}), 400

    return jsonify({
        "filename": name,
        "size_bytes": len(content)
    })


def get_columns():

    content, name = get_file()

    if not content:
        return jsonify({"error": "No file stored"}), 400

    if not name.endswith(".csv"):
        return jsonify({"error": "Not CSV"}), 400

    df = pl.read_csv(io.BytesIO(content), infer_schema_length=0)

    return jsonify({
        "columns": df.columns[:2]
    })
