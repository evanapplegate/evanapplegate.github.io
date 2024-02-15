import asyncio
from openai import OpenAI
import os
import subprocess
import glob

# Initialize the OpenAI client with your API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_map_code(input_string):
    # Define the prompt with the user's input string
    prompt = f"{input_string}"

    try:
        # Make a synchronous call to the OpenAI API using the client object
        completion = client.chat.completions.create(
            model="gpt-4-turbo-preview",  # Adjust the model as needed
            messages=[
                {"role": "system", "content": "You are the master of python cartography. Use geopandas and matplotlib to write a script to create the map that was just described; create the map using US_states.geojson and US_bounds.geojson for state boundaries. If the map request included postal code-labels, they're stored under the field 'postal' in the geojson. The script should project the map using an appropriate projection (do NOT leave it in a geographic CRS), color the states according to the specified colors, add labels with postal codes, and save the output as both PDF and PNG. Ensure the script is ready to execute, starting with import geopandas as gpd and import matplotlib.pyplot as plt. Set the plt.rcParams pdf fonttype to 42, set the plt.rcParams ps.fonttype to 42, and set plt.rcParams['font.family'] to Arial. Don't bold the text. The PDF bbox_inches should be set to 'tight'. Polygons should have no stroke/outline. Borders should be stroked according to the format bounds.plot(ax=ax, color='white', linewidth=1). Return with a MAXIMALLY concise response; your response should be the python code alone, zero intro or outro. Return nothing but the requested code! DO NOT include ticks surrounding the code, your response should start with import and end with ). No backticks!"},
                {"role": "user", "content": prompt}
            ]
        )

        # Extract the generated code from the response
        generated_code = completion.choices[0].message.content.strip()  # Access content attribute directly
        return generated_code
    except Exception as e:
        print(f"Failed to generate map code: {str(e)}")
        raise

def write_code_to_file(filename, code):
    try:
        # Write the generated code to a file
        with open(filename, "w") as file:
            file.write(code)
        print(f"Successfully wrote to {filename}")
    except Exception as e:
        print(f"Error writing to file: {str(e)}")
        raise

def execute_script(filename):
    # Execute the generated map code in a separate Python process
    try:
        subprocess.run(["python", filename], check=True)
        print(f"Executed {filename} successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error executing {filename}: {e}")

def rename_outputs(iteration):
    # Rename the output files to include the iteration number
    for filetype in ['*.pdf', '*.png']:
        for file in glob.glob(filetype):
            base, ext = os.path.splitext(file)
            new_name = f"{base}_{iteration}{ext}"
            os.rename(file, new_name)
            print(f"Renamed {file} to {new_name}")

def main():
    # Example usage of the function
    input_string = "I need a US map, states labeled with their two-digit postal codes in black capital letters, AL MN NM are filled red, NY OR are filled blue, rest of the states are light grey. White borders, stroke 1px."
    
    for i in range(1, 4):  # Loop to generate three different scripts
        # Append a number to each filename
        filename = f'newmapCode_{i}.py'

        # Generate the map code and write to file
        code = generate_map_code(input_string)
        write_code_to_file(filename, code)

        # Execute the generated code
        execute_script(filename)

        # Rename the output files to prevent overwriting
        rename_outputs(i)

if __name__ == "__main__":
    main()
