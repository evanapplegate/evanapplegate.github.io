const OpenAI = require('openai').default;
const fs = require('fs').promises;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for API key
});

async function generateMapCode(inputString) {
  const prompt = `${inputString} Use d3-geo and d3-geo-projection to write a script to create the map that was just described; create the map using US_states.geojson, which is located in the local dir. If the map request included postal code-labels, they're stored under the field 'postal' in the geojson. The script you return should use d3, d3-geo, d3-geo-projection, and jsdom to create a virtual DOM environment for generating the SVG, since this will be run in a Node.js environment without access to a browser's DOM. The SVG should be saved to a file named 'your_map.svg'. Please return a complete Node.js script, ready to execute, that includes importing necessary modules, setting up the virtual DOM, defining the SVG dimensions, setting up the map projection, coloring the states based on the conditions, labeling the states, and writing the SVG to a file. If you use XMLSerializer to serialize the SVG DOM element to a string, be sure to define it at the start of the script. Remember that d3.json doesn't work directly in node.js; read the GeoJSON  using Node.js's fs module. Return with a MAXIMALLY concise response; your response should be the JS code alone, zero intro or outro. Return nothing but the requested code! DO NOT include ticks surrounding the code, your response should start with const and end with a semicolon.`;

  try {
    // Adjusting to the new completions syntax
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{
        role: "user", // Assuming the 'user' role for the input message
        content: prompt
      }],
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('No choices found in the API response');
    }

    return completion.choices[0].message.content; // Adjusted according to the structure of the chat completion response
  } catch (error) {
    console.error(`Failed to generate map code: ${error.message}`);
    throw error;
  }
}

async function writeCodeToFile(fileName, code) {
  try {
    await fs.writeFile(fileName, code);
    console.log(`Successfully wrote to ${fileName}`);
  } catch (error) {
    console.error(`Error writing to file: ${error.message}`);
  }
}

// Example usage of the function
const inputString = "I need a US map, states labeled with their two-digit postal codes in black capital letters, AL MN NM are filled red, NY OR are fulled blue, rest of the states are light grey. White borders, stroke 1px.";

generateMapCode(inputString)
  .then(code => writeCodeToFile('mapCode.js', code))
  .catch(err => console.error(`Error generating map code: ${err.message}`));
