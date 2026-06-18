const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { createRecord } = require('./recordFactory');

function extractCsvDataSection(rawContent) {
  const normalized = rawContent
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n');

  const lines = normalized.split('\n');

  const headerIndex = lines.findIndex(line =>
    line.includes('S.No') &&
    line.includes('Visitor ID') &&
    line.includes('Email Address')
  );

  if (headerIndex === -1) {
    throw new Error('CSV header not found');
  }

  return lines
    .slice(headerIndex)
    .filter(line => line.trim() !== '')
    .join('\n');
}

function parseCsvBatch(filePath, area = "ITSM", offset = 0, limit = 5) {
  const content = fs.readFileSync(filePath, 'utf-8');

  const cleanedCsv = extractCsvDataSection(content);

  const rows = parse(cleanedCsv, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ',',
    relax_column_count: true,
    trim: true
  });

  const totalRows = rows.length;
  const batch = rows.slice(offset, offset + limit);

  const records = batch.map((row) =>
    createRecord(area, {
      fecha_creacion: row["Created Time"] || "",
      visitor_id: row["Visitor ID"] || "",
      canal: "Chat",
      producto: "Service Desk Plus",
      responsable: row["Attender"] || "",
      pais: row["Country/Region"] || "",
      cliente: row["Email Address"] ? row["Email Address"].split("@")[1] : "",
      idioma: "",
      prioridad: "Normal",
      duracion_chat: row["Chat Duration"] || "",
      duracion_primera_respuesta: row["First Agent First Response Time"] || "",
      tiempo_de_solucion: "",
      rating: ""
    })
  );

  return {
    totalRows,
    records
  };
}

module.exports = { parseCsvBatch };