// data must be in a format with age, Florida, and US in each object
var exampleData = [{
    age: "0-9",
    Florida:  2238153,
    US: 38672058
}, {
    age: "10-19",
    Florida: 2536433,
    US: 43645580
}, {
    age: "20-29",
    Florida: 2556820,
    US: 43483096
}, {
    age: "30-39",
    Florida: 2784558,
    US: 45350083
}, {
    age: "40-49",
    Florida: 2683200,
    US: 41144488
}, {
    age: "50-59",
    Florida: 2873162,
    US: 42032544
}, {
    age: "60-69",
    Florida: 2861157,
    US: 40025667
}, {
    age: "70-79",
    Florida: 2142395,
    US: 25299187
}, {
    age: "80+",
    Florida: 1105250,
    US: 12241042
}];
var options = {
    height: 400,
    width: 400,
    style: {
        leftBarColor: "#6abfcb",
        rightBarColor: "#e78c88"
    }
}
pyramidBuilder(exampleData, '#pyramid', options);