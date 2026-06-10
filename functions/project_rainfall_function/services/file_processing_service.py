from models.record_factory import create_record

def build_records(parsed_rows, tipo="ITSM"):
    records = []

    for row in parsed_rows:
        record = create_record(tipo, row)
        records.append(record.to_dict())

    return records