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