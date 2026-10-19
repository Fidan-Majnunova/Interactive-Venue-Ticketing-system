const SEAT_SIZE = 22;                 
const SEAT_GAP = 6;                   
const STEP = SEAT_SIZE + SEAT_GAP;    
const AISLE = 40;                     
const SECTION_GAP = 40;               
const TOP_MARGIN = 20;                
const STAGE_HEIGHT = 40;              
const MAP_WIDTH = 900;                

const mapElement = document.getElementById("map");
const legendElement = document.getElementById("legend");
const seatInfoElement = document.getElementById("seat-info");
const addButton = document.getElementById("add-to-cart");

function getPriceClass(price) {
  for (const category of priceCategories) {
    if (category.price === price) {
      return category.cssClass;
    }
  }
  console.error("No price category found for price: " + price);
  return "";
}

function buildLegend() {
  priceCategories.forEach(function (category) {
    const item = document.createElement("span");
    item.className = "legend-item";

    const dot = document.createElement("span");
    dot.className = "legend-dot " + category.cssClass;

    item.appendChild(dot);
    item.append(category.price + " ₼");
    legendElement.appendChild(item);
  });
}

function createSeat(section, row, seatNumber, x, y) {
  const id = section.id + "-" + row + "-" + seatNumber;

  const seat = document.createElement("button");
  seat.type = "button";
  seat.className = "seat " + getPriceClass(section.price);
  seat.textContent = seatNumber;
  seat.dataset.id = id;
  seat.dataset.section = section.id;
  seat.dataset.row = row;
  seat.dataset.number = seatNumber;
  seat.style.left = x + "px";
  seat.style.top = y + "px";

  if (unavailableSeats.includes(id)) {
    seat.classList.add("unavailable");
  }

  mapElement.appendChild(seat);
}

// ===== Stage (at the bottom) =====
function buildStage(top) {
  const stage = document.createElement("div");
  stage.className = "stage";
  stage.textContent = "STAGE";
  stage.style.top = top + "px";
  mapElement.appendChild(stage);
}

function buildVenue() {
  let y = TOP_MARGIN;

  // The last section in data.js is the farthest from the stage,
  // so I draw sections from the end of the list to the start.
  for (let s = sections.length - 1; s >= 0; s--) {
    const section = sections[s];

    // width of one row in this section
    let totalSeats = 0;
    section.blocks.forEach(function (block) {
      totalSeats += block.seatsPerRow;
    });
    const rowWidth = totalSeats * STEP - SEAT_GAP + (section.blocks.length - 1) * AISLE;
    const startX = (MAP_WIDTH - rowWidth) / 2;

    const label = document.createElement("div");
    label.className = "section-label";
    label.textContent = section.name + " · " + section.price + " ₼";
    label.style.top = y + "px";
    mapElement.appendChild(label);
    y += 24;

    // Row 1 is the closest to the stage (bottom),
    // so I draw the highest row number first (top).
    for (let row = section.rows; row >= 1; row--) {
      let x = startX;
      let seatNumber = 1;

      section.blocks.forEach(function (block) {
        for (let i = 0; i < block.seatsPerRow; i++) {
          createSeat(section, row, seatNumber, x, y);
          x += STEP;
          seatNumber++;
        }
        x += AISLE;
      });

      y += STEP;
    }

    y += SECTION_GAP;
  }

  // stage goes under the last section
  buildStage(y);

  // map height fits the content
  mapElement.style.height = (y + STAGE_HEIGHT + 20) + "px";
}
let inspectedSeat = null;   // the seat that is being inspected now

addButton.disabled = true;  // nothing to add yet

function clearInspected() {
  if (inspectedSeat) {
    inspectedSeat.classList.remove("inspected");
    inspectedSeat = null;
  }
}

function showSeatInfo(seat) {
  const section = sections.find(function (s) {
    return s.id === seat.dataset.section;
  });
  const isUnavailable = seat.classList.contains("unavailable");
  const status = isUnavailable ? "Unavailable" : "Inspected";

  seatInfoElement.innerHTML = `
    <p>Section: <strong>${section.name}</strong></p>
    <p>Row: <strong>${seat.dataset.row}</strong></p>
    <p>Seat: <strong>${seat.dataset.number}</strong></p>
    <p>Price: <strong>${section.price} ₼</strong></p>
    <p>Status: <strong>${status}</strong></p>
  `;
}

mapElement.addEventListener("click", function (event) {
  const seat = event.target.closest(".seat");
  if (!seat) {
    return;   // the click was not on a seat
  }

  clearInspected();

  if (seat.classList.contains("unavailable")) {
    addButton.disabled = true;
  } else {
    seat.classList.add("inspected");
    inspectedSeat = seat;
    addButton.disabled = false;
  }

  showSeatInfo(seat);
});

buildLegend();
buildVenue();