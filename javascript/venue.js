const SEAT_SIZE = 22;
const SEAT_GAP = 6;
const STEP = SEAT_SIZE + SEAT_GAP;
const AISLE = 40;
const SECTION_GAP = 40;
const TOP_MARGIN = 20;
const STAGE_HEIGHT = 40;
const MAP_WIDTH = 900;

const STORAGE_KEY = "venueCart";

const mapElement = document.getElementById("map");
const legendElement = document.getElementById("legend");
const seatInfoElement = document.getElementById("seat-info");
const addButton = document.getElementById("add-to-cart");
const cartItemsElement = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");

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

//Stage (at the bottom) in teatr ticket ordering, the stage is usually at the bottom.
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

  mapElement.style.height = (y + STAGE_HEIGHT + 20) + "px";
}

let inspectedSeat = null;   
let shownSeat = null;     
addButton.disabled = true;  // nothing to add yet

let cart = [];   // cart { id, sectionName, row, number, price }

function createTicket(seat) {
  const section = sections.find(function (s) {
    return s.id === seat.dataset.section;
  });

  return {
    id: seat.dataset.id,
    sectionName: section.name,
    row: seat.dataset.row,
    number: seat.dataset.number,
    price: section.price
  };
}

function renderCart() {
  cartItemsElement.innerHTML = "";
  let total = 0;

  cart.forEach(function (ticket) {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = ticket.sectionName + ", row " + ticket.row + ", seat " + ticket.number;

    const right = document.createElement("span");
    right.className = "cart-right";

    const price = document.createElement("span");
    price.textContent = ticket.price + " ₼";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-btn";
    removeButton.textContent = "✕";
    removeButton.title = "Remove ticket";
    removeButton.setAttribute("aria-label", "Remove " + name.textContent);
    removeButton.dataset.id = ticket.id;

    right.appendChild(price);
    right.appendChild(removeButton);
    li.appendChild(name);
    li.appendChild(right);
    cartItemsElement.appendChild(li);

    total += ticket.price;
  });
  if (cart.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-cart";
    empty.textContent = "Your cart is empty";
    cartItemsElement.appendChild(empty);
  }
  cartTotalElement.textContent = total + " ₼";
}

function saveCart() { //I am saving the cart in localStorage (only seat ids are saved)
  const ids = cart.map(function(ticket) {
    return ticket.id;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error("Could not save the cart", error);
  }
}

function loadCart() {
  let ids = [];

  try {
    ids = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    ids = [];
  }

  if (!Array.isArray(ids)) {
    ids = [];
  }

  ids.forEach(function (id) {
    const seat = mapElement.querySelector('.seat[data-id="' + id + '"]');
    const alreadyInCart = cart.some(function (ticket) {
      return ticket.id === id;
    });

    // skipping seats that do not exist, or unavailable or are repeated
    if (!seat || seat.classList.contains("unavailable") || alreadyInCart) {
      return;
    }

    cart.push(createTicket(seat));
    seat.classList.add("in-cart");
  });

  saveCart();
  renderCart();
}

function addToCart(seat) {
  const id = seat.dataset.id;

  const alreadyInCart = cart.some(function (ticket) {
    return ticket.id === id;
  });

  if (alreadyInCart || seat.classList.contains("unavailable")) {
    return;   // adding the same seat twice or adding unavailable seats not allowed,
    //therefore I wrote the conditional statement with OR.
  }

  cart.push(createTicket(seat));

  seat.classList.remove("inspected");
  seat.classList.add("in-cart");
  inspectedSeat = null;
  addButton.disabled = true;

  showSeatInfo(seat);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(function (ticket) {
    return ticket.id !== id;
  });

  const seat = mapElement.querySelector('.seat[data-id="' + id + '"]');
  if (seat) {
    seat.classList.remove("in-cart");

    if (shownSeat === seat) {
      seatInfoElement.innerHTML = "<p>Select a seat on the map</p>";
      shownSeat = null;
    }
  }

  saveCart();
  renderCart();
}

cartItemsElement.addEventListener("click", function (event) {
  const button = event.target.closest(".remove-btn");
  if (button) {
    removeFromCart(button.dataset.id);
  }
});


function clearInspected() {
  if (inspectedSeat) {
    inspectedSeat.classList.remove("inspected");
    inspectedSeat = null;
  }
}

function showSeatInfo(seat) {
  shownSeat = seat;
  const section = sections.find(function (s) {
    return s.id === seat.dataset.section;
  });

  let status = "Inspected";
  if (seat.classList.contains("unavailable")) {
    status = "Unavailable";
  } else if (seat.classList.contains("in-cart")) {
    status = "In cart";
  }

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
  if (!seat) { // the click was not on a seat
    return;
  }

  clearInspected();

  if (seat.classList.contains("unavailable") || seat.classList.contains("in-cart")) {
    addButton.disabled = true;
  } else {
    seat.classList.add("inspected");
    inspectedSeat = seat;
    addButton.disabled = false;
  }

  showSeatInfo(seat);
});

addButton.addEventListener("click", function () {
  if (inspectedSeat) {
    addToCart(inspectedSeat);
  }
});

buildLegend();
buildVenue();
loadCart();   // must run after buildVenue, the seats have to exist first