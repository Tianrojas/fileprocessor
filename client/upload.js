export function setupUpload() {
  document.getElementById("uploadBtn").addEventListener("click", uploadFile);
  document.getElementById("uploadBtn1").addEventListener("click", fun1);
  document.getElementById("uploadBtn2").addEventListener("click", fun2);
}

let fileId = null;


async function uploadFile() {
  const file = document.getElementById("fileInput").files[0];

  if (!file) {
    alert("Select a file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/server/project_rainfall_node/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    console.log("Upload response (Node):", data);

    if (!res.ok || !data.file_id) {
      alert("Upload failed");
      return;
    }

    fileId = data.file_id;
    alert(`Uploaded correctly. file_id = ${fileId}`);
  } catch (err) {
    console.error(err);
    alert("Upload error");
  }
}

async function fun1() {
  const res = await fetch(
    `/server/project_rainfall_function/fun1?file_id=${fileId}`
  );

  const data = await res.json();

  console.log("File info:", data);
}

async function fun2() {
  const res = await fetch(
    `/server/project_rainfall_function/fun2?file_id=${fileId}`
  );

  const data = await res.json();

  console.log("Columns:", data);
}