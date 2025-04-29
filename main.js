let data = [];
//  테이블 렌더링
function renderTable() {
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = item.id;
    row.appendChild(idCell);

    // 값 (input)
    const valueCell = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number";
    input.value = item.value;
    input.dataset.id = item.id;
    valueCell.appendChild(input);
    row.appendChild(valueCell);

    // 삭제버튼
    const actionCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "삭제";
    deleteBtn.dataset.id = item.id;
    deleteBtn.onclick = handleDelete;
    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

//  삭제
function handleDelete(e) {
  const id = parseInt(e.target.dataset.id);
  data = data.filter((item) => item.id !== id);
  renderAll();
}

// 값추가 Add 버튼
function handleAdd() {
  const idInput = document.getElementById("id");
  const valueInput = document.getElementById("newValueInput");

  const newId = parseInt(idInput.value);
  const newValue = parseInt(valueInput.value);

  // ID, 값 숫자 유효성 검사
  if (isNaN(newId) || isNaN(newValue)) {
    alert("ID와 값은 숫자여야 합니다.");
    return;
  }

  // 동일 id 여부 체크
  if (data.some((item) => item.id === newId)) {
    alert("이미 추가된 ID입니다. 다른 ID를 입력하세요.");
    return;
  }

  data.push({ id: newId, value: newValue });

  // input창 초기화
  idInput.value = "";
  valueInput.value = "";

  renderAll();
}

// 고급 편집 값편집
function handleApplyTable() {
  const inputs = document.querySelectorAll("#dataTable input");
  inputs.forEach((input) => {
    const id = parseInt(input.dataset.id);
    const value = parseInt(input.value);
    const item = data.find((d) => d.id === id);
    if (item && !isNaN(value)) {
      item.value = value;
    }
  });
  renderAll();
}

// 고급편집 APPLY버튼
function handleApplyEditor() {
  const textarea = document.getElementById("jsonEditor");
  try {
    const parsed = JSON.parse(textarea.value);
    if (Array.isArray(parsed)) {
      data = parsed.map((item) => ({
        id: Number(item.id),
        value: Number(item.value),
      }));
      renderAll();
    } else {
      alert("배열 형태로 입력해주세요.");
    }
  } catch (e) {
    alert(
      '형식이 올바르지 않습니다.\n예시: [{ "id": 1, "value": 100 }, { "id": 2, "value": -50 }]'
    );
  }
}

// 그래프 그리기
function updateGraph() {
  const canvas = document.getElementById("graphCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 50;
  const barWidth = 20;
  const gap = 30;

  if (data.length === 0) return;

  const values = data.map((d) => d.value);
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(0, ...values);
  const valueRange = maxValue - minValue || 1;
  const graphHeight = canvas.height - padding * 2;

  const zeroY =
    canvas.height - padding - ((0 - minValue) / valueRange) * graphHeight;

  // 축
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.moveTo(padding, zeroY);
  ctx.lineTo(canvas.width - padding, zeroY);
  ctx.stroke();

  // Y축 텍스트
  ctx.fillStyle = "black";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(maxValue.toString(), padding - 10, padding);
  ctx.fillText("0", padding - 10, zeroY);
  ctx.fillText(minValue.toString(), padding - 10, canvas.height - padding);

  // 막대
  data.forEach((item, i) => {
    const x = padding + (barWidth + gap) * i + gap;
    const barHeight = (Math.abs(item.value) / valueRange) * graphHeight;

    ctx.fillStyle = "#a8a8a8";
    const y = item.value >= 0 ? zeroY - barHeight : zeroY;
    ctx.fillRect(x, y, barWidth, barHeight);

    // X축 ID
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(item.id, x + barWidth / 2, canvas.height - padding + 5);
  });
}
// 값 고급 편집
function updateJsonEditor() {
  document.getElementById("jsonEditor").value = JSON.stringify(data, null, 2);
}

function renderAll() {
  renderTable();
  updateGraph();
  updateJsonEditor();
}

// ✅ 초기화
window.addEventListener("DOMContentLoaded", () => {
  renderAll();

  document.getElementById("addValueBtn").onclick = handleAdd;
  document.getElementById("applyTableBtn").onclick = handleApplyTable;
  document.getElementById("applyEditorBtn").onclick = handleApplyEditor;
});
