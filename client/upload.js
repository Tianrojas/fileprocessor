export function setupUpload() {
  document.getElementById("uploadBtn").addEventListener("click", uploadFile);
  document.getElementById("uploadBtn1").addEventListener("click", fun1);
  document.getElementById("uploadBtn2").addEventListener("click", fun2);
}

async function uploadFile() {
  const file = document.getElementById("fileInput").files[0];

  if (!file) {
    alert("Select a file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/server/project_rainfall_function/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  console.log("Upload response:", data);
}

async function fun1() {
  const res = await fetch("/server/project_rainfall_function/fun1");
  const data = await res.json();

  console.log("File info:", data);
}

async function fun2() {
  const res = await fetch("/server/project_rainfall_function/fun2");
  const data = await res.json();

  console.log("Columns:", data);
}