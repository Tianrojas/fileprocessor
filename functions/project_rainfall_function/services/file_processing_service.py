from models.record_factory import create_record

records = []

#Modo de usar la función create_record para crear un nuevo registro y agregarlo a la lista de registros
for row in parsed_rows:

    record = create_record("ITSM", row)

    records.append(record.to_dict())

