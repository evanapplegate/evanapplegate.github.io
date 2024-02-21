from flask import Flask, request, render_template, flash, redirect, url_for
import pandas as pd
import os
import subprocess
import glob
from openai import OpenAI
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")  # Needed for flashing messages

# Initialize the OpenAI client with your API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

ALLOWED_EXTENSIONS = {'csv', 'xls', 'xlsx'}

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # This line ensures the uploads directory is created


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def index():
    image_files = []
    if request.method == 'POST':
        file = request.files.get('file')
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)  # Use the UPLOAD_FOLDER constant
            file.save(filepath)  # Save the file to the uploads directory

            input_string = request.form['map_request']
            for i in range(1, 4):
                script_filename = f'newmapCode_{i}.py'
                code = generate_map_code(input_string, filepath)  # Pass the filepath to your function
                write_code_to_file(script_filename, code)
                execute_script(script_filename)
                image_files.extend(rename_outputs(i))
            
            return render_template('index.html', image_files=image_files)
        
        else:
            flash('Invalid file type. Please upload a CSV, XLS, or XLSX file.')
            return redirect(request.url)

    return render_template('index.html')

def generate_map_code(input_string, filepath):
    prompt = f"{input_string}"
    # You can now use 'filepath' to refer to the uploaded file within this function
    try:
        completion = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are the master of python cartography. Use geopandas and matplotlib to write a script to create the map that was just described. If the map you're asked to create is of the united states, create the map using US_states.geojson for the state polygons and US_bounds.geojson for the state boundaries. The state's names are stored under the 'name' field in US_states.geojson. If the map request includes US postal code-labels, they're stored under the field 'postal' in US_states.geojson. If the map you're asked to create is of other countries/the world, create the map using countries.geojson for the country polygons and country_bounds.geojson for the national boundaries. The country names are stored under the 'NAME' field in countries.geojson. All map data is located within the directory 'map_data'.  The script should project the map using an appropriate projection (do NOT leave it in a geographic CRS), color the states according to the specified colors, add labels if asked. If you're asked to make a world map, project it in 'ESRI:54030'. If asked for a map that includes data from a supplied CSV, XLS or XLSX file, read it from the directory 'uploads' and use it. If your script renders a key for the color ramp, label it with whatever it is depicting. Save the output as both PDF and PNG. Ensure the script is ready to execute, starting with import geopandas as gpd and import matplotlib.pyplot as plt. Set the plt.rcParams pdf fonttype to 42, set the plt.rcParams ps.fonttype to 42, and set plt.rcParams['font.family'] to Arial. Don't bold the text. The PDF bbox_inches should be set to 'tight'. Polygons should have no stroke/outline. Borders should be stroked according to the format bounds.plot(ax=ax, color='USER_COLOR', linewidth='USER_CHOSEN_WIDTH'). Return with a MAXIMALLY concise response; your response should be the python code alone, zero intro or outro. Return nothing but the requested code! DO NOT include ticks surrounding the code, your response should start with import and end with ). No backticks!"},
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
    app.run(debug=True, use_reloader=False)
