// Map controls: zoom, move and reset
const mapViewport = document.getElementById("map-viewport");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;
const MOVE_STEP = 80;

let zoom = 1;    // current zoom
let moveX = 0;   // how far the map is moved horizontally
let moveY = 0;   // how far the map is moved vertically

// with the function below I put the map in the right place and checks the limits
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
function zoomMap(newZoom) {
  newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));  // zoom must stay between min and max
  newZoom = Math.round(newZoom * 100) / 100;

  const centerX = mapViewport.clientWidth / 2;
  const centerY = mapViewport.clientHeight / 2;
  // above, I wrote the zoom from the center of the box, not from the corner
  const change = newZoom / zoom;
  moveX = centerX - (centerX - moveX) * change;
  moveY = centerY - (centerY - moveY) * change;
  zoom = newZoom;

  updateMap();
}

function moveMap(dx, dy) {
  moveX += dx;
  moveY += dy;
  updateMap();
}

function resetMap() {
  // I want the whole map to fit in the box, so I check the box width first
  let fitZoom = mapViewport.clientWidth / MAP_WIDTH;

  // on big screens the map should not be bigger than normal
  if (fitZoom > 1) {
    fitZoom = 1;
  }
  // on very small screens the map should not be smaller than the minimum
  if (fitZoom < MIN_ZOOM) {
    fitZoom = MIN_ZOOM;
  }

  zoom = Math.round(fitZoom * 100) / 100;
  moveX = (mapViewport.clientWidth - MAP_WIDTH * zoom) / 2;  // map stays in the middle
  moveY = 0;
  updateMap();
}
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

window.addEventListener("resize", updateMap);  // when the window size changes, I check the map again
resetMap(); 