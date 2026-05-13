export function setupSum() {
  document.getElementById("sumBtn").addEventListener("click", calculateSum);
}

async function calculateSum() {
  const num1 = document.getElementById("num1").value;
  const num2 = document.getElementById("num2").value;

  const response = await fetch("/server/project_rainfall_function/sum", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      a: Number(num1),
      b: Number(num2)
    })
  });

  if (!response.ok) {
    const error = await response.text();
    document.getElementById("result").innerText = error;
    return;
  }

  const data = await response.json();

  document.getElementById("result").innerText =
    `Result: ${data.result}`;
}