export function setupUpload() {
  document.getElementById("uploadBtn").addEventListener("click", uploadFile);
  document.getElementById("processAllBtn").addEventListener("click", processAllBatches);
  document.getElementById("viewRecordsBtn").addEventListener("click", loadAllRecords);
  document.getElementById("deleteRecordsBtn").addEventListener("click", deleteAllRecords);
}

let fileId = null;
let fileType = null;
let uploadedFileName = null;

async function uploadFile() {
  const file = document.getElementById("fileInput").files[0];

  if (!file) {
    alert("Select a file");
    return;
  }

  fileType = file.name.toLowerCase().endsWith(".csv") ? "csv" : "pdf";
  uploadedFileName = file.name;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/server/project_rainfall_node/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    console.log("Upload response:", data);

    if (!res.ok || !data.file_id) {
      alert("Upload failed");
      return;
    }

    fileId = data.file_id;
    setStatus(`Uploaded correctly: ${uploadedFileName} (file_id=${fileId})`);
    alert(`Uploaded correctly. file_id = ${fileId}`);
  } catch (err) {
    console.error(err);
    alert("Upload error");
  }
}

async function processAllBatches() {
  if (!fileId) {
    alert("Upload a file first");
    return;
  }

  if (fileType !== "csv") {
    alert("This first version only supports CSV for batch processing");
    return;
  }

  const processBtn = document.getElementById("processAllBtn");
  processBtn.disabled = true;

  let offset = 0;
  const limit = 5;
  let totalInserted = 0;
  let totalRows = null;
  let lastPreview = [];

  try {
    while (true) {
      setStatus(`Processing batch starting at offset ${offset}...`);

      const res = await fetch("/server/project_rainfall_node/process-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          file_id: fileId,
          file_type: fileType,
          area: "ITSM",
          offset,
          limit
        })
      });

      const data = await res.json();
      console.log("Batch result:", data);

      if (!res.ok) {
        throw new Error(data.error || "Batch processing failed");
      }

      totalInserted += data.inserted_count;
      totalRows = data.total_rows;
      offset = data.next_offset;
      lastPreview = data.preview || [];

      renderTable(lastPreview);

      setStatus(`Processed ${totalInserted} of ${totalRows} records...`);

      if (!data.has_more) {
        break;
      }
    }

    setStatus(`Done. Inserted ${totalInserted} of ${totalRows} records.`);
    alert(`Finished processing ${totalInserted} records`);
  } catch (err) {
    console.error(err);
    alert(`Process all batches error: ${err.message}`);
    setStatus(`Error: ${err.message}`);
  } finally {
    processBtn.disabled = false;
  }
}

async function loadAllRecords() {
  try {
    setStatus("Loading all records...");

    const res = await fetch("/server/project_rainfall_node/records");
    const data = await res.json();

    console.log("All records:", data);

    if (!res.ok) {
      throw new Error(data.error || "Failed to load records");
    }

    renderTable(data.records || []);
    setStatus(`Loaded ${data.count} records from staging table.`);
  } catch (err) {
    console.error(err);
    alert(`Load records error: ${err.message}`);
    setStatus(`Error: ${err.message}`);
  }
}

async function deleteAllRecords() {
  const confirmed = confirm("Are you sure you want to delete ALL staging records?");
  if (!confirmed) return;

  try {
    setStatus("Deleting all records...");

    const res = await fetch("/server/project_rainfall_node/records", {
      method: "DELETE"
    });

    const data = await res.json();

    console.log("Delete result:", data);

    if (!res.ok) {
      throw new Error(data.error || "Failed to delete records");
    }

    renderTable([]);
    setStatus(`Deleted ${data.total_deleted} records.`);
    alert(`Deleted ${data.total_deleted} records`);
  } catch (err) {
    console.error(err);
    alert(`Delete records error: ${err.message}`);
    setStatus(`Error: ${err.message}`);
  }
}

function renderTable(rows) {
  const container = document.getElementById("tableContainer");

  container.innerHTML = "";

  if (!rows || rows.length === 0) {
    container.innerText = "No data to display";
    return;
  }

  let table = "<table border='1' style='margin-top:20px;'>";

  table += "<tr>";
  Object.keys(rows[0]).forEach(key => {
    table += `<th>${key}</th>`;
  });
  table += "</tr>";

  rows.forEach(row => {
    table += "<tr>";
    Object.values(row).forEach(value => {
      table += `<td>${value ?? ""}</td>`;
    });
    table += "</tr>";
  });

  table += "</table>";

  container.innerHTML = table;
}

function setStatus(message) {
  const box = document.getElementById("statusBox");
  box.innerText = message;
}