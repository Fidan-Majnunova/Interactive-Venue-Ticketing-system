const priceCategories = [
  {price: 10, cssClass: "price-10"},
  {price: 15, cssClass: "price-15"},
  {price: 20, cssClass: "price-20"},
  {price: 25, cssClass: "price-25"}
];

//Sections
const sections = [
  {
    id: "parter",
    name: "Parter",
    price: 25,
    rows: 7,
    blocks: [
      {name: "left", seatsPerRow: 5},
      {name: "center", seatsPerRow: 11},
      {name: "right", seatsPerRow: 5}
    ]
  },
  {
    id: "box",
    name: "Central Box",
    price: 20,
    rows: 4,
    blocks: [
      {name: "left", seatsPerRow: 6},
      {name: "center", seatsPerRow: 11},
      {name: "right", seatsPerRow: 6}
    ]
  },
  {
    id: "lower-circle",
    name: "Lower Circle",
    price: 15,
    rows: 3,
    blocks: [
      {name: "left", seatsPerRow: 5},
      {name: "center", seatsPerRow: 11},
      {name: "right", seatsPerRow: 5}
    ]
  },
  {
    id: "upper-circle",
    name: "Upper Circle",
    price: 10,
    rows: 3,
    blocks: [
      {name: "left", seatsPerRow: 8},
      {name: "center", seatsPerRow: 9},
      {name: "right", seatsPerRow: 8}
    ]
  }
];

//Unavailable seats 
//Seat id = section id - row - seat number  //I identified some seats as unavailable randomly.
const unavailableSeats = [
  "parter-1-5", "parter-1-6", "parter-1-7",
  "parter-2-9", "parter-2-10",
  "parter-3-14", "parter-3-15",
  "parter-4-3", "parter-4-4",
  "parter-5-18", "parter-5-19",
  "parter-6-8", "parter-6-9",
  "parter-7-12", "parter-7-13",
  "box-1-8", "box-1-9",
  "box-2-15",
  "box-3-4",
  "box-4-20",
  "lower-circle-1-6",
  "lower-circle-2-10",
  "lower-circle-3-15",
  "upper-circle-1-3",
  "upper-circle-2-12",
  "upper-circle-3-18"
];