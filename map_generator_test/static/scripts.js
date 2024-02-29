const placeholderTexts = {
    world: "Example: I attached world_gdp.xlsx, countries are in a column called 'NAME' and GDP per capita for each country is in a column called 'gdp_per_capita'. Color each country by gdp_per_capita per capita, dark red for high, light pink for low, gradations in between. If a country doesn't have a value for gdp_per_capita, color it #eeeeee. White borders with a 0.5px outline.",
    us: "Example: label states with their two-digit postal codes in black capital letters, AL MN NM are filled red, NY OR are fulled blue, the rest of the states are light grey. White borders with a 1px wide outline.",
    other: "Need Uruguay shown in context within South America, fill it with red, make the rest of the countries #FEFAF6. White borders with a 1px wide outline."
};

// When a map choice is clicked, set the selected map type and show the form.
document.querySelectorAll('.map-choice').forEach(choice => {
    choice.addEventListener('click', function() {
        // Remove 'selected' class from all map choices
        document.querySelectorAll('.map-choice').forEach(c => c.classList.remove('selected'));

        // Add 'selected' class to clicked map choice
        this.classList.add('selected');

        const selectedMapType = this.dataset.mapType;
        document.getElementById('mapType').value = selectedMapType;
        document.getElementById('colorSelection').style.display = 'none';
        document.getElementById('mapForm').style.display = 'block';

        // Set the placeholder text based on the selected map type
        document.getElementById('map_request').placeholder = placeholderTexts[selectedMapType];
    });
});


// // When a map choice is clicked, set the selected map type and show the color selection.
// document.querySelectorAll('.map-choice').forEach(choice => {
//     choice.addEventListener('click', function() {
//         // Remove 'selected' class from all map choices
//         document.querySelectorAll('.map-choice').forEach(c => c.classList.remove('selected'));

//         // Add 'selected' class to clicked map choice
//         this.classList.add('selected');

//         const selectedMapType = this.dataset.mapType;
//         document.getElementById('mapType').value = selectedMapType;
//         document.getElementById('colorSelection').style.display = 'block';

//         // Set the placeholder text based on the selected map type
//         document.getElementById('map_request').placeholder = placeholderTexts[selectedMapType];
//     });
// });

// // When a color button is clicked, set the selected color and show the form.
// document.querySelectorAll('.color-button').forEach(button => {
//     button.addEventListener('click', function() {
//         const selectedColor = this.dataset.color;
//         document.getElementById('selectedColor').value = selectedColor;
//         document.getElementById('mapForm').style.display = 'block';
//     });
// });

// Show the loading message when the form is submitted.
document.getElementById('mapForm').onsubmit = function() {
    document.getElementById('loadingMessage').style.display = 'block';
};
