const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

// Set canvas size to full screen
canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.75;

let drawing = false;
let currentTool = "marker";
let currentColor = "#000000";
let brushSize = 3;

const colorMap = {
  marker: "#000000",
  red: "red",
  green: "green",
  blue: "blue",
  yellow: "yellow",
  eraser: "#ffffff"
};

function setTool(tool) {
  currentTool = tool;
  currentColor = colorMap[tool];

  brushSize = (tool === "marker") ? 4 : (tool === "eraser") ? 10 : 2;
}

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseout", stopDraw);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchend", stopDraw);
canvas.addEventListener("touchmove", draw);

function getPos(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX - canvas.offsetLeft,
      y: e.touches[0].clientY - canvas.offsetTop
    };
  } else {
    return {
      x: e.clientX - canvas.offsetLeft,
      y: e.clientY - canvas.offsetTop
    };
  }
}

function startDraw(e) {
  drawing = true;
  draw(e); // draw dot
}

function stopDraw() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;

  e.preventDefault();
  const pos = getPos(e);

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = currentColor;

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function exportAsPNG() {
  const link = document.createElement("a");
  link.download = "whiteboard.png";
  link.href = canvas.toDataURL();
  link.click();
}

function exportAsPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const imgData = canvas.toDataURL("image/png");
  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save("whiteboard.pdf");
}
