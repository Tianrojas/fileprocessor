const catalyst = require('zcatalyst-sdk-node');

const TABLE_ID = process.env.DATASTORE_TABLE_ID;

async function insertBatch(req, rows) {
  const catalystApp = catalyst.initialize(req);
  const table = catalystApp.datastore().table(TABLE_ID);

  if (typeof table.insertRows === 'function') {
    return await table.insertRows(rows);
  }

  const inserted = [];
  for (const row of rows) {
    const result = await table.insertRow(row);
    inserted.push(result);
  }

  return inserted;
}

async function getAllRecords(req) {
  const catalystApp = catalyst.initialize(req);
  const table = catalystApp.datastore().table(TABLE_ID);

  let hasNext = true;
  let nextToken = undefined;
  const allRows = [];

  while (hasNext) {
    const response = await table.getPagedRows({
      nextToken,
      maxRows: 200
    });

    const data = response.data || [];
    const token = response.next_token;
    const more = response.more_records;

    allRows.push(...data);

    nextToken = token;
    hasNext = more;
  }

  return allRows;
}

async function deleteAllRecords(req) {
  const catalystApp = catalyst.initialize(req);
  const table = catalystApp.datastore().table(TABLE_ID);

  const allRows = await getAllRecords(req);
  const rowIds = allRows
    .map(row => row.ROWID)
    .filter(Boolean);

  if (rowIds.length === 0) {
    return {
      total_found: 0,
      total_deleted: 0
    };
  }

  let totalDeleted = 0;

  for (let i = 0; i < rowIds.length; i += 200) {
    const chunk = rowIds.slice(i, i + 200);
    await table.deleteRows(chunk);
    totalDeleted += chunk.length;
  }

  return {
    total_found: rowIds.length,
    total_deleted: totalDeleted
  };
}

module.exports = {
  insertBatch,
  getAllRecords,
  deleteAllRecords
};