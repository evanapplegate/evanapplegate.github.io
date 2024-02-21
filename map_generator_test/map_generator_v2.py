from flask import Flask, request, render_template
import subprocess
import glob
import os
from openai import OpenAI

app = Flask(__name__)

# Initialize the OpenAI client with your API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/', methods=['GET', 'POST'])
def index():
    image_files = []
    if request.method == 'POST':
        input_string = request.form['map_request']
        for i in range(1, 4):  # Loop to generate three different scripts
            filename = f'newmapCode_{i}.py'
            code = generate_map_code(input_string)
            write_code_to_file(filename, code)
            execute_script(filename)
            image_files.extend(rename_outputs(i))
        return render_template('index.html', image_files=image_files)
    return render_template('index.html')

def generate_map_code(input_string):
    prompt = f"{input_string}"
    try:
        completion = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are the master of python cartography. Use geopandas and matplotlib to write a script to create the map that was just described; create the map using US_states.geojson and US_bounds.geojson for state boundaries. The state's names are stored under the 'name' field in US_states.geojson. If the map request includes postal code-labels, they're stored under the field 'postal' in US_states.geojson. The script should project the map using an appropriate projection (do NOT leave it in a geographic CRS), color the states according to the specified colors, add labels with postal codes, and save the output as both PDF and PNG. Ensure the script is ready to execute, starting with import geopandas as gpd and import matplotlib.pyplot as plt. Set the plt.rcParams pdf fonttype to 42, set the plt.rcParams ps.fonttype to 42, and set plt.rcParams['font.family'] to Arial. Don't bold the text. The PDF bbox_inches should be set to 'tight'. Polygons should have no stroke/outline. Borders should be stroked according to the format bounds.plot(ax=ax, color='white', linewidth=1). Return with a MAXIMALLY concise response; your response should be the python code alone, zero intro or outro. Return nothing but the requested code! DO NOT include ticks surrounding the code, your response should start with import and end with ). No backticks!"},
                {"role": "user", "content": prompt}
            ]
        )
        generated_code = completion.choices[0].message.content.strip()
        return generated_code
    except Exception as e:
        print(f"Failed to generate map code: {str(e)}")
        raise

def write_code_to_file(filename, code):
    with open(filename, "w") as file:
        file.write(code)
    print(f"Successfully wrote to {filename}")

def execute_script(filename):
    subprocess.run(["python", filename], check=True)
    print(f"Executed {filename} successfully.")

def rename_outputs(iteration):
    moved_files = []
    static_dir = 'static'
    os.makedirs(static_dir, exist_ok=True)  # Create the static directory if it doesn't exist
    for filetype in ['*.pdf', '*.png']:
        for file in glob.glob(filetype):
            base, ext = os.path.splitext(file)
            new_name = f"{base}_{iteration}{ext}"
            new_path = os.path.join(static_dir, new_name)
            os.rename(file, new_path)
            print(f"Renamed and moved {file} to {new_path}")
            if ext.lower() == '.png':
                moved_files.append(new_path)
    return moved_files

if __name__ == '__main__':
    app.run(debug=True)
