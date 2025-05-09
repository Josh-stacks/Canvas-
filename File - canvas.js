const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let circles = [];
let selectedCircle = null;
let isDragging = false;
const defaultRadius = 20;
const minRadius = 5;

// Utility function to get random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

// Draw sparkle (particles or shine) inside a circle
function drawSparkle(x, y, radius) {
  const sparkleCount = 10;
  for (let i = 0; i < sparkleCount; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const sparkleX = x + Math.cos(angle) * Math.random() * radius;
    const sparkleY = y + Math.sin(angle) * Math.random() * radius;
    const sparkleSize = Math.random() * 2 + 1;

    ctx.beginPath();
    ctx.arc(sparkleX, sparkleY, sparkleSize, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}

// Draw all circles
function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle === selectedCircle ? 'red' : circle.color;
    ctx.fill();
    drawSparkle(circle.x, circle.y, circle.radius);
  });
}

// Check if point is inside a circle
function isPointInCircle(x, y, circle) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
}

// Add or select circle
canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  let clicked = false;

  for (let i = circles.length - 1; i >= 0; i--) {
    if (isPointInCircle(mouseX, mouseY, circles[i])) {
      selectedCircle = circles[i];
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    circles.push({
      x: mouseX,
      y: mouseY,
      radius: defaultRadius,
      color: getRandomColor()
    });
    selectedCircle = null;
  }

  drawCircles();
});

// Mouse drag to move
canvas.addEventListener('mousedown', function(e) {
  if (!selectedCircle) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (isPointInCircle(mouseX, mouseY, selectedCircle)) {
    isDragging = true;
  }
});

canvas.addEventListener('mousemove', function(e) {
  if (!isDragging || !selectedCircle) return;

  const rect = canvas.getBoundingClientRect();
  selectedCircle.x = e.clientX - rect.left;
  selectedCircle.y = e.clientY - rect.top;

  drawCircles();
});

canvas.addEventListener('mouseup', function() {
  isDragging = false;
});

// Delete key to remove circle
document.addEventListener('keydown', function(e) {
  if (e.key === 'Delete' && selectedCircle) {
    circles = circles.filter(c => c !== selectedCircle);
    selectedCircle = null;
    drawCircles();
  }
});

// Scroll to resize
canvas.addEventListener('wheel', function(e) {
  if (selectedCircle) {
    e.preventDefault();
    selectedCircle.radius += e.deltaY < 0 ? 2 : -2;
    if (selectedCircle.radius < minRadius) selectedCircle.radius = minRadius;
    drawCircles();
  }
});

// Sparkle animation refresh
setInterval(drawCircles, 300); // Redraw every 300ms for dynamic sparkle
