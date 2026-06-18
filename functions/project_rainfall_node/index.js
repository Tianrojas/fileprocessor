'use strict';

require('dotenv').config();

const express = require('express');
const multer = require('multer');

const { uploadToFileStore, downloadFromFileStore } = require('./services/filestore');
const { parseCsvBatch } = require('./services/csvParser');
const { insertBatch, getAllRecords, deleteAllRecords } = require('./services/datastore');

const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received' });
    }

    const fileId = await uploadToFileStore(req, req.file);

    return res.status(200).json({
      status: 'stored',
      file_id: fileId,
      file_name: req.file.originalname
    });
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    return res.status(500).json({
      error: err.message || String(err)
    });
  }
});

app.post('/process-batch', async (req, res) => {
  try {
    const {
      file_id,
      file_type,
      area = "ITSM",
      offset = 0,
      limit = 5
    } = req.body;

    if (!file_id || !file_type) {
      return res.status(400).json({ error: 'file_id and file_type are required' });
    }

    if (file_type !== 'csv') {
      return res.status(400).json({ error: 'Only CSV is supported in this first version' });
    }

    const numericOffset = Number(offset);
    const numericLimit = Number(limit);

    const filePath = await downloadFromFileStore(req, file_id);

    const { totalRows, records } = parseCsvBatch(
      filePath,
      area,
      numericOffset,
      numericLimit
    );

    await insertBatch(req, records);

    const nextOffset = numericOffset + records.length;
    const hasMore = nextOffset < totalRows;

    return res.status(200).json({
      status: 'processed',
      inserted_count: records.length,
      total_rows: totalRows,
      current_offset: numericOffset,
      next_offset: nextOffset,
      has_more: hasMore,
      preview: records
    });

  } catch (err) {
    console.error('PROCESS BATCH ERROR:', err);
    return res.status(500).json({
      error: err.message || String(err)
    });
  }
});

app.get('/records', async (req, res) => {
  try {
    const rows = await getAllRecords(req);

    const mapped = rows.map(row => ({
      ROWID: row.ROWID || "",
      FECHA_DE_CREACION: row.FECHA_DE_CREACION || "",
      VISITOR_ID: row.VISITOR_ID || "",
      CANAL: row.CANAL || "",
      GRUPO: row.GRUPO || "",
      PRODUCTO: row.PRODUCTO || "",
      RESPONSABLE: row.RESPONSABLE || "",
      PAIS: row.PAIS || "",
      CLIENTE: row.CLIENTE || "",
      IDIOMA: row.IDIOMA || "",
      PRIORIDAD: row.PRIORIDAD || "",
      DURACION_CHAT: row.DURACION_CHAT || "",
      DURACION_PRIMERA_RESPUESTA: row.DURACION_PRIMERA_RESPUESTA || "",
      TIEMPO_DE_SOLUCION: row.TIEMPO_DE_SOLUCION || "",
      RATING: row.RATING || "",
      CREATEDTIME: row.CREATEDTIME || "",
      MODIFIEDTIME: row.MODIFIEDTIME || ""
    }));

    return res.status(200).json({
      status: 'ok',
      count: mapped.length,
      records: mapped
    });

  } catch (err) {
    console.error('GET RECORDS ERROR:', err);
    return res.status(500).json({
      error: err.message || String(err)
    });
  }
});

app.delete('/records', async (req, res) => {
  try {
    const result = await deleteAllRecords(req);

    return res.status(200).json({
      status: 'ok',
      ...result
    });

  } catch (err) {
    console.error('DELETE RECORDS ERROR:', err);
    return res.status(500).json({
      error: err.message || String(err)
    });
  }
});

module.exports = app;