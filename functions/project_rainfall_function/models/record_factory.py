from models.records.itsm import ITSMRecord
# from models.records.usm import USMRecord
# from models.records.itom import ITOMRecord

RECORD_REGISTRY = {
    "ITSM": ITSMRecord,
    # "USM": USMRecord,
    # "ITOM": ITOMRecord
}


def create_record(tipo, data):

    record_class = RECORD_REGISTRY.get(tipo)

    if not record_class:
        raise ValueError(f"Tipo no soportado: {tipo}")

    return record_class(data)
