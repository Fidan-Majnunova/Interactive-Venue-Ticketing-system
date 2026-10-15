const priceCategories = [
    {price: 10, cssClass: "price-10"},   //price-color combinations
    {price: 15, cssClass: "price-15"},
    {price: 20, cssClass: "price-20"},
    {price: 25, cssClass: "price-25"}
];
//parter
const sections = [
    {
        id:"parter",
        name:"Parter",
        price: 25,
        rows: 7,
        blocks: [
            {name:"left", seatsPerRow: 5},
            {name:"right", seatsPerRow: 5},
            {name:"center", seatsPerRow: 11}
        ]

    },
    {
        id:"box",
        name:"Central Box",  
        price: 20,
        rows: 4,
        blocks: [
            {name:"left",seatsPerRow: 6},
            {name: "center",seatsPerRow: 11},
            {name:"right",seatsPerRow: 6},
        ]
    },
    {
        id:"lower-circle",
        name:"Lower Circle",
        price: 15,
        rows: 3,
        blocks: [
            {name:"left",seatsPerRow: 5},
            {name: "center",seatsPerRow: 11},
            {name:"right",seatsPerRow: 5}
            
        ]
    },
    {
        id:"upper-circle",
        name:"Upper Circle",
        price: 10,
        rows: 3,
        blocks: [
            {name:"left",seatsPerRow: 8},
            {name: "center",seatsPerRow: 9},
            {name:"right",seatsPerRow: 8}
        ]
    }
];
const unavailableSeats = [
  "stalls-1-5", "stalls-1-6", "stalls-1-7",
  "stalls-2-9", "stalls-2-10",
  "stalls-3-14", "stalls-3-15",
  "stalls-4-3", "stalls-4-4",
  "stalls-5-18", "stalls-5-19",
  "stalls-6-8", "stalls-6-9",
  "stalls-7-12", "stalls-7-13",
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