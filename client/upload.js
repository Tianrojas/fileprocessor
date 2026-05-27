export function setupUpload() {
  const btn = document.getElementById("uploadBtn");
  btn.addEventListener("click", uploadFile);
}

async function uploadFile() {
  const file = document.getElementById("fileInput").files[0];

  if (!file) {
    alert("Please select a file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/server/project_rainfall_function/upload", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const error = await res.json();
      console.error(error);
      alert("Upload failed");
      return;
    }

    const data = await res.json();

    console.log("Processed:", data);

    const responseData = data.data;
    console.log("Preview:", responseData);
    renderTable(responseData.preview);
  } catch (err) {
    console.error(err);
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
      table += `<td>${value}</td>`;
    });
    table += "</tr>";
  });

  table += "</table>";

  container.innerHTML = table;
}