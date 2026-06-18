function buildItsmRecord(data) {
  return {
    FECHA_DE_CREACION: data.fecha_creacion || "",
    VISITOR_ID: data.visitor_id || "",
    CANAL: data.canal || "",
    GRUPO: "ITSM",
    PRODUCTO: data.producto || "",
    RESPONSABLE: data.responsable || "",
    PAIS: data.pais || "",
    CLIENTE: data.cliente || "",
    IDIOMA: data.idioma || "",
    PRIORIDAD: data.prioridad || "Normal",
    DURACION_CHAT: data.duracion_chat || "",
    DURACION_PRIMERA_RESPUESTA: data.duracion_primera_respuesta || "",
    TIEMPO_DE_SOLUCION: data.tiempo_de_solucion || "",
    RATING: data.rating || ""
  };
}

module.exports = { buildItsmRecord };