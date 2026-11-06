// Map controls: zoom, move and reset
const mapViewport = document.getElementById("map-viewport");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;    
const WHEEL_STEP = 0.05; 
const MOVE_STEP = 80;

let zoom = 1;    //current zoom
let moveX = 0;   //how far the map is moved horizontally
let moveY = 0;   //how far the map is moved vertically

function updateMap() {
  const viewWidth = mapViewport.clientWidth;
  const viewHeight = mapViewport.clientHeight;
  const mapWidth = MAP_WIDTH * zoom;
  const mapHeight = mapElement.offsetHeight * zoom;

  if (mapWidth <= viewWidth) {
    moveX = (viewWidth - mapWidth) / 2;
  } else {
    moveX = Math.min(0, Math.max(viewWidth - mapWidth, moveX));
  }

  if (mapHeight <= viewHeight) {
    moveY = (viewHeight - mapHeight) / 2;
  } else {
    moveY = Math.min(0, Math.max(viewHeight - mapHeight, moveY));
  }

  mapElement.style.transform = "translate(" + moveX + "px, " + moveY + "px) scale(" + zoom + ")";

  zoomInBtn.disabled = zoom >= MAX_ZOOM;
  zoomOutBtn.disabled = zoom <= MIN_ZOOM;
}

// pointX and pointY are the place that stays in the same position while zooming
function zoomMap(newZoom, pointX, pointY) {
  // zoom must stay between min and max
  if (newZoom > MAX_ZOOM) {
    newZoom = MAX_ZOOM;
  }
  if (newZoom < MIN_ZOOM) {
    newZoom = MIN_ZOOM;
  }
  newZoom = Math.round(newZoom * 100) / 100;

  // buttons don't give a point, so I use the center of the box
  if (pointX === undefined) {
    pointX = mapViewport.clientWidth / 2;
    pointY = mapViewport.clientHeight / 2;
  }

  const change = newZoom / zoom;
  moveX = pointX - (pointX - moveX) * change;
  moveY = pointY - (pointY - moveY) * change;
  zoom = newZoom;

  updateMap();
}

function moveMap(dx, dy) {
  moveX += dx;
  moveY += dy;
  updateMap();
}

function resetMap() {
  //I want the whole map to fit in the box, so I check the box width first
  let fitZoom = mapViewport.clientWidth / MAP_WIDTH;

  if (fitZoom > 1) {    //on big screens the map should not be bigger than normal
    fitZoom = 1;
  }

  if (fitZoom < MIN_ZOOM) {
    fitZoom = MIN_ZOOM;
  }
  zoom = Math.round(fitZoom * 100) / 100;
  moveX = (mapViewport.clientWidth - MAP_WIDTH * zoom) / 2;  //map stays in the middle
  moveY = 0;
  updateMap();
}

// buttons
zoomInBtn.addEventListener("click", function () {
  zoomMap(zoom + ZOOM_STEP);
});
zoomOutBtn.addEventListener("click", function () {
  zoomMap(zoom - ZOOM_STEP);
});
document.getElementById("move-up").addEventListener("click", function () {
  moveMap(0, MOVE_STEP);
});
document.getElementById("move-down").addEventListener("click", function () {
  moveMap(0, -MOVE_STEP);
});
document.getElementById("move-left").addEventListener("click", function () {
  moveMap(MOVE_STEP, 0);
});
document.getElementById("move-right").addEventListener("click", function () {
  moveMap(-MOVE_STEP, 0);
});
document.getElementById("reset-view").addEventListener("click", resetMap);

//Bonus
mapViewport.addEventListener("wheel", function (event) {
  event.preventDefault(); 

  const box = mapViewport.getBoundingClientRect();
  const mouseX = event.clientX - box.left;
  const mouseY = event.clientY - box.top;

  if (event.deltaY < 0) {
    zoomMap(zoom + WHEEL_STEP, mouseX, mouseY);   
  } else {
    zoomMap(zoom - WHEEL_STEP, mouseX, mouseY);   
  }
}, { passive: false });

let dragging = false;   //true when the mouse button is pressed on the map
let moved = false;      //true when the mouse really moved (not just a click)
let startMouseX = 0;
let startMouseY = 0;
let startMoveX = 0;
let startMoveY = 0;

mapViewport.addEventListener("mousedown", function (event) {
  if (event.button !== 0) {   //only the left button
    return;
  }
  dragging = true;
  moved = false;
  startMouseX = event.clientX;
  startMouseY = event.clientY;
  startMoveX = moveX;
  startMoveY = moveY;
});

window.addEventListener("mousemove", function (event) {
  if (!dragging) {
    return;
  }

  const dx = event.clientX - startMouseX;
  const dy = event.clientY - startMouseY;

  // moving less than 5px is still a click, so I don't start dragging
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    moved = true;
  }
  if (moved) {
    mapViewport.classList.add("dragging");
    moveX = startMoveX + dx;
    moveY = startMoveY + dy;
    updateMap();
  }
});

window.addEventListener("mouseup", function () {
  dragging = false;
  mapViewport.classList.remove("dragging");
});

//after dragging the browser also sends a click, I stop it
//so a seat is not selected by mistake
mapViewport.addEventListener("click", function (event) {
  if (moved) {
    event.stopPropagation();
    moved = false;
  }
}, true);

window.addEventListener("resize", updateMap);  //when the window size changes, I check the map again
resetMap();