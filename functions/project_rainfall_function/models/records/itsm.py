from .base import BaseRecord

class ITSMRecord(BaseRecord):

    def __init__(self, data):
        self.data = {
            "Fecha de creacion": data.get("fecha_creacion", ""),
            "Visitor ID": data.get("visitor_id", ""),
            "Canal": data.get("canal", ""),
            "Grupo": "ITSM",
            "Producto": data.get("producto", ""),
            "Responsable": data.get("responsable", ""),
            "Pais": data.get("pais", ""),
            "Cliente": data.get("cliente", ""),
            "Idioma": data.get("idioma", ""),
            "Prioridad": data.get("prioridad", "Normal"),
            "Duracion chat": data.get("duracion_chat", ""),
            "Duracion primera respuesta": data.get("duracion_primera_respuesta", ""),
            "Tiempo de solucion": data.get("tiempo_solucion", ""),
            "Rating": data.get("rating", "")
        }

    def to_dict(self):
        return self.data
